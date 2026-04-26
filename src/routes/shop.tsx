// Pet Shop — buy pets with heart points; toggle which ones float around.
import { createFileRoute } from "@tanstack/react-router";
import { PETS } from "@/lib/pets";
import { useApp } from "@/state/AppContext";

export const Route = createFileRoute("/shop")({
  component: Shop,
  head: () => ({
    meta: [
      { title: "Pet Shop — U deserve to happy" },
      { name: "description", content: "Tukar heart points kamu sama pet lucu yang akan menemani di mana pun." },
    ],
  }),
});

function Shop() {
  const { hearts, ownedPets, activePets, buyPet, togglePetActive } = useApp();

  return (
    <section className="px-4 sm:px-8">
      <div className="mx-auto max-w-5xl pt-6">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Pet Shop 🐾</h1>
          <p className="text-muted-foreground mt-2">
            Tukar heart points kamu sama temen baru. Mereka bakal floating nemenin di sini.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blush/70 border border-white/60 font-semibold">
            🤍 {hearts} heart points
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {PETS.map((p) => {
            const owned = ownedPets.includes(p.id);
            const active = activePets.includes(p.id);
            const canAfford = hearts >= p.price;
            return (
              <div key={p.id} className="glass-card rounded-3xl p-5 flex flex-col items-center text-center">
                {/* Gambar pet — ambil dari src/assets/pets/<id>.png */}
                <div className={`w-20 h-20 mb-3 ${owned ? "animate-bounce-soft" : "opacity-90"}`}>
                  <img
                    src={p.image}
                    alt={p.name}
                    width={80}
                    height={80}
                    loading="lazy"
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>
                <div className="font-display font-bold">{p.name}</div>
                <div className="text-xs text-muted-foreground mt-1 mb-3 min-h-[2.5rem]">{p.description}</div>

                {owned ? (
                  <button
                    onClick={() => togglePetActive(p.id)}
                    className={`w-full py-2 rounded-full text-sm font-semibold transition ${
                      active
                        ? "bg-primary text-primary-foreground soft-shadow"
                        : "bg-white/70 hover:bg-white text-foreground"
                    }`}
                  >
                    {active ? "✓ Lagi nemenin" : "Panggil keluar"}
                  </button>
                ) : (
                  <button
                    onClick={() => buyPet(p.id, p.price)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-full text-sm font-semibold transition ${
                      canAfford
                        ? "bg-primary text-primary-foreground hover:scale-105 soft-shadow"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    🤍 {p.price}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
