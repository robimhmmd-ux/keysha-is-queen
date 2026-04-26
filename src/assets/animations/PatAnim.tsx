// =============================================================
// PatAnim — animasi elus kepala
// Default: nyari `elus.gif` di folder ini, fallback ke emoji.
// =============================================================
import { useState } from "react";

const gifs = import.meta.glob("./elus.gif", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const elusUrl = gifs["./elus.gif"];

export function PatAnim() {
  const [error, setError] = useState(false);

  if (elusUrl && !error) {
    return (
      <img
        src={elusUrl}
        alt="elus kepala"
        onError={() => setError(true)}
        className="max-h-44 sm:max-h-52 object-contain drop-shadow-lg"
      />
    );
  }

  return (
    <div className="relative w-32 h-44">
      <div className="absolute left-1/2 -top-2 text-5xl anim-pat origin-bottom">✋</div>
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 text-7xl animate-bounce-soft">😊</div>
    </div>
  );
}
