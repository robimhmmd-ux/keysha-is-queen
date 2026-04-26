// Game 6: Slide Puzzle — 3x3 number puzzle. Solve = reward.
import { useState, useEffect } from "react";
import type { GameProps } from "./GameModal";
import { StartButton, FinishedView } from "./HeartClicker";

const SIZE = 3;
const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 0 = empty

function shuffle(): number[] {
  // Random valid shuffle by performing N random moves from solved
  const arr = [...SOLVED];
  let empty = 8;
  for (let i = 0; i < 80; i++) {
    const neighbors = neighborsOf(empty);
    const move = neighbors[Math.floor(Math.random() * neighbors.length)];
    [arr[empty], arr[move]] = [arr[move], arr[empty]];
    empty = move;
  }
  return arr;
}

function neighborsOf(i: number): number[] {
  const r = Math.floor(i / SIZE), c = i % SIZE;
  const out: number[] = [];
  if (r > 0) out.push(i - SIZE);
  if (r < SIZE - 1) out.push(i + SIZE);
  if (c > 0) out.push(i - 1);
  if (c < SIZE - 1) out.push(i + 1);
  return out;
}

export function SlidePuzzle({ onScore }: GameProps) {
  const [tiles, setTiles] = useState<number[]>(SOLVED);
  const [started, setStarted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (started && tiles.join() === SOLVED.join() && moves > 0 && !done) {
      setDone(true);
      onScore(20);
    }
  }, [tiles, started, moves, done, onScore]);

  const click = (i: number) => {
    const empty = tiles.indexOf(0);
    if (!neighborsOf(empty).includes(i)) return;
    const next = [...tiles];
    [next[empty], next[i]] = [next[i], next[empty]];
    setTiles(next);
    setMoves((m) => m + 1);
  };

  if (!started) {
    return <StartButton onStart={() => { setTiles(shuffle()); setStarted(true); setMoves(0); }} label="Mulai 🧩" />;
  }
  if (done) return <FinishedView score={20} onReplay={() => { setTiles(shuffle()); setMoves(0); setDone(false); }} />;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-semibold mb-3">
        <span>Moves: {moves}</span>
        <span>Susun jadi 1-8 ✨</span>
      </div>
      <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto">
        {tiles.map((t, i) => (
          <button
            key={i}
            onClick={() => click(i)}
            className={`aspect-square rounded-xl text-2xl font-display font-bold flex items-center justify-center transition-all ${
              t === 0
                ? "bg-transparent"
                : "bg-gradient-to-br from-blush to-rose text-foreground hover:scale-105 soft-shadow"
            }`}
          >
            {t === 0 ? "" : t}
          </button>
        ))}
      </div>
    </div>
  );
}
