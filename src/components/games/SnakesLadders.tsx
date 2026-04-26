// =============================================================
// Ular Tangga — Player vs CPU di papan 10x10 (1..100).
// Lempar dadu, otomatis pindahin pion. Kena tangga = naik,
// kena ular = melorot. Pertama sampai 100 menang.
// =============================================================
import { useState } from "react";
import type { GameProps } from "./GameModal";

// Map snake (turun) dan ladder (naik): from -> to
const LADDERS: Record<number, number> = { 3: 22, 8: 30, 28: 84, 58: 77, 75: 86 };
const SNAKES: Record<number, number>  = { 17: 4, 54: 34, 62: 19, 87: 24, 99: 78 };

function applyJump(pos: number): { final: number; via: "ladder" | "snake" | null } {
  if (LADDERS[pos]) return { final: LADDERS[pos], via: "ladder" };
  if (SNAKES[pos])  return { final: SNAKES[pos],  via: "snake"  };
  return { final: pos, via: null };
}

export function SnakesLadders({ onScore }: GameProps) {
  const [p1, setP1] = useState(0); // pemain
  const [p2, setP2] = useState(0); // CPU
  const [turn, setTurn] = useState<"p1" | "p2">("p1");
  const [dice, setDice] = useState(0);
  const [msg, setMsg] = useState("Giliranmu — lempar dadu!");
  const [winner, setWinner] = useState<"p1" | "p2" | null>(null);
  const [scored, setScored] = useState(false);

  function rollFor(who: "p1" | "p2") {
    if (winner) return;
    const d = 1 + Math.floor(Math.random() * 6);
    setDice(d);
    const cur = who === "p1" ? p1 : p2;
    let next = cur + d;
    if (next > 100) next = cur; // harus pas
    const { final, via } = applyJump(next);
    if (who === "p1") setP1(final); else setP2(final);

    if (final === 100) {
      setWinner(who);
      setMsg(who === "p1" ? "🎉 Kamu menang!" : "🤖 CPU menang. Coba lagi!");
      if (who === "p1" && !scored) { onScore(15); setScored(true); }
      return;
    }
    setMsg(
      `${who === "p1" ? "Kamu" : "CPU"} dapat ${d}` +
      (via === "ladder" ? " — naik tangga! 🪜" : via === "snake" ? " — kena ular! 🐍" : "")
    );

    if (who === "p1") {
      setTurn("p2");
      setTimeout(() => rollFor("p2"), 900);
    } else {
      setTurn("p1");
    }
  }

  // Render papan dari atas (100) ke bawah (1) dengan boustrophedon
  const rows = [];
  for (let r = 9; r >= 0; r--) {
    const cells = [];
    for (let c = 0; c < 10; c++) {
      const n = r % 2 === 0 ? r * 10 + c + 1 : r * 10 + (10 - c);
      const isLadder = !!LADDERS[n];
      const isSnake = !!SNAKES[n];
      cells.push(
        <div
          key={n}
          className={`relative aspect-square text-[9px] flex items-start justify-start p-0.5 border border-white/40 rounded ${
            isLadder ? "bg-mint/60" : isSnake ? "bg-rose/60" : "bg-white/40"
          }`}
        >
          <span className="opacity-70">{n}</span>
          {isLadder && <span className="absolute bottom-0 right-0 text-[10px]">🪜</span>}
          {isSnake && <span className="absolute bottom-0 right-0 text-[10px]">🐍</span>}
          <div className="absolute inset-0 flex items-center justify-center text-base">
            {p1 === n && <span>🟦</span>}
            {p2 === n && <span>🟥</span>}
          </div>
        </div>
      );
    }
    rows.push(<div key={r} className="grid grid-cols-10 gap-0.5">{cells}</div>);
  }

  return (
    <div className="w-full max-w-lg">
      <div className="flex items-center justify-between mb-2 text-sm">
        <div>🟦 Kamu: <b>{p1}</b></div>
        <div className="text-2xl">🎲 {dice || "—"}</div>
        <div>🟥 CPU: <b>{p2}</b></div>
      </div>
      <div className="space-y-0.5 mb-3">{rows}</div>
      <div className="text-center text-sm mb-2">{msg}</div>
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => rollFor("p1")}
          disabled={turn !== "p1" || !!winner}
          className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold disabled:opacity-50"
        >
          Lempar Dadu
        </button>
        {winner && (
          <button
            onClick={() => { setP1(0); setP2(0); setTurn("p1"); setDice(0); setWinner(null); setMsg("Giliranmu!"); }}
            className="px-5 py-2 rounded-full bg-white/70 font-semibold"
          >
            Main Lagi
          </button>
        )}
      </div>
    </div>
  );
}
