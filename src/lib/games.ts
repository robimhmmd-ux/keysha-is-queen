// =============================================================
// Definisi metadata untuk setiap mini game di Playground.
//
// Semua game sekarang NATIVE (kode React lokal).
// Game embed eksternal sudah dihapus.
//
// ➕ CARA NAMBAH GAME NATIVE BARU:
//   1. Buat komponen di src/components/games/<NamaGame>.tsx
//      Komponen menerima props { onScore, onFinish }
//   2. Daftarkan di REGISTRY pada src/components/games/GameModal.tsx
//   3. Tambah meta-nya di array GAMES di bawah
// =============================================================

export type GameMeta = {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  tone: string; // tailwind gradient classes
  /**
   * Optional. Kalau diisi, game ini dirender sebagai iframe
   * dengan src = nilai field ini. Path harus diawali dengan
   * "/external-games/..." (relatif ke folder public/).
   *
   * Contoh:
   *   embed: "/external-games/pet-simulator/index.html"
   */
  embed?: string;
};

export const GAMES: GameMeta[] = [
  { id: "heart-clicker",   name: "Klik Hati",        emoji: "💗", desc: "Klik hati yang muncul, sebanyak yang kamu mau",  tone: "from-blush to-rose" },
  { id: "falling-stars",   name: "Tangkap Bintang",  emoji: "⭐", desc: "Geser keranjang, tangkap bintang yang jatuh",     tone: "from-sky to-lavender" },
  { id: "memory",          name: "Memory Match",     emoji: "🧠", desc: "Cocokkan pasangan kartu emoji",                   tone: "from-mint to-sky" },
  { id: "whack",           name: "Tepuk Kucing",     emoji: "🐱", desc: "Tepuk kucing lucu yang muncul (versi lembut)",    tone: "from-butter to-blush" },
  { id: "guess-word",      name: "Tebak Kata Emoji", emoji: "📝", desc: "Tebak kata sederhana dari emoji",                 tone: "from-lavender to-blush" },
  { id: "puzzle",          name: "Puzzle Geser",     emoji: "🧩", desc: "Geser kotak sampe gambar utuh",                   tone: "from-mint to-butter" },
  { id: "reflex",          name: "Refleks",          emoji: "⚡", desc: "Klik secepat mungkin saat warna jadi hijau",      tone: "from-sky to-mint" },
  { id: "dodge",           name: "Hindari Awan",     emoji: "☁️", desc: "Geser cloud kamu, hindari rintangan",            tone: "from-lavender to-sky" },
  { id: "translate-id-en", name: "Translate ID→EN",  emoji: "🇮🇩", desc: "25 round: tebak kosa kata Indonesia ke Inggris", tone: "from-rose to-butter" },
  { id: "translate-en-id", name: "Translate EN→ID",  emoji: "🇬🇧", desc: "25 round: tebak kosa kata Inggris ke Indonesia", tone: "from-butter to-mint" },
  { id: "flying-bird",     name: "Flying Bird",      emoji: "🐦", desc: "Lompat-lompat hindari pipa hijau",                tone: "from-sky to-mint" },

  // ---------- Game baru ----------
  { id: "snakes-ladders",  name: "Ular Tangga",      emoji: "🎲", desc: "Lempar dadu, naik tangga, hindari ular (vs CPU)", tone: "from-butter to-rose" },
  { id: "uno",             name: "Kartu UNO",        emoji: "🃏", desc: "Main UNO klasik melawan CPU",                     tone: "from-rose to-lavender", embed : "/external-games/uno-main/public/index.html" },
  { id: "jigsaw-20",       name: "Jigsaw 20×20",     emoji: "🖼️", desc: "Susun puzzle gambar 400 keping",                  tone: "from-mint to-lavender" },
  { id: "snake-apple",     name: "Keysha bukan Ular",  emoji: "🐍", desc: "Pakai tombol arah, makan apel, jangan tabrak",    tone: "from-mint to-sky", embed : "/external-games/snakes-and-ladders-game-main/index.html" },
  { id: "sokoban",         name: "Sokoban 3D",    emoji: "🪵", desc: "Dorong balok kayu tapi 3D cuyy",       tone: "from-mint to-butter", embed : "/external-games/sokoban-3d-game-main/index.html" },
  { id: "sokoban",         name: "Sokoban Original",    emoji: "🪵", desc: "Pernah main ini gaa bee",       tone: "from-sky to-mint", embed : "/external-games/sokoban-master/src/index.html" },
];
