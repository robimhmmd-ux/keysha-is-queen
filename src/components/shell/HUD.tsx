// =============================================================
// HUD (Header) — selalu di atas semua halaman
// -------------------------------------------------------------
// Berisi:
//   - Logo brand (gambar dari src/assets/logos/brand.png)
//   - Navigasi (Home / Playground / Pet Shop)
//   - Counter heart points
//   - Tombol musik (membuka panel pemutar)
// CATATAN: Tombol "Aku butuh ditemenin" SUDAH DIPINDAH ke
// halaman Home (di bawah tombol "Masuk Playground"), jadi
// tidak ada di HUD lagi.
// =============================================================
import { Link, useLocation } from "@tanstack/react-router";
import { useApp } from "@/state/AppContext";
import { MusicButton } from "@/components/shell/MusicPlayer";
// Logo brand — bisa diganti di src/assets/logos/brand.png
import brandLogo from "@/assets/logos/brand.png";

export function HUD() {
  const { hearts } = useApp();
  const loc = useLocation();

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/playground", label: "Playground" },
    { to: "/shop", label: "Pet Shop" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 px-4 sm:px-8 py-4">
      <div className="mx-auto max-w-7xl glass-card rounded-3xl px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-6">
        {/* Logo + nama brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={brandLogo}
            alt="U deserve to happy"
            width={32}
            height={32}
            className="w-8 h-8 group-hover:animate-wiggle"
          />
          <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">
            U deserve to happy
          </span>
        </Link>

        {/* Navigasi */}
        <nav className="flex items-center gap-1 sm:gap-2 ml-auto">
          {navItems.map((n) => {
            const active = loc.pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  active
                    ? "bg-primary text-primary-foreground soft-shadow"
                    : "text-foreground/70 hover:text-foreground hover:bg-white/60"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Heart points */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-blush/70 border border-white/60">
          <span className="text-base">🤍</span>
          <span className="font-bold tabular-nums text-sm">{hearts}</span>
        </div>

        {/* Tombol musik — buka panel pemutar */}
        <MusicButton />
      </div>
    </header>
  );
}
