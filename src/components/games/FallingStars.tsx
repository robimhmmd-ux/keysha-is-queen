// Game 2: Tangkap Bintang — basket follows mouse, catch falling stars.
import { useEffect, useRef, useState } from "react";
import type { GameProps } from "./GameModal";
import { StartButton, FinishedView } from "./HeartClicker";

type Star = { id: number; x: number; y: number; speed: number };

export function FallingStars({ onScore }: GameProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const [basketX, setBasketX] = useState(50);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const spawn = setInterval(() => {
      setStars((s) => [...s, { id: ++idRef.current, x: Math.random() * 90 + 5, y: 0, speed: 1 + Math.random() * 1.5 }]);
    }, 700);
    const tick = setInterval(() => setTime((t) => t - 1), 1000);
    return () => { clearInterval(spawn); clearInterval(tick); };
  }, [running]);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const step = () => {
      setStars((prev) => {
        const next: Star[] = [];
        for (const s of prev) {
          const ny = s.y + s.speed;
          if (ny >= 88) {
            // check basket catch
            if (Math.abs(s.x - basketX) < 10) {
              setScore((sc) => sc + 1);
            }
            continue;
          }
          next.push({ ...s, y: ny });
        }
        return next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [running, basketX]);

  useEffect(() => {
    if (time <= 0 && running) {
      setRunning(false);
      if (score > 0) onScore(score * 2);
    }
  }, [time, running, score, onScore]);

  if (!running && time === 30) return <StartButton onStart={() => setRunning(true)} label="Mulai ⭐" />;
  if (!running) return <FinishedView score={score * 2} onReplay={() => { setScore(0); setTime(30); setStars([]); setRunning(true); }} />;

  return (
    <div
      ref={areaRef}
      className="relative w-full h-72 rounded-2xl overflow-hidden bg-gradient-to-b from-sky/40 to-lavender/40 cursor-none"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setBasketX(((e.clientX - rect.left) / rect.width) * 100);
      }}
    >
      <div className="absolute top-2 left-2 right-2 flex justify-between text-xs font-semibold">
        <span>⭐ {score}</span>
        <span>⏱ {time}s</span>
      </div>
      {stars.map((s) => (
        <div key={s.id} className="absolute text-2xl" style={{ left: `${s.x}%`, top: `${s.y}%`, transform: "translate(-50%, -50%)" }}>
          ⭐
        </div>
      ))}
      <div className="absolute text-3xl" style={{ left: `${basketX}%`, top: "88%", transform: "translate(-50%, -50%)" }}>
        🧺
      </div>
    </div>
  );
}
