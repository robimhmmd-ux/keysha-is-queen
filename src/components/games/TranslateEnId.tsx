// =============================================================
// Game: Translate EN -> ID (25 round)
// Konsep sama dengan TranslateIdEn, tapi terbalik:
// diberi kata bahasa Inggris, user ketik bahasa Indonesia.
// =============================================================
import { useMemo, useState } from "react";
import type { GameProps } from "./GameModal";
import { StartButton, FinishedView } from "./HeartClicker";
import { VOCAB } from "@/lib/vocab";

const ROUNDS = 25;

function norm(s: string) {
  return s.trim().toLowerCase();
}

export function TranslateEnId({ onScore }: GameProps) {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const rounds = useMemo(
    () => [...VOCAB].sort(() => Math.random() - 0.5).slice(0, ROUNDS),
    []
  );
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const submit = () => {
    if (!input.trim()) return;
    const ok = norm(input) === norm(rounds[idx].id);
    setFeedback(ok ? "✓ Mantap!" : `Jawaban: ${rounds[idx].id}`);
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      setInput("");
      if (idx + 1 >= rounds.length) {
        setDone(true);
        const total = score + (ok ? 1 : 0);
        if (total > 0) onScore(total * 3);
      } else {
        setIdx((i) => i + 1);
      }
    }, 1100);
  };

  if (!started) return <StartButton onStart={() => setStarted(true)} label="Mulai 🇬🇧→🇮🇩" />;
  if (done) return <FinishedView score={score * 3} onReplay={() => window.location.reload()} />;

  const p = rounds[idx];
  return (
    <div className="w-full text-center">
      <div className="text-xs font-semibold text-muted-foreground mb-2">
        Round {idx + 1} / {rounds.length} • Skor benar: {score}
      </div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">English</div>
      <div className="font-display text-4xl py-4 font-bold">{p.en}</div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Indonesia</div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="ketik dalam bahasa Indonesia..."
        autoFocus
        className="w-full max-w-xs mx-auto px-4 py-3 rounded-full border border-border bg-white text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <div>
        <button
          onClick={submit}
          className="mt-3 px-6 py-2 rounded-full bg-primary text-primary-foreground font-semibold soft-shadow hover:scale-105 transition"
        >
          Cek
        </button>
      </div>
      {feedback && <p className="mt-3 text-sm font-semibold animate-pop-in">{feedback}</p>}
    </div>
  );
}
