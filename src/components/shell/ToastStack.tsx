// Toast stack — top-right gentle notifications.
import { useApp } from "@/state/AppContext";

export function ToastStack() {
  const { toasts } = useApp();
  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="glass-card rounded-2xl px-4 py-2.5 text-sm font-semibold animate-pop-in"
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}
