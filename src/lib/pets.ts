// =============================================================
// DAFTAR PET
// -------------------------------------------------------------
// Setiap pet punya gambar sendiri di folder `src/assets/pets/`.
// Untuk ganti gambar pet:
//   1. Replace file di src/assets/pets/<id>.png (atau .gif)
//   2. Kalau ekstensi berubah (mis. jadi .gif), update juga
//      baris `import` di bawah ini.
// =============================================================

// Import gambar dari folder assets — Vite akan resolve ke URL jadi.
import catImg    from "@/assets/pets/cat.png";
import rabbitImg from "@/assets/pets/rabbit.png";
import blobImg   from "@/assets/pets/blob.png";
import bearImg   from "@/assets/pets/bear.png";
import duckImg   from "@/assets/pets/duck.png";
import ghostImg  from "@/assets/pets/ghost.png";
import frogImg   from "@/assets/pets/frog.png";
import chickImg  from "@/assets/pets/chick.png";

export type Pet = {
  id: string;
  name: string;
  emoji: string;       // fallback / dipakai di shop card kecil
  image: string;       // URL gambar (PNG/GIF) — dari folder assets
  price: number;
  description: string;
};

export const PETS: Pet[] = [
  { id: "cat",    name: "Mochi",  emoji: "🐱", image: catImg,    price: 50,  description: "kucing oren yang suka tidur di pangkuan" },
  { id: "rabbit", name: "Bun",    emoji: "🐰", image: rabbitImg, price: 80,  description: "kelinci putih yang lompat-lompat lucu" },
  { id: "blob",   name: "Boba",   emoji: "🫧", image: blobImg,   price: 30,  description: "blob imut yang ngambang kemana-mana" },
  { id: "bear",   name: "Coklat", emoji: "🐻", image: bearImg,   price: 120, description: "beruang madu, pelukannya hangat" },
  { id: "duck",   name: "Kwek",   emoji: "🦆", image: duckImg,   price: 60,  description: "bebek kecil yang suka ngikutin kamu" },
  { id: "ghost",  name: "Pup",    emoji: "👻", image: ghostImg,  price: 100, description: "hantu sopan, nggak nakut-nakutin kok" },
  { id: "frog",   name: "Hijau",  emoji: "🐸", image: frogImg,   price: 70,  description: "kodok kalem, suka denger curhat" },
  { id: "chick",  name: "Kuning", emoji: "🐥", image: chickImg,  price: 40,  description: "anak ayam, cuit-cuit penyemangat" },
];
