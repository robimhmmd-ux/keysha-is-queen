# 🎵 Folder Musik

## Cara nambah lagu (paling gampang)

1. Drop file **.mp3** ke folder ini (`src/assets/music/`)
2. Refresh — lagu langsung muncul di pemutar

**Nama yang tampil = nama file** (tanpa `.mp3`).
Dash (`-`) dan underscore (`_`) otomatis jadi spasi.

| Nama file              | Tampil sebagai     |
| ---------------------- | ------------------ |
| `lagu1.mp3`            | lagu1              |
| `cozy-night.mp3`       | cozy night         |
| `morning_garden.mp3`   | morning garden     |

## Cara hapus lagu
Tinggal hapus file mp3 nya. Done.

## Catatan
- Format harus `.mp3` (case-insensitive).
- Kalau folder ini kosong, player otomatis pakai 4 lagu online
  fallback (lihat `tracks.ts`).
- Kalau mau judul lebih cantik (huruf besar, dll), edit
  fungsi `prettify()` di `tracks.ts`.
