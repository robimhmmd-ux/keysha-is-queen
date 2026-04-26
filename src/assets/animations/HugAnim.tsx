// =============================================================
// HugAnim — animasi peluk
// -------------------------------------------------------------
// Default: nyari file `hug.gif` di folder ini.
// Kalau file ga ada, fallback ke animasi emoji bawaan.
// Cara ganti: drop file `hug.gif` ke src/assets/animations/
// =============================================================
import { useState } from "react";

// Vite akan resolve ini saat build. Kalau file belum ada,
// import gagal -> kita pakai try/catch via dynamic glob.
const gifs = import.meta.glob("./hug.gif", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const hugUrl = gifs["./hug.gif"];

export function HugAnim() {
  const [error, setError] = useState(false);

  if (hugUrl && !error) {
    return (
      <img
        src={hugUrl}
        alt="peluk"
        onError={() => setError(true)}
        className="max-h-44 sm:max-h-52 object-contain drop-shadow-lg"
      />
    );
  }

  // Fallback emoji (kalau hug.gif belum di-upload)
  return (
    <div className="relative w-40 h-40">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl animate-bounce-soft">🤗</div>
      <div className="absolute left-2 bottom-4 text-4xl animate-wiggle">💖</div>
      <div className="absolute right-2 top-4 text-4xl animate-wiggle">💕</div>
    </div>
  );
}
