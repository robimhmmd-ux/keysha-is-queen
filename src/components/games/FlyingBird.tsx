// =============================================================
// FlyingBird — versi cozy dari Flappy Bird.
// - Klik / Spasi untuk lompat (bird "flap")
// - Hindari pipa hijau yang datang dari kanan
// - Setiap pipa terlewati = +1 skor, di akhir dikonversi heart
// - Game pakai requestAnimationFrame untuk loop yang halus
// =============================================================
import { useEffect, useRef, useState, useCallback } from "react";
import type { GameProps } from "./GameModal";
import { StartButton, FinishedView } from "./HeartClicker";

// Konstanta dunia game
const W = 320;          // lebar kanvas logikal
const H = 360;          // tinggi kanvas logikal
const G = 0.4;          // gravitasi
const FLAP = -6.5;      // velocity saat lompat
const PIPE_GAP = 110;   // jarak antara pipa atas & bawah
const PIPE_W = 46;      // lebar pipa
const PIPE_SPEED = 1.8; // kecepatan pipa bergerak ke kiri
const PIPE_INTERVAL = 1500; // ms antar spawn pipa
const BIRD_X = 70;      // posisi X bird (tetap)
const BIRD_R = 14;      // radius bird untuk collision

type Pipe = { x: number; gapY: number; passed: boolean };

export function FlyingBird({ onScore }: GameProps) {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  // Pakai ref supaya loop game ga ke-render ulang React tiap frame
  const yRef = useRef(H / 2);
  const vRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);
  const lastSpawn = useRef(0);
  const rafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const birdRef = useRef<HTMLDivElement>(null);

  // Reset state game
  const reset = useCallback(() => {
    yRef.current = H / 2;
    vRef.current = 0;
    pipesRef.current = [];
    lastSpawn.current = 0;
    setScore(0);
    setDone(false);
  }, []);

  // Aksi lompat
  const flap = useCallback(() => {
    if (!started || done) return;
    vRef.current = FLAP;
  }, [started, done]);

  // Listener input (klik & keyboard)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flap]);

  // Game loop utama
  useEffect(() => {
    if (!started || done) return;

    let running = true;
    let prev = performance.now();

    const loop = (now: number) => {
      if (!running) return;
      const dt = now - prev;
      prev = now;

      // Update bird (fisika)
      vRef.current += G;
      yRef.current += vRef.current;

      // Spawn pipa
      lastSpawn.current += dt;
      if (lastSpawn.current >= PIPE_INTERVAL) {
        lastSpawn.current = 0;
        const gapY = 60 + Math.random() * (H - 120 - PIPE_GAP);
        pipesRef.current.push({ x: W, gapY, passed: false });
      }

      // Geser pipa & cek lewat
      for (const p of pipesRef.current) {
        p.x -= PIPE_SPEED;
        if (!p.passed && p.x + PIPE_W < BIRD_X) {
          p.passed = true;
          setScore((s) => s + 1);
        }
      }
      // Buang pipa yang udah keluar layar
      pipesRef.current = pipesRef.current.filter((p) => p.x + PIPE_W > -10);

      // Cek collision: lantai/atap atau kena pipa
      let dead = false;
      if (yRef.current + BIRD_R >= H || yRef.current - BIRD_R <= 0) dead = true;
      for (const p of pipesRef.current) {
        const inX = BIRD_X + BIRD_R > p.x && BIRD_X - BIRD_R < p.x + PIPE_W;
        const inGap = yRef.current - BIRD_R > p.gapY && yRef.current + BIRD_R < p.gapY + PIPE_GAP;
        if (inX && !inGap) dead = true;
      }

      // Render manual lewat DOM (cepat, ga butuh re-render React)
      const c = containerRef.current;
      const bird = birdRef.current;
      if (c) {
        // Update / buat ulang elemen pipa via dataset
        // Cari semua child pipa lama
        c.querySelectorAll("[data-pipe]").forEach((el) => el.remove());
        for (const p of pipesRef.current) {
          // Pipa atas
          const top = document.createElement("div");
          top.dataset.pipe = "1";
          top.className = "absolute bg-mint border-2 border-emerald-300/70 rounded-b-md";
          top.style.left = `${p.x}px`;
          top.style.top = "0px";
          top.style.width = `${PIPE_W}px`;
          top.style.height = `${p.gapY}px`;
          c.appendChild(top);
          // Pipa bawah
          const bot = document.createElement("div");
          bot.dataset.pipe = "1";
          bot.className = "absolute bg-mint border-2 border-emerald-300/70 rounded-t-md";
          bot.style.left = `${p.x}px`;
          bot.style.top = `${p.gapY + PIPE_GAP}px`;
          bot.style.width = `${PIPE_W}px`;
          bot.style.height = `${H - (p.gapY + PIPE_GAP)}px`;
          c.appendChild(bot);
        }
      }
      if (bird) {
        bird.style.transform = `translate(${BIRD_X - BIRD_R}px, ${yRef.current - BIRD_R}px) rotate(${Math.max(-25, Math.min(60, vRef.current * 4))}deg)`;
      }

      if (dead) {
        running = false;
        setDone(true);
        // Hadiah heart point: skor x 5
        // (akan dipanggil dari useEffect di bawah supaya nggak race condition)
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame((t) => { prev = t; loop(t); });
    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [started, done]);

  // Saat selesai, kasih heart points
  useEffect(() => {
    if (done && score > 0) onScore(score * 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  if (!started) {
    return (
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Klik atau tekan <kbd className="px-1.5 py-0.5 rounded bg-white/70 text-xs">Spasi</kbd> buat lompat 🐦
        </p>
        <StartButton onStart={() => { reset(); setStarted(true); }} label="Mulai 🐦" />
      </div>
    );
  }
  if (done) {
    return (
      <FinishedView
        score={score * 5}
        onReplay={() => { reset(); setStarted(true); }}
      />
    );
  }

  return (
    <div className="flex flex-col items-center select-none">
      <div className="text-xs font-semibold mb-2">Skor: {score}</div>
      <div
        ref={containerRef}
        onClick={flap}
        onTouchStart={flap}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-sky to-blush border-2 border-white/60 cursor-pointer"
        style={{ width: W, height: H }}
        role="button"
        aria-label="Klik untuk lompat"
      >
        {/* Bird: emoji yang diposisikan via transform tiap frame */}
        <div
          ref={birdRef}
          className="absolute text-2xl will-change-transform"
          style={{ width: BIRD_R * 2, height: BIRD_R * 2, lineHeight: `${BIRD_R * 2}px`, textAlign: "center" }}
        >
          🐦
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">klik area atau tekan spasi</p>
    </div>
  );
}
