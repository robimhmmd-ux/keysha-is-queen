// =============================================================
// FloatingPets — pet companion yang berjalan di bawah layar
// -------------------------------------------------------------
// Tingkah laku:
//   - Pet hanya bergerak horizontal (kanan/kiri) di sepanjang
//     bagian bawah viewport.
//   - Sesekali pet melompat (animasi "hop" — naik turun sebentar).
//   - Klik pet untuk dapat pesan lucu & dia loncat kegirangan.
//   - Gambar pet diambil dari `pet.image` (folder src/assets/pets/).
// =============================================================
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/state/AppContext";
import { PETS } from "@/lib/pets";
import { petMessages, randomFrom } from "@/lib/comfortMessages";

// Tinggi sprite pet di layar (px)
const PET_SIZE = 72;
// Jarak dari bawah viewport (px) — ruang untuk "tanah"
const FLOOR_OFFSET = 16;

function PetSprite({ id, index }: { id: string; index: number }) {
  const pet = PETS.find((p) => p.id === id);

  // Posisi X pet (px). Mulai di posisi acak menyebar.
  const [x, setX] = useState<number>(() =>
    typeof window === "undefined" ? 100 + index * 120 : Math.random() * (window.innerWidth - PET_SIZE)
  );
  // Arah jalan: 1 = ke kanan, -1 = ke kiri
  const dirRef = useRef<1 | -1>(Math.random() > 0.5 ? 1 : -1);
  // State "lagi loncat" -> dipakai untuk animasi naik-turun
  const [jumping, setJumping] = useState(false);
  // State bubble pesan saat diklik
  const [bubble, setBubble] = useState<string | null>(null);

  // Loop gerakan: jalan kanan-kiri, sesekali loncat sendiri.
  useEffect(() => {
    let raf = 0;
    const speed = 0.6 + Math.random() * 0.4; // px per frame, beda tipis tiap pet

    const tick = () => {
      setX((prev) => {
        let next = prev + dirRef.current * speed;
        const maxX = window.innerWidth - PET_SIZE;
        // Pantulkan di tepi layar
        if (next <= 0) { next = 0; dirRef.current = 1; }
        else if (next >= maxX) { next = maxX; dirRef.current = -1; }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Auto-loncat kecil tiap beberapa detik
    const jumpTimer = setInterval(() => {
      setJumping(true);
      setTimeout(() => setJumping(false), 600);
    }, 4000 + Math.random() * 3000 + index * 500);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(jumpTimer);
    };
  }, [index]);

  // Saat pet diklik: muncul pesan + loncat
  const onClick = () => {
    setBubble(randomFrom(petMessages));
    setJumping(true);
    setTimeout(() => setJumping(false), 600);
    setTimeout(() => setBubble(null), 2600);
  };

  if (!pet) return null;

  return (
    <div
      className="fixed z-30 pointer-events-none"
      style={{
        left: x,
        bottom: FLOOR_OFFSET,
        width: PET_SIZE,
        height: PET_SIZE,
        // Mirror sprite kalau jalan ke kiri biar lebih hidup
        transform: `scaleX(${dirRef.current})`,
        transition: "transform 0.2s",
      }}
    >
      {/* Bubble pesan saat diklik */}
      {bubble && (
        <div
          className="absolute -top-10 left-1/2 px-3 py-1.5 rounded-2xl bg-white/95 text-xs font-semibold whitespace-nowrap soft-shadow animate-pop-in"
          // counter-mirror supaya teks tetap normal walau sprite di-flip
          style={{ transform: `translateX(-50%) scaleX(${dirRef.current})` }}
        >
          {bubble}
        </div>
      )}

      {/* Sprite pet — pakai <img> agar bisa diganti jadi GIF */}
      <button
        onClick={onClick}
        aria-label={`Click ${pet.name}`}
        className={`pointer-events-auto w-full h-full select-none cursor-pointer ${jumping ? "pet-jump" : ""}`}
      >
        <img
          src={pet.image}
          alt={pet.name}
          width={PET_SIZE}
          height={PET_SIZE}
          loading="lazy"
          draggable={false}
          className="w-full h-full object-contain drop-shadow-md"
        />
      </button>
    </div>
  );
}

export function FloatingPets() {
  const { activePets } = useApp();
  return (
    <>
      {activePets.map((id, i) => (
        <PetSprite key={id} id={id} index={i} />
      ))}
    </>
  );
}
