// Game 8: Hindari Awan — gerakkan cloud, hindari rintangan jatuh.
import { useEffect, useRef, useState } from "react";
import type { GameProps } from "./GameModal";
import { StartButton, FinishedView } from "./HeartClicker";

type Obstacle = { id: number; x: number; y: number };

export function DodgeGame({ onScore }: GameProps) {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [playerX, setPlayerX] = useState(50);
  const [survived, setSurvived] = useState(0);
  const idRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const spawn = setInterval(() => {
      setObstacles((o) => [...o, { id: ++idRef.current, x: Math.random() * 90 + 5, y: 0 }]);
    }, 600);
    const tick = setInterval(() => setSurvived((s) => s + 1), 1000);
    return () => { clearInterval(spawn); clearInterval(tick); };
  }, [running]);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const step = () => {
      setObstacles((prev) => {
        const next: Obstacle[] = [];
        for (const o of prev) {
          const ny = o.y + 1.6;
          if (ny > 95) continue;
          // collision with player at y=85
          if (ny > 80 && ny < 92 && Math.abs(o.x - playerX) < 8) {
            // hit
            setRunning(false);
            setDone(true);
            const reward = Math.max(3, survived * 2);
            if (reward > 0) onScore(reward);
            return [];
          }
          next.push({ ...o, y: ny });
        }
        return next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [running, playerX, survived, onScore]);

  if (!running && !done) return <StartButton onStart={() => { setObstacles([]); setSurvived(0); setRunning(true); }} label="Mulai ☁️" />;
  if (done) return <FinishedView score={Math.max(3, survived * 2)} onReplay={() => { setObstacles([]); setSurvived(0); setDone(false); setRunning(true); }} />;

  return (
    <div
      className="relative w-full h-72 rounded-2xl overflow-hidden bg-gradient-to-b from-lavender/40 to-sky/40 cursor-none"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPlayerX(((e.clientX - rect.left) / rect.width) * 100);
      }}
      onTouchMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const t = e.touches[0];
        setPlayerX(((t.clientX - rect.left) / rect.width) * 100);
      }}
    >
      <div className="absolute top-2 left-2 right-2 flex justify-between text-xs font-semibold">
        <span>⏱ {survived}s</span>
        <span>geser mouse buat hindar</span>
      </div>
      {obstacles.map((o) => (
        <div key={o.id} className="absolute text-2xl" style={{ left: `${o.x}%`, top: `${o.y}%`, transform: "translate(-50%, -50%)" }}>
          🌧️
        </div>
      ))}
      <div className="absolute text-3xl" style={{ left: `${playerX}%`, top: "85%", transform: "translate(-50%, -50%)" }}>
        ☁️
      </div>
    </div>
  );
}
