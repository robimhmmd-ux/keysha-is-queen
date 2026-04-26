// =============================================================
// MusicButton + MusicPanel
// -------------------------------------------------------------
// Sebelumnya: mini player nempel di pojok kiri bawah terus.
// Sekarang: cuma sebuah TOMBOL kecil (di HUD). Klik tombol ->
// muncul panel pemutar musik (mirip "masuk Playground"). Panel
// berisi kontrol play/pause/next/prev, volume, dan daftar lagu.
// Audio tetap hidup lintas halaman karena state-nya di
// MusicProvider (root).
// =============================================================
import { useState } from "react";
import { useMusic, TRACKS } from "@/state/MusicContext";
// Logo musik — bisa diganti di src/assets/logos/music.png
import musicLogo from "@/assets/logos/music.png";

export function MusicButton() {
  const { current, isPlaying, toggle, next, prev, volume, setVolume, selectTrack } = useMusic();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Tombol kecil di HUD — selalu kelihatan */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/70 hover:bg-white transition border border-white/60 soft-shadow"
        aria-label="Buka pemutar musik"
        title="Musik"
      >
        <img
          src={musicLogo}
          alt=""
          width={20}
          height={20}
          className={`w-5 h-5 ${isPlaying ? "animate-bounce-soft" : ""}`}
        />
        <span className="text-sm font-semibold hidden sm:inline">
          {isPlaying ? "Lagi muter" : "Musik"}
        </span>
      </button>

      {/* Panel modal — muncul saat tombol diklik.
          Klik di mana saja DI LUAR kotak putih akan menutup. */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: "color-mix(in oklab, var(--blush) 50%, transparent)", backdropFilter: "blur(14px)" }}
          onClick={() => setOpen(false)}
        >
          <div
            // Posisi sedikit lebih ke tengah (mt-16) biar slider volume gampang dipencet
            className="glass-card rounded-3xl p-6 w-full max-w-md animate-pop-in mt-16 sm:mt-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header panel */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose to-lavender flex items-center justify-center overflow-hidden">
                <img src={musicLogo} alt="" className={`w-10 h-10 ${isPlaying ? "animate-bounce-soft" : ""}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Sedang diputar
                </div>
                <div className="font-display font-bold text-lg truncate">{current.title}</div>
                <div className="text-xs text-muted-foreground truncate">{current.artist}</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/70 transition text-muted-foreground"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            {/* Kontrol play/pause/next/prev */}
            <div className="flex items-center justify-center gap-4 mb-5">
              <button
                onClick={prev}
                className="w-11 h-11 rounded-full hover:bg-white/70 transition flex items-center justify-center"
                aria-label="Sebelumnya"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
              </button>
              <button
                onClick={toggle}
                className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition soft-shadow"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
              <button
                onClick={next}
                className="w-11 h-11 rounded-full hover:bg-white/70 transition flex items-center justify-center"
                aria-label="Selanjutnya"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z"/></svg>
              </button>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-sm">🔈</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-[var(--rose)]"
                aria-label="Volume"
              />
              <span className="text-sm">🔊</span>
            </div>

            {/* Daftar lagu */}
            <div className="border-t border-border/60 pt-3">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                Pilih lagu
              </div>
              <ul className="max-h-56 overflow-auto scrollbar-thin -mx-1">
                {TRACKS.map((t) => {
                  const active = t.id === current.id;
                  return (
                    <li key={t.id}>
                      <button
                        onClick={() => selectTrack(t.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 transition ${
                          active ? "bg-blush/70 font-semibold" : "hover:bg-white/60"
                        }`}
                      >
                        <span className="w-5 text-center">
                          {active && isPlaying ? "♪" : "♡"}
                        </span>
                        <span className="truncate flex-1">{t.title}</span>
                        <span className="text-xs text-muted-foreground truncate">{t.artist}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
