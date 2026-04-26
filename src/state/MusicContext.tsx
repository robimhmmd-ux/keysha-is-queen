// =============================================================
// Music player context — playback state survives across pages
// karena Provider-nya hidup di root layout.
// Daftar lagu sekarang dipisah ke src/assets/music/tracks.ts
// =============================================================
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { TRACKS, type Track } from "@/assets/music/tracks";

// Re-export biar konsumen lama (`import { TRACKS } from "@/state/MusicContext"`) tetap jalan
export { TRACKS };
export type { Track };

type PlayerState = {
  current: Track;
  isPlaying: boolean;
  volume: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (v: number) => void;
  selectTrack: (id: string) => void;
};

const Ctx = createContext<PlayerState | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Lazy-create audio element once on client
  useEffect(() => {
    if (typeof window === "undefined") return;
    const a = new Audio();
    a.loop = false;
    a.volume = volume;
    audioRef.current = a;
    // Saat lagu habis: lanjut otomatis ke track berikutnya & tetap play
    a.addEventListener("ended", () => {
      setIndex((i) => (i + 1) % TRACKS.length);
      setPlaying(true);
    });
    return () => { a.pause(); audioRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update src tiap kali track ganti
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.src = TRACKS[index].src;
    if (isPlaying) a.play().catch(() => setPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Apply play/pause
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) a.play().catch(() => setPlaying(false));
    else a.pause();
  }, [isPlaying]);

  // Apply volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const value: PlayerState = {
    current: TRACKS[index],
    isPlaying,
    volume,
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    toggle: () => setPlaying((p) => !p),
    next: () => setIndex((i) => (i + 1) % TRACKS.length),
    prev: () => setIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length),
    setVolume: (v) => setVolumeState(v),
    selectTrack: (id) => {
      const i = TRACKS.findIndex((t) => t.id === id);
      if (i >= 0) { setIndex(i); setPlaying(true); }
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMusic() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
}
