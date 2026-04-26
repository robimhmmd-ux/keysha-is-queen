// =============================================================
// EmbedGame — render game eksternal (HTML/JS) di dalam iframe.
// Dipakai untuk game-game yang ditaruh di public/external-games/.
//
// Cara kerja:
//  - GameMeta yang punya field `embed` akan dirender pakai komponen ini.
//  - `src` iframe = path ke index.html game (mis. /external-games/foo/index.html)
//  - Iframe pakai sandbox seperlunya biar aman tapi tetep bisa jalan.
//
// Heart points untuk game embed otomatis +5 saat game dibuka
// (karena kita nggak bisa baca skor dari iframe eksternal).
// =============================================================
import { useEffect, useRef } from "react";
import type { GameProps } from "./GameModal";

export function makeEmbedGame(src: string) {
  return function EmbedGame({ onScore }: GameProps) {
    const scoredRef = useRef(false);

    useEffect(() => {
      if (!scoredRef.current) {
        scoredRef.current = true;
        // kasih hadiah kecil tiap kali buka game eksternal
        onScore(5);
      }
    }, [onScore]);

    return (
      <iframe
        src={src}
        title="external game"
        // sandbox: izinkan script + same-origin (biar localStorage jalan) +
        // pointer-lock & fullscreen untuk game yang butuh kontrol penuh.
        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups allow-forms"
        allow="autoplay; fullscreen; gamepad"
        className="w-full h-[60vh] sm:h-[70vh] rounded-xl border-0 bg-white"
      />
    );
  };
}
