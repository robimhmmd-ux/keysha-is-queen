# 🎞️ Folder Animasi Comfort

Animasi yang muncul saat user nekan tombol **"Aku butuh ditemenin"**.
Ada 3 animasi: peluk, elus kepala, cubit pipi — diacak setiap dibuka.

## Mode 1 (DEFAULT sekarang) — Pakai GIF kamu sendiri

Komponen di sini sekarang nyari file GIF di folder yang sama:
- `hug.gif`   → animasi peluk
- `elus.gif`  → animasi elus kepala
- `cubit.gif` → animasi cubit pipi

**Cara ganti**: tinggal drop file gif kamu dengan nama persis di atas
ke folder ini (`src/assets/animations/`). Refresh, langsung jalan.

Kalau file gif belum ada, akan muncul fallback emoji animasi
(biar nggak error blank).

## Mode 2 — Pakai animasi emoji bawaan
Edit komponen `HugAnim.tsx` / `PatAnim.tsx` / `PinchAnim.tsx`
dan ganti `<img src={...}>` dengan emoji + className animasi.

## Cara nambah animasi baru
1. Bikin komponen baru, contoh `KissAnim.tsx`
2. Daftarkan di `src/components/shell/ComfortOverlay.tsx`:
   - Import komponennya
   - Tambah `"kiss"` ke array `list` di `useMemo`
   - Tambah `{anim === "kiss" && <KissAnim />}` di JSX
