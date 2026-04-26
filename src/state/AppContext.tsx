// Global app state: heart points, owned pets, comfort overlay, toasts.
// Persist to localStorage so progress isn't lost.
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { randomFrom, comfortMessages } from "@/lib/comfortMessages";

type AppState = {
  hearts: number;
  ownedPets: string[];
  activePets: string[]; // pets currently displayed as floating companions
  addHearts: (n: number, reason?: string) => void;
  spendHearts: (n: number) => boolean;
  buyPet: (id: string, price: number) => boolean;
  togglePetActive: (id: string) => void;
  toast: (msg: string) => void;
  toasts: { id: number; msg: string }[];
  showComfort: () => void;
  comfortOpen: boolean;
  closeComfort: () => void;
  comfortText: string;
};

const Ctx = createContext<AppState | null>(null);

const LS_KEY = "comfort-nook-v1";

type Persisted = { hearts: number; ownedPets: string[]; activePets: string[] };

function load(): Persisted {
  if (typeof window === "undefined") return { hearts: 0, ownedPets: [], activePets: [] };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { hearts: 0, ownedPets: [], activePets: [] };
    return JSON.parse(raw);
  } catch {
    return { hearts: 0, ownedPets: [], activePets: [] };
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [hearts, setHearts] = useState(0);
  const [ownedPets, setOwnedPets] = useState<string[]>([]);
  const [activePets, setActivePets] = useState<string[]>([]);
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);
  const [comfortOpen, setComfortOpen] = useState(false);
  const [comfortText, setComfortText] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on client
  useEffect(() => {
    const p = load();
    setHearts(p.hearts);
    setOwnedPets(p.ownedPets);
    setActivePets(p.activePets);
    setHydrated(true);
  }, []);

  // Persist on change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_KEY, JSON.stringify({ hearts, ownedPets, activePets }));
  }, [hearts, ownedPets, activePets, hydrated]);

  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const addHearts = useCallback((n: number, reason?: string) => {
    setHearts((h) => {
      const next = h + n;
      // Reward at every 100-point milestone crossed
      if (Math.floor(next / 100) > Math.floor(h / 100)) {
        setTimeout(() => toast(randomFrom(comfortMessages)), 400);
      }
      return next;
    });
    if (reason) toast(`+${n} 🤍 ${reason}`);
  }, [toast]);

  const spendHearts = useCallback((n: number) => {
    let ok = false;
    setHearts((h) => {
      if (h >= n) { ok = true; return h - n; }
      return h;
    });
    return ok;
  }, []);

  const buyPet = useCallback((id: string, price: number) => {
    if (ownedPets.includes(id)) return false;
    if (hearts < price) { toast("Heart points belum cukup, main lagi yuk 🤍"); return false; }
    setHearts((h) => h - price);
    setOwnedPets((p) => [...p, id]);
    setActivePets((a) => [...a, id]);
    toast("Pet baru jadi temenmu 💕");
    return true;
  }, [hearts, ownedPets, toast]);

  const togglePetActive = useCallback((id: string) => {
    setActivePets((a) => a.includes(id) ? a.filter((x) => x !== id) : [...a, id]);
  }, []);

  const showComfort = useCallback(() => {
    setComfortText(randomFrom(comfortMessages));
    setComfortOpen(true);
  }, []);

  const closeComfort = useCallback(() => setComfortOpen(false), []);

  return (
    <Ctx.Provider value={{
      hearts, ownedPets, activePets,
      addHearts, spendHearts, buyPet, togglePetActive,
      toast, toasts,
      showComfort, comfortOpen, closeComfort, comfortText,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
