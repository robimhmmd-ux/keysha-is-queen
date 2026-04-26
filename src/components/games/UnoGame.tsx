// =============================================================
// Kartu UNO — versi sederhana 1v1 vs CPU.
// Warna: red, yellow, green, blue.
// Kartu: angka 0–9, +2, Skip, Reverse(=Skip 1v1), Wild, Wild+4.
// Aturan klasik: cocokkan warna ATAU angka/simbol. Wild bisa
// kapanpun, pemain pilih warna. +2 / +4 menumpuk: lawan ambil.
// =============================================================
import { useEffect, useMemo, useState } from "react";
import type { GameProps } from "./GameModal";

type Color = "red" | "yellow" | "green" | "blue" | "wild";
type Value = string; // "0"-"9" | "+2" | "skip" | "rev" | "wild" | "+4"
type Card = { id: string; color: Color; value: Value };

const COLORS: Color[] = ["red", "yellow", "green", "blue"];
const COLOR_BG: Record<Color, string> = {
  red: "bg-red-500", yellow: "bg-yellow-400", green: "bg-green-500",
  blue: "bg-blue-500", wild: "bg-gradient-to-br from-red-500 via-yellow-400 to-blue-500",
};

let _id = 0;
const mk = (color: Color, value: Value): Card => ({ id: `c${_id++}`, color, value });

function buildDeck(): Card[] {
  const d: Card[] = [];
  for (const c of COLORS) {
    d.push(mk(c, "0"));
    for (let n = 1; n <= 9; n++) { d.push(mk(c, String(n))); d.push(mk(c, String(n))); }
    d.push(mk(c, "+2"), mk(c, "+2"));
    d.push(mk(c, "skip"), mk(c, "skip"));
    d.push(mk(c, "rev"), mk(c, "rev"));
  }
  for (let i = 0; i < 4; i++) { d.push(mk("wild", "wild")); d.push(mk("wild", "+4")); }
  return shuffle(d);
}
function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function canPlay(card: Card, top: Card, activeColor: Color): boolean {
  if (card.color === "wild") return true;
  if (card.color === activeColor) return true;
  if (card.value === top.value) return true;
  return false;
}

export function UnoGame({ onScore }: GameProps) {
  const [deck, setDeck] = useState<Card[]>([]);
  const [discard, setDiscard] = useState<Card[]>([]);
  const [hand, setHand] = useState<Card[]>([]);
  const [cpu, setCpu] = useState<Card[]>([]);
  const [active, setActive] = useState<Color>("red");
  const [turn, setTurn] = useState<"you" | "cpu">("you");
  const [msg, setMsg] = useState("Pilih kartu yang cocok warna/angkanya");
  const [picker, setPicker] = useState(false); // pilih warna setelah wild
  const [winner, setWinner] = useState<"you" | "cpu" | null>(null);
  const [scored, setScored] = useState(false);

  const top = discard[discard.length - 1];

  // Init game
  useEffect(() => { reset(); }, []);
  function reset() {
    let d = buildDeck();
    const h: Card[] = []; const c: Card[] = [];
    for (let i = 0; i < 7; i++) { h.push(d.pop()!); c.push(d.pop()!); }
    let first = d.pop()!;
    while (first.color === "wild") { d.unshift(first); first = d.pop()!; }
    setDeck(d); setDiscard([first]); setHand(h); setCpu(c);
    setActive(first.color as Color); setTurn("you"); setWinner(null);
    setMsg("Giliranmu — main kartu atau ambil dari deck");
  }

  function drawN(from: Card[], n: number): { taken: Card[]; rest: Card[] } {
    const taken: Card[] = []; const rest = [...from];
    for (let i = 0; i < n; i++) { if (rest.length === 0) break; taken.push(rest.pop()!); }
    return { taken, rest };
  }

  function playCard(card: Card, chosenColor?: Color) {
    if (turn !== "you" || winner) return;
    if (!canPlay(card, top, active)) { setMsg("Kartu itu nggak cocok!"); return; }
    if (card.color === "wild" && !chosenColor) { setPicker(true); return; }

    const newHand = hand.filter((c) => c.id !== card.id);
    setHand(newHand);
    setDiscard((d) => [...d, card]);
    const newColor: Color = card.color === "wild" ? (chosenColor || "red") : card.color;
    setActive(newColor);
    setPicker(false);

    if (newHand.length === 0) {
      setWinner("you"); setMsg("🎉 UNO! Kamu menang!");
      if (!scored) { onScore(12); setScored(true); }
      return;
    }

    // Efek
    let skipCpu = false;
    if (card.value === "+2") {
      const { taken, rest } = drawN(deck, 2);
      setCpu((c) => [...c, ...taken]); setDeck(rest); skipCpu = true;
    } else if (card.value === "+4") {
      const { taken, rest } = drawN(deck, 4);
      setCpu((c) => [...c, ...taken]); setDeck(rest); skipCpu = true;
    } else if (card.value === "skip" || card.value === "rev") {
      skipCpu = true;
    }

    if (skipCpu) { setTurn("you"); setMsg("CPU dilewat — giliranmu lagi!"); }
    else { setTurn("cpu"); setMsg("Giliran CPU…"); }
  }

  function drawForYou() {
    if (turn !== "you" || winner) return;
    if (deck.length === 0) return;
    const card = deck[deck.length - 1];
    setDeck((d) => d.slice(0, -1));
    setHand((h) => [...h, card]);
    setTurn("cpu"); setMsg("Kamu ambil 1 kartu — giliran CPU");
  }

  // CPU turn
  useEffect(() => {
    if (turn !== "cpu" || winner) return;
    const t = setTimeout(() => {
      const playable = cpu.find((c) => canPlay(c, top, active));
      if (playable) {
        const newCpu = cpu.filter((c) => c.id !== playable.id);
        setCpu(newCpu);
        const newColor: Color = playable.color === "wild"
          ? COLORS[Math.floor(Math.random() * 4)]
          : playable.color;
        setDiscard((d) => [...d, playable]);
        setActive(newColor);

        if (newCpu.length === 0) { setWinner("cpu"); setMsg("🤖 CPU menang. Coba lagi!"); return; }

        let skipYou = false;
        if (playable.value === "+2") {
          const { taken, rest } = drawN(deck, 2);
          setHand((h) => [...h, ...taken]); setDeck(rest); skipYou = true;
        } else if (playable.value === "+4") {
          const { taken, rest } = drawN(deck, 4);
          setHand((h) => [...h, ...taken]); setDeck(rest); skipYou = true;
        } else if (playable.value === "skip" || playable.value === "rev") {
          skipYou = true;
        }
        if (skipYou) { setTurn("cpu"); setMsg("Giliranmu dilewat!"); setTimeout(() => setTurn("cpu"), 50); }
        else { setTurn("you"); setMsg(`CPU main ${newColor === "wild" ? "wild" : newColor} ${playable.value}. Giliranmu!`); }
      } else {
        if (deck.length > 0) {
          const card = deck[deck.length - 1];
          setDeck((d) => d.slice(0, -1));
          setCpu((h) => [...h, card]);
        }
        setTurn("you"); setMsg("CPU ambil kartu — giliranmu");
      }
    }, 900);
    return () => clearTimeout(t);
  }, [turn, winner]); // eslint-disable-line

  const sortedHand = useMemo(() => [...hand].sort((a, b) => a.color.localeCompare(b.color)), [hand]);

  return (
    <div className="w-full max-w-lg">
      <div className="text-center text-sm mb-2">CPU: {cpu.length} kartu • Deck: {deck.length}</div>

      {/* CPU hand (back) */}
      <div className="flex justify-center gap-1 mb-3 flex-wrap">
        {cpu.map((_, i) => (
          <div key={i} className="w-7 h-10 rounded bg-foreground/80 border border-white/30" />
        ))}
      </div>

      {/* Top card + active color */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className={`w-16 h-24 rounded-lg ${COLOR_BG[top?.color || "red"]} text-white font-bold flex items-center justify-center text-lg shadow`}>
          {top?.value}
        </div>
        <div className="text-xs">
          <div>Warna aktif:</div>
          <div className={`inline-block w-6 h-6 rounded-full ${COLOR_BG[active]}`} />
        </div>
        <button onClick={drawForYou} disabled={turn !== "you" || !!winner}
          className="px-3 py-2 rounded-full bg-white/70 text-xs font-semibold disabled:opacity-50">
          Ambil 1
        </button>
      </div>

      <div className="text-center text-xs text-muted-foreground mb-2">{msg}</div>

      {/* Your hand */}
      <div className="flex flex-wrap gap-1 justify-center max-h-36 overflow-auto">
        {sortedHand.map((c) => {
          const ok = top && canPlay(c, top, active);
          return (
            <button key={c.id} onClick={() => playCard(c)} disabled={!ok || turn !== "you" || !!winner}
              className={`w-12 h-16 rounded ${COLOR_BG[c.color]} text-white text-xs font-bold flex items-center justify-center transition ${ok ? "hover:-translate-y-1" : "opacity-50"}`}>
              {c.value}
            </button>
          );
        })}
      </div>

      {/* Wild color picker */}
      {picker && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={() => setPicker(false)}>
          <div className="bg-white rounded-2xl p-5 flex gap-3" onClick={(e) => e.stopPropagation()}>
            {COLORS.map((c) => (
              <button key={c} onClick={() => {
                const wild = hand.find((x) => x.color === "wild");
                if (wild) playCard(wild, c);
              }} className={`w-14 h-14 rounded-full ${COLOR_BG[c]}`} />
            ))}
          </div>
        </div>
      )}

      {winner && (
        <div className="text-center mt-3">
          <button onClick={reset} className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold">
            Main Lagi
          </button>
        </div>
      )}
    </div>
  );
}
