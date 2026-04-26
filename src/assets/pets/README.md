# Folder Pets

Folder ini berisi **gambar/GIF semua pet** yang muncul di Pet Shop dan
berjalan di bagian bawah layar.

Nama file harus sama dengan `id` pet yang ada di `src/lib/pets.ts`.

| File         | Pet      |
|--------------|----------|
| `cat.png`    | Mochi    |
| `rabbit.png` | Bun      |
| `blob.png`   | Boba     |
| `bear.png`   | Coklat   |
| `duck.png`   | Kwek     |
| `ghost.png`  | Pup      |
| `frog.png`   | Hijau    |
| `chick.png`  | Kuning   |

## Cara ganti dengan GIF animasi
1. Siapkan file GIF (transparan recommended).
2. Rename jadi misal `cat.gif`.
3. Buka `src/lib/pets.ts`, ubah field `image` pet itu jadi
   `import catImg from "@/assets/pets/cat.gif"`.
4. Save — pet di bawah layar akan langsung jadi GIF animasi 🎉

> Catatan: gambar di-resize otomatis ke 64px tinggi waktu jalan di layar.
