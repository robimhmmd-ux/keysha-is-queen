// Game 7: Refleks — tap when circle turns green. 5 rounds.
import { useEffect, useRef, useState } from "react";
import type { GameProps } from "./GameModal";
import { StartButton, FinishedView } from "./HeartClicker";

type Phase = "idle" | "wait" | "go" | "tooEarly" | "result";

export function ReflexGame({ onScore }: GameProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [reaction, setReaction] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const startRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const startRound = () => {
    setPhase("wait");
    setReaction(null);
    const delay = 1000 + Math.random() * 2500;
    timerRef.current = window.setTimeout(() => {
      startRef.current = performance.now();
      setPhase("go");
    }, delay);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const click = () => {
    if (phase === "wait") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase("tooEarly");
      return;
    }
    if (phase === "go") {
      const r = Math.round(performance.now() - startRef.current);
      setReaction(r);
      const newTimes = [...times, r];
      setTimes(newTimes);
      setPhase("result");
      if (round + 1 >= 5) {
        const avg = newTimes.reduce((a, b) => a + b, 0) / newTimes.length;
        // Faster avg = more hearts. <300ms = 25, <500 = 18, <800 = 12, else 6
        const reward = avg < 300 ? 25 : avg < 500 ? 18 : avg < 800 ? 12 : 6;
        setDone(true);
        onScore(reward);
      }
    }
    if (phase === "tooEarly") {
      setPhase("idle");
    }
    if (phase === "result") {
      setRound((r) => r + 1);
      startRound();
    }
  };

  if (phase === "idle" && round === 0) {
    return <StartButton onStart={() => { setRound(0); setTimes([]); startRound(); }} label="Mulai ⚡" />;
  }
  if (done) {
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const reward = avg < 300 ? 25 : avg < 500 ? 18 : avg < 800 ? 12 : 6;
    return <FinishedView score={reward} onReplay={() => { setRound(0); setTimes([]); setDone(false); startRound(); }} />;
  }

  let bg = "bg-butter";
  let label = "siap-siap...";
  if (phase === "wait")    { bg = "bg-rose/60";   label = "tunggu warnanya jadi hijau..."; }
  if (phase === "go")      { bg = "bg-mint";      label = "KLIK SEKARANG!"; }
  if (phase === "tooEarly"){ bg = "bg-destructive/30"; label = "kecepetan! klik buat ulang"; }
  if (phase === "result")  { bg = "bg-sky";       label = `${reaction}ms — klik buat lanjut`; }

  return (
    <div className="w-full text-center">
      <div className="text-xs font-semibold text-muted-foreground mb-3">Round {Math.min(round + 1, 5)} / 5</div>
      <button
        onClick={click}
        className={`w-full h-56 rounded-3xl font-display font-bold text-xl ${bg} transition-colors`}
      >
        {label}
      </button>
    </div>
  );
}
