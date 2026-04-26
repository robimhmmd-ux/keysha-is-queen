// Game 4: Tepuk Kucing — gentle whack-a-mole. Kucing pop up di hole, tepuk pelan.
import { useEffect, useState } from "react";
import type { GameProps } from "./GameModal";
import { StartButton, FinishedView } from "./HeartClicker";

const HOLES = 9;

export function WhackGame({ onScore }: GameProps) {
  const [active, setActive] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(25);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const pop = setInterval(() => setActive(Math.floor(Math.random() * HOLES)), 900);
    const tick = setInterval(() => setTime((t) => t - 1), 1000);
    return () => { clearInterval(pop); clearInterval(tick); };
  }, [running]);

  useEffect(() => {
    if (time <= 0 && running) {
      setRunning(false);
      if (score > 0) onScore(score * 2);
    }
  }, [time, running, score, onScore]);

  const tap = (i: number) => {
    if (i === active) {
      setScore((s) => s + 1);
      setActive(null);
    }
  };

  if (!running && time === 25) return <StartButton onStart={() => setRunning(true)} label="Mulai 🐱" />;
  if (!running) return <FinishedView score={score * 2} onReplay={() => { setScore(0); setTime(25); setRunning(true); }} />;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-semibold mb-3">
        <span>🐱 {score}</span>
        <span>⏱ {time}s</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: HOLES }).map((_, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            className="aspect-square rounded-2xl bg-gradient-to-br from-butter to-blush flex items-center justify-center text-4xl transition-all hover:scale-105"
          >
            {active === i ? <span className="animate-pop-in">🐱</span> : <span className="opacity-30">·</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
