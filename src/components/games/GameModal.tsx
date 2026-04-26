// =============================================================
// GameModal — modal yang menampilkan game yang dipilih.
// Cara kerja:
//  1. Game native (kode lokal) terdaftar di REGISTRY di bawah,
//     berdasarkan field `id` dari GameMeta.
//  2. Game embed (iframe) otomatis dirender via makeEmbedGame
//     kalau GameMeta punya field `embed`.
// Mau nambah game native baru? Buat komponen di
// src/components/games/<Nama>.tsx, daftarkan di REGISTRY,
// lalu tambah meta-nya di src/lib/games.ts.
// =============================================================
import { useEffect, useRef } from "react";
import type { GameMeta } from "@/lib/games";
import { useApp } from "@/state/AppContext";
import { HeartClicker } from "./HeartClicker";
import { FallingStars } from "./FallingStars";
import { MemoryGame } from "./MemoryGame";
import { WhackGame } from "./WhackGame";
import { GuessWord } from "./GuessWord";
import { SlidePuzzle } from "./SlidePuzzle";
import { ReflexGame } from "./ReflexGame";
import { DodgeGame } from "./DodgeGame";
import { TranslateIdEn } from "./TranslateIdEn";
import { TranslateEnId } from "./TranslateEnId";
import { FlyingBird } from "./FlyingBird";
import { SnakesLadders } from "./SnakesLadders";
import { UnoGame } from "./UnoGame";
import { JigsawPuzzle } from "./JigsawPuzzle";
import { SnakeApple } from "./SnakeApple";
import { Sokoban } from "./Sokoban";
import { makeEmbedGame } from "./EmbedGame";

export type GameProps = {
  onScore: (n: number) => void;
  onFinish: () => void;
};

// Registry komponen game native (id -> komponen)
const REGISTRY: Record<string, (props: GameProps) => React.ReactNode> = {
  "heart-clicker":   HeartClicker,
  "falling-stars":   FallingStars,
  "memory":          MemoryGame,
  "whack":           WhackGame,
  "guess-word":      GuessWord,
  "puzzle":          SlidePuzzle,
  "reflex":          ReflexGame,
  "dodge":           DodgeGame,
  "translate-id-en": TranslateIdEn,
  "translate-en-id": TranslateEnId,
  "flying-bird":     FlyingBird,
  "snakes-ladders":  SnakesLadders,
  "uno":             UnoGame,
  "jigsaw-20":       JigsawPuzzle,
  "snake-apple":     SnakeApple,
  "sokoban":         Sokoban,
};

export function GameModal({ game, onClose }: { game: GameMeta; onClose: () => void }) {
  const { addHearts } = useApp();

  // Kalau game punya field `embed` -> render iframe.
  // Selain itu pakai komponen native dari REGISTRY.
  const isEmbed = !!game.embed;
  const Game = isEmbed ? makeEmbedGame(game.embed!) : REGISTRY[game.id];

  // Tutup pakai ESC + lock scroll body selama modal aktif
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "color-mix(in oklab, var(--foreground) 35%, transparent)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className={`relative w-full glass-card rounded-3xl p-5 sm:p-7 animate-pop-in max-h-[92vh] overflow-auto ${isEmbed ? "max-w-4xl" : "max-w-xl"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <GameModalBody
          game={game}
          isEmbed={isEmbed}
          onClose={onClose}
          Game={Game}
          addHearts={addHearts}
        />
      </div>
    </div>
  );
}

// Body terpisah biar bisa pakai ref untuk fullscreen API
function GameModalBody({
  game,
  isEmbed,
  onClose,
  Game,
  addHearts,
}: {
  game: GameMeta;
  isEmbed: boolean;
  onClose: () => void;
  Game: ((props: GameProps) => React.ReactNode) | undefined;
  addHearts: (n: number, label: string) => void;
}) {
  // Ref ke kontainer game — dipakai untuk fullscreen
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Toggle fullscreen pakai Fullscreen API standar
  const toggleFullscreen = async () => {
    const el = gameAreaRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.warn("Fullscreen tidak didukung:", e);
    }
  };

  return (
    <>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="text-3xl">{game.emoji}</div>
          <h2 className="font-display font-bold text-xl mt-1">{game.name}</h2>
          <p className="text-xs text-muted-foreground">{game.desc}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Tombol fullscreen — tersedia untuk semua game */}
          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-lg"
            aria-label="Fullscreen"
            title="Layar penuh"
          >
            ⛶
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-lg"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <div
        ref={gameAreaRef}
        className={`rounded-2xl bg-white/60 p-3 sm:p-4 ${isEmbed ? "min-h-[400px]" : "min-h-[320px]"} flex items-center justify-center fullscreen:bg-background fullscreen:rounded-none fullscreen:p-0`}
      >
        {Game ? <Game onScore={(n) => addHearts(n, game.name)} onFinish={() => {}} /> : <div>Coming soon 🌷</div>}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-3">
        tekan Esc atau klik di luar buat tutup • ⛶ untuk fullscreen • dapet heart points 🤍
      </p>
    </>
  );
}
