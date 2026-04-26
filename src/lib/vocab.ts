// =============================================================
// Daftar kosa kata Indonesia <-> English untuk game tebak kata.
// Tiap entry punya `id` (Indonesia) dan `en` (English).
// Tambah/edit kata di sini bebas; minimal harus ada 25 entry
// supaya game 25-round bisa jalan tanpa pengulangan.
// =============================================================
export type VocabPair = { id: string; en: string };

export const VOCAB: VocabPair[] = [
  { id: "sabar",        en: "be patient" },
  { id: "tenang",       en: "calm" },
  { id: "bahagia",      en: "happy" },
  { id: "sedih",        en: "sad" },
  { id: "lelah",        en: "tired" },
  { id: "semangat",     en: "spirit" },
  { id: "tidur",        en: "sleep" },
  { id: "makan",        en: "eat" },
  { id: "minum",        en: "drink" },
  { id: "berjalan",     en: "walk" },
  { id: "berlari",      en: "run" },
  { id: "tertawa",      en: "laugh" },
  { id: "menangis",     en: "cry" },
  { id: "rumah",        en: "home" },
  { id: "sekolah",      en: "school" },
  { id: "buku",         en: "book" },
  { id: "teman",        en: "friend" },
  { id: "keluarga",     en: "family" },
  { id: "cinta",        en: "love" },
  { id: "berani",       en: "brave" },
  { id: "jujur",        en: "honest" },
  { id: "kucing",       en: "cat" },
  { id: "anjing",       en: "dog" },
  { id: "bunga",        en: "flower" },
  { id: "matahari",     en: "sun" },
  { id: "bulan",        en: "moon" },
  { id: "bintang",      en: "star" },
  { id: "hujan",        en: "rain" },
  { id: "pelangi",      en: "rainbow" },
  { id: "musik",        en: "music" },
  { id: "mimpi",        en: "dream" },
  { id: "harapan",      en: "hope" },
  { id: "syukur",       en: "grateful" },
  { id: "maaf",         en: "sorry" },
  { id: "terima kasih", en: "thank you" },
];
