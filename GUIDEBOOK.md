# 📖 GUIDEBOOK — U deserve to happy

Panduan lengkap edit project ini buat kamu sendiri. Setiap bagian
ngasih tau **file mana yang harus diedit** dan **untuk apa fungsinya**.

---

## 🗂️ Struktur Folder

```
src/
├── assets/
│   ├── animations/   → animasi peluk/elus/cubit (GIF kamu)
│   ├── music/        → file mp3 buat pemutar musik
│   ├── logos/        → logo brand & icon musik
│   └── pets/         → gambar hewan peliharaan virtual
│
├── components/
│   ├── games/        → semua mini game native + embed
│   └── shell/        → HUD, MusicPlayer, ComfortOverlay, dll
│
├── lib/
│   ├── games.ts      → daftar semua game (native + embed)
│   ├── pets.ts       → daftar pet di Pet Shop
│   ├── vocab.ts      → kamus untuk game Translate
│   └── comfortMessages.ts → kata-kata penyemangat
│
├── routes/           → file halaman (file = URL)
│   ├── index.tsx     → halaman Home (/)
│   ├── playground.tsx→ halaman Playground (/playground)
│   └── shop.tsx      → halaman Pet Shop (/shop)
│
├── state/            → context global (heart points, musik)
└── styles.css        → tema warna, animasi, design tokens

public/
└── external-games/   → game HTML/CSS/JS yang di-embed lewat iframe
```

---

## 🎵 1. Tambah / Hapus Lagu

**Lokasi**: `src/assets/music/`

- **Tambah**: drop file `.mp3` ke folder ini → otomatis muncul di player.
  Nama file = nama yang tampil (tanpa `.mp3`).
- **Hapus**: tinggal hapus file mp3 nya.
- Detail lengkap: lihat `src/assets/music/README.md`

---

## 🎞️ 2. Animasi Peluk / Elus / Cubit

**Lokasi**: `src/assets/animations/`

- Drop file dengan nama persis: `hug.gif`, `elus.gif`, `cubit.gif`
- Komponen otomatis pakai GIF kamu. Kalau belum ada → fallback emoji animasi.
- Mau nambah animasi baru (misal `kiss.gif`)?
  Lihat `src/assets/animations/README.md`

---

## 🎮 3. Tambah Mini Game Baru

### A. Game native (kode React kamu sendiri)
1. Buat komponen baru di `src/components/games/NamaGame.tsx`
   ```tsx
   import type { GameProps } from "./GameModal";
   export function NamaGame({ onScore }: GameProps) {
     return <button onClick={() => onScore(5)}>Klik aku</button>;
   }
   ```
2. Daftar di `src/components/games/GameModal.tsx` pada object `REGISTRY`:
   ```ts
   "nama-game": NamaGame,
   ```
3. Tambah meta-nya di `src/lib/games.ts` array `GAMES`:
   ```ts
   { id: "nama-game", name: "Nama Game", emoji: "🎲",
     desc: "...", tone: "from-rose to-mint" }
   ```

### B. Game embed lokal (HTML/CSS/JS)
1. Drop folder game ke `public/external-games/<slug>/` (harus ada `index.html`)
2. Tambah entry dengan field `localEmbed` di `src/lib/games.ts`
3. Lihat `public/external-games/README.md`

### C. Game embed eksternal (Scratch, itch.io, dll)
Sama seperti B, tapi `path` diisi URL lengkap:
```ts
localEmbed: {
  path: "https://scratch.mit.edu/projects/XXXXX/embed",
  width: 485, height: 402, title: "Nama Game"
}
```

---

## 🖥️ 4. Fitur Fullscreen Game

Sudah otomatis ada di **semua** game! Tombol ⛶ di pojok kanan atas
modal game. Pakai Fullscreen API standar browser. ESC untuk keluar.

Diatur di: `src/components/games/GameModal.tsx` (function `toggleFullscreen`)

---

## 🏷️ 5. Ubah Nama Brand

Ganti string `"U deserve to happy"` di file:
- `src/components/shell/HUD.tsx` (yang tampil di header)
- `src/routes/__root.tsx` (meta author)
- `src/routes/index.tsx`, `playground.tsx`, `shop.tsx` (page titles)

Logo brand: ganti file di `src/assets/logos/brand.png`

---

## 🎨 6. Ubah Warna / Tema

**Lokasi**: `src/styles.css` (block `:root`)

Variabel utama (semua format `oklch`):
- `--rose`, `--blush`, `--lavender`, `--sky`, `--mint`, `--butter` → palet pastel
- `--background`, `--foreground`, `--primary` → tema utama
- `--gradient-primary`, `--shadow-elegant` → efek

Kelas Tailwind otomatis bisa pakai: `bg-rose`, `text-lavender`, dll.

---

## 💌 7. Ubah Kata-Kata Penyemangat

**Lokasi**: `src/lib/comfortMessages.ts`
Tinggal edit array, tambah/kurangi kalimat sesuka hati.

---

## 📚 8. Ubah Kosa Kata Game Translate

**Lokasi**: `src/lib/vocab.ts`
Edit array `VOCAB` — format: `{ id: "...", en: "english", words: ["indonesia"] }`

---

## 🐾 9. Ubah Daftar Pet di Pet Shop

**Lokasi**: `src/lib/pets.ts`
Gambar pet ditaruh di `src/assets/pets/`

---

## 🎯 10. Ubah Pop-Up Music Player

**Lokasi**: `src/components/shell/MusicPlayer.tsx`

- Klik di luar kotak putih → tutup (sudah aktif)
- Posisi pop-up: lihat class `mt-16 sm:mt-0` (margin top di mobile)
- Tampilan tombol musik di HUD: function `MusicButton` paling atas

---

## 🤗 11. Ubah Comfort Overlay

**Lokasi**: `src/components/shell/ComfortOverlay.tsx`

- Tutup dengan klik di mana saja atau ESC (sudah aktif)
- Animasi diacak dari array `["hug", "pat", "pinch"]` → tambah "kiss" misal

---

## 🚀 12. Publish Project

Klik tombol **Publish** di pojok kanan atas Lovable.
URL akan jadi `https://xxx.lovable.app`. Iframe game embed akan jalan
normal di domain publish (bukan di preview).

---

**Tips**: Setiap file kode punya komentar `// ===` di paling atas yang
ngejelasin fungsinya. Baca itu dulu sebelum edit ya 🌷

---

## 🎮 Nambah Game Eksternal (ZIP)

Punya game HTML dari itch.io / construct / scratch offline?
Bisa ditaruh di folder **`public/external-games/`**.

**Langkah singkat:**
1. Extract ZIP-nya ke `public/external-games/nama-game/`
   (harus ada `index.html` di dalamnya)
2. Buka `src/lib/games.ts`, tambah entry baru:
   ```ts
   { id: "nama-game", name: "Judul", emoji: "🎮", desc: "...",
     tone: "from-mint to-sky",
     embed: "/external-games/nama-game/index.html" },
   ```
3. Refresh — game langsung muncul di Playground.

Panduan lengkap + troubleshooting ada di
**`public/external-games/README.md`**.
