// =============================================================
// 🎵 DAFTAR LAGU — auto-generated dari folder ini
// -------------------------------------------------------------
// CARA NAMBAH LAGU BARU:
//   1. Drop file .mp3 ke folder ini (src/assets/music/)
//      Contoh: "lagu-baru.mp3"
//   2. Selesai! Nama yang muncul di player = nama file (tanpa .mp3),
//      dengan dash/underscore diubah jadi spasi.
//
// Vite `import.meta.glob` otomatis nge-scan semua .mp3 di folder ini
// pas build/dev, jadi nggak perlu daftar manual lagi.
// =============================================================

export type Track = {
  id: string;
  title: string;
  artist: string;
  src: string;
};

// Scan semua mp3 di folder ini -> { "./lagu1.mp3": "/assets/lagu1-xxx.mp3" }
const files = import.meta.glob("./*.mp3", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

// Ubah "./nama_lagu-keren.mp3" -> "nama lagu keren"
function prettify(path: string): string {
  const base = path.replace(/^\.\//, "").replace(/\.mp3$/i, "");
  return base.replace(/[-_]+/g, " ").trim();
}

const localTracks: Track[] = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, url], i) => ({
    id: `local-${i}`,
    title: prettify(path),
    artist: "Local",
    src: url,
  }));

// Fallback online tracks — dipakai kalau folder masih kosong
const onlineTracks: Track[] = [
  { id: "1", title: "Lofi Study",     artist: "FASSounds",        src: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" },
  { id: "2", title: "Cozy Place",     artist: "Coma-Media",       src: "https://cdn.pixabay.com/audio/2024/02/04/audio_2e8e91e1d2.mp3" },
  { id: "3", title: "Dreamy Piano",   artist: "Lemonmusicstudio", src: "https://cdn.pixabay.com/audio/2023/06/05/audio_5b41c95c93.mp3" },
  { id: "4", title: "Soft Rain",      artist: "PianoAmor",        src: "https://cdn.pixabay.com/audio/2022/10/18/audio_31c2730e64.mp3" },
];

export const TRACKS: Track[] = localTracks.length > 0
  ? localTracks
  : onlineTracks;
