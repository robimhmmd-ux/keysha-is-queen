// Game 3: Memory Match — flip cards, match pairs.
import { useEffect, useState } from "react";
import type { GameProps } from "./GameModal";
import { StartButton, FinishedView } from "./HeartClicker";

const EMOJIS = ["🌷", "🐰", "🍓", "☁️", "🌙", "🍑", "🌈", "🦋"];

type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): Card[] {
  const pairs = EMOJIS.flatMap((e) => [e, e]);
  return shuffle(pairs).map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
}

export function MemoryGame({ onScore }: GameProps) {
  const [deck, setDeck] = useState<Card[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started && deck.length === 0) setDeck(buildDeck());
  }, [started, deck.length]);

  useEffect(() => {
    if (picked.length !== 2) return;
    const [a, b] = picked;
    setMoves((m) => m + 1);
    const ca = deck.find((c) => c.id === a);
    const cb = deck.find((c) => c.id === b);
    if (ca && cb && ca.emoji === cb.emoji) {
      setDeck((d) => d.map((c) => (c.id === a || c.id === b ? { ...c, matched: true } : c)));
      setPicked([]);
    } else {
      setTimeout(() => {
        setDeck((d) => d.map((c) => (c.id === a || c.id === b ? { ...c, flipped: false } : c)));
        setPicked([]);
      }, 700);
    }
  }, [picked, deck]);

  useEffect(() => {
    if (deck.length > 0 && deck.every((c) => c.matched) && !done) {
      setDone(true);
      // Score based on efficiency: 32 base - moves penalty, min 8
      const reward = Math.max(8, 32 - Math.max(0, moves - EMOJIS.length));
      onScore(reward);
    }
  }, [deck, done, moves, onScore]);

  const flip = (id: number) => {
    if (picked.length === 2) return;
    setDeck((d) => d.map((c) => (c.id === id && !c.matched ? { ...c, flipped: true } : c)));
    setPicked((p) => (p.includes(id) ? p : [...p, id]));
  };

  if (!started) return <StartButton onStart={() => setStarted(true)} label="Mulai 🧠" />;
  if (done) return <FinishedView score={Math.max(8, 32 - Math.max(0, moves - EMOJIS.length))} onReplay={() => { setDeck(buildDeck()); setPicked([]); setMoves(0); setDone(false); }} />;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-semibold mb-3">
        <span>Moves: {moves}</span>
        <span>Cocokkan semua pasangan 💕</span>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {deck.map((c) => (
          <button
            key={c.id}
            onClick={() => flip(c.id)}
            disabled={c.flipped || c.matched}
            className={`aspect-square rounded-xl text-2xl sm:text-3xl flex items-center justify-center transition-all ${
              c.flipped || c.matched
                ? "bg-white shadow-sm scale-100"
                : "bg-gradient-to-br from-rose to-lavender text-transparent hover:scale-105"
            } ${c.matched ? "opacity-60" : ""}`}
          >
            {c.flipped || c.matched ? c.emoji : "?"}
          </button>
        ))}
      </div>
    </div>
  );
}
