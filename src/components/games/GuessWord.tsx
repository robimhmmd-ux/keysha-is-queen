// Game 5: Tebak Kata — guess word from emoji clues.
import { useState } from "react";
import type { GameProps } from "./GameModal";
import { StartButton, FinishedView } from "./HeartClicker";

const PUZZLES = [
  { emoji: "🍎📱", answer: "apple",   hint: "buah / brand" },
  { emoji: "🌧️☔",  answer: "hujan",   hint: "cuaca" },
  { emoji: "🐱🐾",  answer: "kucing",  hint: "hewan peliharaan" },
  { emoji: "☕📖",  answer: "santai",  hint: "perasaan" },
  { emoji: "🌙😴",  answer: "tidur",   hint: "kegiatan malam" },
  { emoji: "🎵🎧",  answer: "musik",   hint: "suara indah" },
  { emoji: "💖🤗",  answer: "peluk",   hint: "ekspresi sayang" },
  { emoji: "🌸🌷",  answer: "bunga",   hint: "tumbuhan" },
];

export function GuessWord({ onScore }: GameProps) {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [order] = useState(() => [...PUZZLES].sort(() => Math.random() - 0.5).slice(0, 5));
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const submit = () => {
    if (!input.trim()) return;
    const ok = input.trim().toLowerCase() === order[idx].answer;
    setFeedback(ok ? "✓ Benar!" : `Jawaban: ${order[idx].answer}`);
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      setInput("");
      if (idx + 1 >= order.length) {
        setDone(true);
        const reward = (score + (ok ? 1 : 0)) * 4;
        if (reward > 0) onScore(reward);
      } else {
        setIdx((i) => i + 1);
      }
    }, 1100);
  };

  if (!started) return <StartButton onStart={() => setStarted(true)} label="Mulai 📝" />;
  if (done) return <FinishedView score={score * 4} onReplay={() => window.location.reload()} />;

  const p = order[idx];
  return (
    <div className="w-full text-center">
      <div className="text-xs font-semibold text-muted-foreground mb-2">{idx + 1} / {order.length} • Hint: {p.hint}</div>
      <div className="text-6xl py-6">{p.emoji}</div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="ketik jawaban..."
        autoFocus
        className="w-full max-w-xs mx-auto px-4 py-3 rounded-full border border-border bg-white text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <div>
        <button onClick={submit} className="mt-3 px-6 py-2 rounded-full bg-primary text-primary-foreground font-semibold soft-shadow hover:scale-105 transition">
          Cek
        </button>
      </div>
      {feedback && <p className="mt-3 text-sm font-semibold animate-pop-in">{feedback}</p>}
      <p className="mt-3 text-xs text-muted-foreground">Skor: {score}</p>
    </div>
  );
}
