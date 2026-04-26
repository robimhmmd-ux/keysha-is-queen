// =============================================================
// ComfortOverlay — overlay "Aku butuh ditemenin"
// -------------------------------------------------------------
// Saat dipanggil (showComfort dari AppContext), overlay muncul:
//   - Background blur lembut + bokeh ngambang
//   - Salah satu animasi gemes secara acak dari folder
//     `src/assets/animations/` (Hug / Pat / Pinch)
//   - Kata-kata menenangkan dari `comfortMessages.ts`
// Tutup dengan klik di mana saja atau tekan ESC.
// =============================================================
import { useApp } from "@/state/AppContext";
import { useEffect, useMemo } from "react";

// === Import animasi dari folder khusus animations ===
// Mau ganti animasi? Edit file di src/assets/animations/
import { HugAnim } from "@/assets/animations/HugAnim";
import { PatAnim } from "@/assets/animations/PatAnim";
import { PinchAnim } from "@/assets/animations/PinchAnim";

type ComfortAnim = "hug" | "pat" | "pinch";

export function ComfortOverlay() {
  const { comfortOpen, comfortText, closeComfort } = useApp();

  // Tutup pakai tombol ESC
  useEffect(() => {
    if (!comfortOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeComfort();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [comfortOpen, closeComfort]);

  // Pilih animasi acak setiap overlay terbuka
  const anim: ComfortAnim = useMemo(() => {
    const list: ComfortAnim[] = ["hug", "pat", "pinch"];
    return list[Math.floor(Math.random() * list.length)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comfortOpen]);

  if (!comfortOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in"
      style={{
        backdropFilter: "blur(20px)",
        background: "color-mix(in oklab, var(--blush) 60%, transparent)",
      }}
      onClick={closeComfort}
    >
      {/* Bokeh menyebar ngambang */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full opacity-60"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              width: `${20 + ((i * 11) % 60)}px`,
              height: `${20 + ((i * 11) % 60)}px`,
              background: ["var(--rose)", "var(--lavender)", "var(--sky)", "var(--mint)", "var(--butter)"][i % 5],
              filter: "blur(14px)",
              animation: `float ${5 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-lg text-center">
        {/* === Animasi gemes: ganti-ganti setiap dibuka === */}
        <div className="relative h-44 sm:h-52 mb-6 flex items-end justify-center">
          {anim === "hug" && <HugAnim />}
          {anim === "pat" && <PatAnim />}
          {anim === "pinch" && <PinchAnim />}
        </div>

        <p className="font-display text-2xl sm:text-3xl font-bold leading-snug text-foreground mb-3">
          {comfortText}
        </p>
        <p className="text-muted-foreground text-sm">
          tarik nafas pelan-pelan... lepasin lebih pelan lagi 🌷
        </p>
        <button
          onClick={closeComfort}
          className="mt-8 px-6 py-3 rounded-full bg-white/80 hover:bg-white text-sm font-semibold transition soft-shadow"
        >
          aku siap lagi 🌷
        </button>
      </div>
    </div>
  );
}
