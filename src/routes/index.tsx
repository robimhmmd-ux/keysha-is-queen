// =============================================================
// Home — landing page U deserve to happy
// -------------------------------------------------------------
// Layout:
//   1. Hero greeting (sapaan hangat)
//   2. Tombol "Masuk Playground" (utama, di tengah)
//   3. Tombol "Aku lagi butuh ditemenin" tepat DI BAWAH tombol
//      Playground -> klik akan memunculkan ComfortOverlay
//      (animasi pelukan/elus/cubit pipi).
//   4. Status cards (heart points, jumlah pet, jumlah lagu)
//   5. Feature cards (link ke Playground & Pet Shop)
// =============================================================
import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/state/AppContext";
// Logo comfort (ikon pelukan) — bisa diganti di src/assets/logos/comfort.png
import comfortLogo from "@/assets/logos/comfort.png";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "U deserve to happy — Home" },
      { name: "description", content: "Hai kamu. Kalau dunia lagi berat, istirahat di sini dulu ya 🤍" },
    ],
  }),
});

function Home() {
  const { showComfort, hearts, ownedPets } = useApp();

  return (
    <section className="px-4 sm:px-8">
      <div className="mx-auto max-w-5xl pt-8 sm:pt-16">
        <div className="text-center">
          <div className="inline-block text-6xl sm:text-7xl mb-6 animate-float">🌷</div>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold leading-[1.15] tracking-tight">
            Hai kamu <span className="inline-block animate-wiggle">🤍</span><br />
            <span className="bg-gradient-to-r from-rose to-lavender bg-clip-text text-transparent">
              kalau dunia lagi berat,
            </span><br />
            istirahat di sini dulu ya
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Tempat kecil buat main game lucu, denger lagu yang menenangkan, dan ditemenin pet imut.
            Nggak ada target, nggak ada nilai. Kamu di sini cukup buat istirahat.
          </p>

          {/* Tombol utama: Playground di atas, Comfort tepat di bawahnya, sama-sama di tengah */}
          <div className="mt-10 flex flex-col gap-3 items-center">
            <Link
              to="/playground"
              className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg soft-shadow hover:scale-105 transition-transform"
            >
              Masuk Playground →
            </Link>
            <button
              onClick={showComfort}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-secondary text-secondary-foreground font-semibold hover:scale-105 transition-transform"
            >
              <img
                src={comfortLogo}
                alt=""
                width={28}
                height={28}
                className="w-7 h-7"
              />
              <span>Aku lagi butuh ditemenin</span>
            </button>
          </div>
        </div>

        {/* Status cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard emoji="🤍" label="Heart Points" value={hearts} hint="dapat dari main game" />
          <StatCard emoji="🐾" label="Pet kamu" value={ownedPets.length} hint="temenin kamu di sini" />
          <StatCard emoji="🎧" label="Musik tenang" value={5} hint="muter terus selama kamu di sini" />
        </div>

        {/* Hint cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard
            to="/playground"
            emoji="🎮"
            title="Mini games lucu"
            desc="8+ game ringan: clicker hati, tangkap bintang, memory, dan banyak lagi."
            tone="from-blush to-butter"
          />
          <FeatureCard
            to="/shop"
            emoji="🐰"
            title="Pet Shop"
            desc="Tukar heart points sama pet lucu. Mereka bakal jalan-jalan nemenin di bawah layar."
            tone="from-sky to-lavender"
          />
        </div>

        <p className="mt-12 text-center text-xs text-muted-foreground">
          tip kecil: kamu boleh berhenti kapan aja. nggak harus selesai semuanya 🌷
        </p>
      </div>
    </section>
  );
}

function StatCard({ emoji, label, value, hint }: { emoji: string; label: string; value: number; hint: string }) {
  return (
    <div className="glass-card rounded-3xl p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blush to-butter flex items-center justify-center text-2xl">
        {emoji}
      </div>
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-display text-2xl font-bold leading-tight">{value}</div>
        <div className="text-xs text-muted-foreground/80">{hint}</div>
      </div>
    </div>
  );
}

function FeatureCard({
  to, emoji, title, desc, tone,
}: { to: "/playground" | "/shop"; emoji: string; title: string; desc: string; tone: string }) {
  return (
    <Link
      to={to}
      className={`game-tile glass-card rounded-3xl p-6 block bg-gradient-to-br ${tone} bg-opacity-40`}
    >
      <div className="text-4xl mb-3">{emoji}</div>
      <h3 className="font-display font-bold text-xl">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      <div className="mt-4 text-sm font-semibold text-primary">Buka →</div>
    </Link>
  );
}
