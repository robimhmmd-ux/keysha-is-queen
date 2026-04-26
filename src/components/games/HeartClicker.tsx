// Game 1: Klik Hati — hearts pop up randomly, click to score.
// 30 second cozy session. Each click = +1 heart point.
import { useEffect, useState, useRef } from "react";
import type { GameProps } from "./GameModal";

type Bubble = { id: number; x: number; y: number };

export function HeartClicker({ onScore }: GameProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);
  const idRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const spawn = setInterval(() => {
      setBubbles((b) => [
        ...b,
        { id: ++idRef.current, x: 10 + Math.random() * 80, y: 10 + Math.random() * 70 },
      ]);
    }, 600);
    const tick = setInterval(() => setTime((t) => t - 1), 1000);
    return () => { clearInterval(spawn); clearInterval(tick); };
  }, [running]);

  useEffect(() => {
    if (time <= 0 && running) {
      setRunning(false);
      if (score > 0) onScore(score);
    }
  }, [time, running, score, onScore]);

  const pop = (id: number) => {
    setBubbles((b) => b.filter((x) => x.id !== id));
    setScore((s) => s + 1);
  };

  if (!running && time === 30) {
    return <StartButton onStart={() => setRunning(true)} label="Mulai 💗" />;
  }
  if (!running) {
    return <FinishedView score={score} onReplay={() => { setScore(0); setTime(30); setBubbles([]); setRunning(true); }} />;
  }

  return (
    <div className="relative w-full h-72">
      <div className="absolute top-0 left-0 right-0 flex justify-between text-xs font-semibold z-10">
        <span>💗 {score}</span>
        <span>⏱ {time}s</span>
      </div>
      {bubbles.map((b) => (
        <button
          key={b.id}
          onClick={() => pop(b.id)}
          className="absolute text-3xl animate-pop-in hover:scale-125 transition-transform"
          style={{ left: `${b.x}%`, top: `${b.y}%` }}
          aria-label="Pop heart"
        >
          💗
        </button>
      ))}
    </div>
  );
}

export function StartButton({ onStart, label }: { onStart: () => void; label: string }) {
  return (
    <button
      onClick={onStart}
      className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg soft-shadow hover:scale-105 transition"
    >
      {label}
    </button>
  );
}

export function FinishedView({ score, onReplay }: { score: number; onReplay: () => void }) {
  return (
    <div className="text-center">
      <div className="text-5xl mb-3 animate-bounce-soft">🤍</div>
      <p className="font-display text-2xl font-bold">Hebat! Skor: {score}</p>
      <p className="text-sm text-muted-foreground mt-1">+{score} heart points masuk ke kantong kamu</p>
      <button
        onClick={onReplay}
        className="mt-4 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:scale-105 transition"
      >
        Main lagi
      </button>
    </div>
  );
}
