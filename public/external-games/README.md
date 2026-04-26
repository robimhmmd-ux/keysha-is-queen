# 🎮 Folder Game Eksternal

Folder ini tempat naruh game HTML/JS yang udah jadi (hasil extract ZIP)
biar bisa jalan di dalam web ini lewat iframe.

---

## 📦 Cara Nambah Game Eksternal (ZIP)

### 1. Siapkan file game-nya
Game eksternal harus berbentuk **web statis** (HTML + CSS + JS).
Biasanya ZIP dari itch.io / construct / GDevelop / scratch (offline) /
unity webgl udah berisi:

```
namagame.zip
 ├── index.html        ← WAJIB ada file ini
 ├── style.css
 ├── script.js
 ├── assets/
 └── ...
```

### 2. Extract ke folder ini
Bikin subfolder baru di `public/external-games/` dengan nama game-nya
(huruf kecil, pakai strip `-`, jangan ada spasi).

Contoh struktur akhir:
```
public/external-games/
 ├── README.md                     ← file ini
 ├── pet-simulator/
 │    ├── index.html
 │    ├── style.css
 │    └── script.js
 └── dress-up/
      ├── index.html
      └── assets/
```

### 3. Daftarkan game-nya di kode
Buka file: **`src/lib/games.ts`**
Tambah entry baru di array `GAMES`, contoh:

```ts
{
  id: "pet-simulator",                    // sama dengan nama folder
  name: "Pet Simulator",
  emoji: "🐶",
  desc: "Pelihara binatang lucu",
  tone: "from-mint to-sky",
  embed: "/external-games/pet-simulator/index.html"   // ← path ke index.html
},
```

Field `embed` ini tandanya game ini external (iframe).
Game tanpa `embed` = game native React.

### 4. Selesai!
Refresh playground, game baru langsung muncul.

---

## ⚠️ Hal-hal Penting

1. **Path harus diawali `/external-games/...`** — jangan pakai `./` atau `public/`.
   Vite serve folder `public/` di root URL.

2. **Game harus self-contained** — semua aset (gambar, suara, font)
   pakai path RELATIF ke `index.html`-nya. Contoh:
   - ✅ `<img src="cat.png">`
   - ✅ `<img src="img/cat.png">`
   - ❌ `<img src="/cat.png">` (ini ngarah ke root web, bukan ke folder game)

3. **Kalau game-nya pakai library CDN** (jQuery, Phaser, dll) —
   biarin aja, asal koneksi internet ada pas main.

4. **Game pakai `localStorage`** akan share storage sama web utama.
   Biasanya nggak masalah, tapi inget aja.

5. **Game berat (Unity WebGL)** boleh, tapi load-nya lama & file ZIP
   bisa puluhan MB. Pastikan worth it.

---

## 🛠️ Troubleshooting

| Masalah | Solusi |
|---|---|
| Game blank / error 404 di console | Cek path `embed` di `games.ts` — harus persis sama dengan folder |
| Gambar/suara nggak muncul | Cek path aset di HTML/CSS — harus relatif, bukan absolut |
| Game keluar dari iframe | Tambahin `sandbox` di iframe (lihat `EmbedGame.tsx`) |
| Game kepotong / kekecilan | Wajar — iframe punya size tetap. Bisa pakai tombol fullscreen ⛶ |

---

## 📁 Game Native vs Game Eksternal

| | Native (React) | Eksternal (iframe) |
|---|---|---|
| Lokasi kode | `src/components/games/` | `public/external-games/` |
| Bahasa | TypeScript + React | HTML/CSS/JS apapun |
| Field `embed` | tidak ada | wajib ada |
| Akses ke heart points | langsung lewat `onScore` | tidak (terpisah) |
| Performa | cepat | tergantung game |

Selamat nambahin game! 🌷
