// =============================================================
// Sokoban Kebun — dorong balok kayu ke target.
// - Tembok diganti ilustrasi tanaman daun (🌿) yang membentuk
//   pembatas kotak.
// - Balok = balok kayu (🪵 di atas latar coklat).
// - Setiap gerakan langkah: bunyi "bip" (WebAudio).
// - Kontrol: tombol arah on-screen + arrow keys.
// =============================================================
import { useEffect, useRef, useState } from "react";
import type { GameProps } from "./GameModal";

// Map legend:
// # = wall (tanaman), . = floor, $ = box, * = box on goal,
// @ = player, + = player on goal, ' ' (treated as wall outside)
const LEVEL = [
  "########",
  "#..@...#",
  "#..$...#",
  "#..$..##",
  "##....##",
  "#...$..#",
  "#......#",
  "#...!..#",
  "#......#",
  "########",
];
// Goal positions (where boxes need to go) — stored separately:
const GOALS: [number, number][] = [[3, 1], [4, 4], [5, 6]]; // [x,y]

type Cell = "wall" | "floor";

function parse(): { grid: Cell[][]; player: { x: number; y: number }; boxes: { x: number; y: number }[] } {
  const grid: Cell[][] = [];
  let player = { x: 0, y: 0 };
  const boxes: { x: number; y: number }[] = [];
  for (let y = 0; y < LEVEL.length; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < LEVEL[y].length; x++) {
      const ch = LEVEL[y][x];
      if (ch === "#") row.push("wall");
      else row.push("floor");
      if (ch === "@") player = { x, y };
      if (ch === "$") boxes.push({ x, y });
    }
    grid.push(row);
  }
  return { grid, player, boxes };
}

export function Sokoban({ onScore }: GameProps) {
  const init = useRef(parse());
  const [player, setPlayer] = useState(init.current.player);
  const [boxes, setBoxes] = useState<{ x: number; y: number }[]>(init.current.boxes);
  const [moves, setMoves] = useState(0);
  const [scored, setScored] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const grid = init.current.grid;

  function beep() {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current!;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.value = 720;
      g.gain.value = 0.05;
      o.connect(g); g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.07);
    } catch {}
  }

  function isWall(x: number, y: number) {
    if (y < 0 || y >= grid.length) return true;
    if (x < 0 || x >= grid[0].length) return true;
    return grid[y][x] === "wall";
  }
  function boxAt(x: number, y: number, list = boxes) {
    return list.findIndex((b) => b.x === x && b.y === y);
  }

  function move(dx: number, dy: number) {
    const nx = player.x + dx, ny = player.y + dy;
    if (isWall(nx, ny)) return;
    const bi = boxAt(nx, ny);
    if (bi >= 0) {
      const bx = nx + dx, by = ny + dy;
      if (isWall(bx, by) || boxAt(bx, by) >= 0) return;
      const nb = [...boxes];
      nb[bi] = { x: bx, y: by };
      setBoxes(nb);
    }
    setPlayer({ x: nx, y: ny });
    setMoves((m) => m + 1);
    beep();
  }

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") { e.preventDefault(); move(0, -1); }
      else if (e.key === "ArrowDown") { e.preventDefault(); move(0, 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); move(-1, 0); }
      else if (e.key === "ArrowRight") { e.preventDefault(); move(1, 0); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, boxes]);

  // Win check
  const won = GOALS.every(([gx, gy]) => boxes.some((b) => b.x === gx && b.y === gy));
  useEffect(() => {
    if (won && !scored) { onScore(15); setScored(true); }
  }, [won, scored, onScore]);

  function reset() {
    const p = parse();
    init.current = p;
    setPlayer(p.player); setBoxes(p.boxes); setMoves(0); setScored(false);
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center justify-between w-full max-w-md mb-2 text-sm">
        <div>🪵 Langkah: <b>{moves}</b></div>
        <div>{won ? "🎉 Selesai!" : `Target tersisa: ${GOALS.length - GOALS.filter(([gx,gy]) => boxes.some(b => b.x===gx && b.y===gy)).length}`}</div>
      </div>

      <div
        className="grid border-4 border-green-800/40 rounded-lg overflow-hidden bg-amber-50"
        style={{
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          width: "min(90vw, 420px)",
          aspectRatio: `${grid[0].length} / ${grid.length}`,
        }}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => {
            const isPlayer = player.x === x && player.y === y;
            const bi = boxAt(x, y);
            const isGoal = GOALS.some(([gx, gy]) => gx === x && gy === y);
            return (
              <div
                key={`${x}-${y}`}
                className={`relative aspect-square flex items-center justify-center text-base ${
                  cell === "wall"
                    ? "bg-green-700/90"
                    : isGoal
                    ? "bg-amber-200/70"
                    : "bg-amber-100"
                }`}
              >
                {cell === "wall" && <span className="text-lg">🌿</span>}
                {cell === "floor" && isGoal && !isPlayer && bi < 0 && (
                  <span className="text-amber-700/70 text-xs">◎</span>
                )}
                {bi >= 0 && (
                  <div className={`w-[85%] h-[85%] rounded-sm flex items-center justify-center ${
                    isGoal ? "bg-amber-700" : "bg-amber-600"
                  }`}>
                    <span className="text-xs">🪵</span>
                  </div>
                )}
                {isPlayer && <span className="text-lg z-10">🧒</span>}
              </div>
            );
          })
        )}
      </div>

      {/* D-pad */}
      <div className="mt-4 grid grid-cols-3 gap-2 select-none" style={{ width: 180 }}>
        <div />
        <button onClick={() => move(0, -1)} className="aspect-square rounded-xl bg-white/80 text-2xl font-bold soft-shadow">↑</button>
        <div />
        <button onClick={() => move(-1, 0)} className="aspect-square rounded-xl bg-white/80 text-2xl font-bold soft-shadow">←</button>
        <button onClick={reset} className="aspect-square rounded-xl bg-blush/80 text-xs font-semibold">Reset</button>
        <button onClick={() => move(1, 0)} className="aspect-square rounded-xl bg-white/80 text-2xl font-bold soft-shadow">→</button>
        <div />
        <button onClick={() => move(0, 1)} className="aspect-square rounded-xl bg-white/80 text-2xl font-bold soft-shadow">↓</button>
        <div />
      </div>
    </div>
  );
}
