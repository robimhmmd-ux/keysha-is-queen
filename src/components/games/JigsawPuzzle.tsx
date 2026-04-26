// =============================================================
// Jigsaw Puzzle 20x20 (400 keping).
// Versi sederhana: gambar dibagi jadi grid 20x20, kepingnya
// diacak. Klik 2 keping untuk swap. Selesai saat semua di tempat.
//
// Gambar dipakai dari URL Picsum (random) — bisa diganti dengan
// import gambar lokal kalau mau.
// =============================================================
import { useMemo, useState } from "react";
import type { GameProps } from "./GameModal";

const SIZE = 20; // 20x20
const TOTAL = SIZE * SIZE;
const IMG = "https://picsum.photos/seed/esyha-jigsaw/600/600";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function JigsawPuzzle({ onScore }: GameProps) {
  // pieces[displayIndex] = correctIndex
  const [pieces, setPieces] = useState<number[]>(() => shuffle(Array.from({ length: TOTAL }, (_, i) => i)));
  const [selected, setSelected] = useState<number | null>(null);
  const [scored, setScored] = useState(false);

  const solved = useMemo(() => pieces.every((p, i) => p === i), [pieces]);
  if (solved && !scored) { setScored(true); onScore(20); }

  function clickPiece(displayIdx: number) {
    if (selected === null) { setSelected(displayIdx); return; }
    if (selected === displayIdx) { setSelected(null); return; }
    const next = [...pieces];
    [next[selected], next[displayIdx]] = [next[displayIdx], next[selected]];
    setPieces(next);
    setSelected(null);
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center text-xs text-muted-foreground mb-2">
        Klik 2 keping buat tukar posisi. Total 400 keping (20×20).
      </div>

      <div
        className="grid mx-auto border-2 border-white/60 rounded-md overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
          width: "min(90vw, 480px)",
          aspectRatio: "1 / 1",
        }}
      >
        {pieces.map((correctIdx, displayIdx) => {
          const row = Math.floor(correctIdx / SIZE);
          const col = correctIdx % SIZE;
          const isSel = selected === displayIdx;
          const isPlaced = correctIdx === displayIdx;
          return (
            <button
              key={displayIdx}
              onClick={() => clickPiece(displayIdx)}
              className={`relative ${isSel ? "ring-2 ring-rose z-10" : ""} ${isPlaced ? "" : "hover:opacity-80"}`}
              style={{
                backgroundImage: `url(${IMG})`,
                backgroundSize: `${SIZE * 100}% ${SIZE * 100}%`,
                backgroundPosition: `${(col / (SIZE - 1)) * 100}% ${(row / (SIZE - 1)) * 100}%`,
              }}
              aria-label={`piece ${displayIdx}`}
            />
          );
        })}
      </div>

      {solved && (
        <div className="text-center mt-3 font-display font-bold text-rose">🎉 Puzzle selesai!</div>
      )}

      <div className="text-center mt-3">
        <button
          onClick={() => { setPieces(shuffle(Array.from({ length: TOTAL }, (_, i) => i))); setScored(false); }}
          className="px-4 py-2 rounded-full bg-white/70 text-sm font-semibold"
        >
          Acak Ulang
        </button>
      </div>
    </div>
  );
}
