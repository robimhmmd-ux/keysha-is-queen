// =============================================================
// PinchAnim — animasi cubit pipi
// Default: nyari `cubit.gif` di folder ini, fallback ke emoji.
// =============================================================
import { useState } from "react";

const gifs = import.meta.glob("./cubit.gif", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const cubitUrl = gifs["./cubit.gif"];

export function PinchAnim() {
  const [error, setError] = useState(false);

  if (cubitUrl && !error) {
    return (
      <img
        src={cubitUrl}
        alt="cubit pipi"
        onError={() => setError(true)}
        className="max-h-44 sm:max-h-52 object-contain drop-shadow-lg"
      />
    );
  }

  return (
    <div className="relative w-40 h-40">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl">🥰</div>
      <div className="absolute left-0 top-1/2 text-4xl animate-wiggle">🤏</div>
      <div className="absolute right-0 top-1/2 text-4xl animate-wiggle" style={{ transform: "scaleX(-1)" }}>🤏</div>
    </div>
  );
}
