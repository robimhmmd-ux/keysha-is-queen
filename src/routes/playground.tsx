// Playground — grid of mini games. Click a tile to open the game in a modal.
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GAMES, type GameMeta } from "@/lib/games";
import { GameModal } from "@/components/games/GameModal";

export const Route = createFileRoute("/playground")({
  component: Playground,
  head: () => ({
    meta: [
      { title: "Playground — U deserve to happy" },
      { name: "description", content: "Pilih mini game yang kamu mau. Nggak ada target, cuma buat seneng-seneng." },
    ],
  }),
});

function Playground() {
  const [active, setActive] = useState<GameMeta | null>(null);

  return (
    <section className="px-4 sm:px-8">
      <div className="mx-auto max-w-6xl pt-6">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Playground 🎮</h1>
          <p className="text-muted-foreground mt-2">
            Pilih game apapun yang lagi kamu pengen. Setiap selesai dapet heart points 🤍
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {GAMES.map((g) => (
            <button
              key={g.id}
              onClick={() => setActive(g)}
              className={`game-tile glass-card rounded-3xl p-5 text-left bg-gradient-to-br ${g.tone}`}
            >
              <div className="text-5xl mb-3 transition-transform group-hover:scale-110">{g.emoji}</div>
              <div className="font-display font-bold text-base">{g.name}</div>
              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{g.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {active && <GameModal game={active} onClose={() => setActive(null)} />}
    </section>
  );
}
