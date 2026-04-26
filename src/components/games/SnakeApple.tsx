// =============================================================
// Ular Makan Apel — game klasik snake.
// - Otomatis fullscreen saat mulai.
// - Kontrol pakai tombol arah on-screen (atas/bawah/kiri/kanan)
//   ATAU keyboard arrow keys.
// =============================================================
import { useEffect, useRef, useState } from "react";
import type { GameProps } from "./GameModal";

const COLS = 20;
const ROWS = 20;
const TICK = 140;

type P = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";

const DIR_VEC: Record<Dir, P> = {
  up: { x: 0, y: -1 }, down: { x: 0, y: 1 },
  left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
};

export function SnakeApple({ onScore }: GameProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [snake, setSnake] = useState<P[]>([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]);
  const [apple, setApple] = useState<P>({ x: 15, y: 10 });
  const [dir, setDir] = useState<Dir>("right");
  const dirRef = useRef<Dir>("right");
  const nextDirRef = useRef<Dir>("right");
  const [running, setRunning] = useState(true);
  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);
  const [scored, setScored] = useState(false);

  // Auto fullscreen saat mount
  useEffect(() => {
    const el = wrapRef.current;
    if (el && !document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    }
    return () => { if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}); };
  }, []);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
        w: "up", s: "down", a: "left", d: "right",
      };
      const nd = map[e.key];
      if (nd) { e.preventDefault(); changeDir(nd); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function changeDir(nd: Dir) {
    const cur = dirRef.current;
    if ((cur === "up" && nd === "down") || (cur === "down" && nd === "up")) return;
    if ((cur === "left" && nd === "right") || (cur === "right" && nd === "left")) return;
    nextDirRef.current = nd;
    setDir(nd);
  }

  // Game loop
  useEffect(() => {
    if (!running || over) return;
    const id = setInterval(() => {
      dirRef.current = nextDirRef.current;
      setSnake((prev) => {
        const v = DIR_VEC[dirRef.current];
        const head = { x: prev[0].x + v.x, y: prev[0].y + v.y };
        // wall
        if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS) {
          setOver(true); setRunning(false); return prev;
        }
        // self
        if (prev.some((s) => s.x === head.x && s.y === head.y)) {
          setOver(true); setRunning(false); return prev;
        }
        const ate = head.x === apple.x && head.y === apple.y;
        const next = [head, ...prev];
        if (!ate) next.pop(); else {
          setScore((s) => s + 1);
          // taruh apel baru di sel kosong
          let na: P;
          do { na = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
          while (next.some((s) => s.x === na.x && s.y === na.y));
          setApple(na);
        }
        return next;
      });
    }, TICK);
    return () => clearInterval(id);
  }, [running, over, apple]);

  useEffect(() => {
    if (over && score > 0 && !scored) { onScore(Math.min(score, 30)); setScored(true); }
  }, [over, score, scored, onScore]);

  function reset() {
    setSnake([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]);
    setApple({ x: 15, y: 10 });
    dirRef.current = "right"; nextDirRef.current = "right"; setDir("right");
    setOver(false); setScore(0); setRunning(true); setScored(false);
  }

  return (
    <div ref={wrapRef} className="w-full flex flex-col items-center bg-mint/30 rounded-xl p-3 fullscreen:bg-background fullscreen:justify-center fullscreen:h-screen">
      <div className="flex items-center justify-between w-full max-w-md mb-2">
        <div className="font-display font-bold">🐍 Skor: {score}</div>
        <div className="text-xs text-muted-foreground">Arah: {dir}</div>
      </div>

      {/* Board */}
      <div
        className="grid bg-green-900/20 border-4 border-green-700/40 rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          width: "min(90vw, 500px)",
          aspectRatio: `${COLS} / ${ROWS}`,
        }}
      >
        {Array.from({ length: COLS * ROWS }).map((_, i) => {
          const x = i % COLS, y = Math.floor(i / COLS);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isBody = !isHead && snake.some((s) => s.x === x && s.y === y);
          const isApple = apple.x === x && apple.y === y;
          return (
            <div key={i} className="aspect-square flex items-center justify-center">
              {isHead && <div className="w-full h-full bg-green-600 rounded-sm flex items-center justify-center text-[10px]">🐍</div>}
              {isBody && <div className="w-[85%] h-[85%] bg-green-500 rounded-sm" />}
              {isApple && <div className="text-base">🍎</div>}
            </div>
          );
        })}
      </div>

      {over && (
        <div className="mt-3 text-center">
          <div className="font-display font-bold text-rose">Game Over — skor {score}</div>
          <button onClick={reset} className="mt-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold">
            Main Lagi
          </button>
        </div>
      )}

      {/* D-pad analog */}
      <div className="mt-4 grid grid-cols-3 gap-2 select-none" style={{ width: 200 }}>
        <div />
        <button onClick={() => changeDir("up")} className="aspect-square rounded-xl bg-white/80 hover:bg-white text-2xl font-bold soft-shadow">↑</button>
        <div />
        <button onClick={() => changeDir("left")} className="aspect-square rounded-xl bg-white/80 hover:bg-white text-2xl font-bold soft-shadow">←</button>
        <button onClick={() => setRunning((r) => !r)} className="aspect-square rounded-xl bg-blush/80 text-xs font-semibold">
          {running ? "Pause" : "Play"}
        </button>
        <button onClick={() => changeDir("right")} className="aspect-square rounded-xl bg-white/80 hover:bg-white text-2xl font-bold soft-shadow">→</button>
        <div />
        <button onClick={() => changeDir("down")} className="aspect-square rounded-xl bg-white/80 hover:bg-white text-2xl font-bold soft-shadow">↓</button>
        <div />
      </div>
    </div>
  );
}
