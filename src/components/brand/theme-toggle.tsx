"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/**
 * Floating light/dark toggle (bottom-left). The current theme is read from the
 * `data-theme` attribute (set before paint by the layout script) via
 * useSyncExternalStore — the React-blessed way to mirror external DOM state, so
 * there's no setState-in-effect and no hydration flash. Toggling updates the
 * attribute + localStorage; a MutationObserver feeds the change back to React.
 */
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => "light");

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("aeo-theme", next);
    } catch {
      // ignore (private mode / storage disabled)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      title="Toggle light / dark"
      className="border-line-2 bg-panel text-ink-2 hover:border-accent hover:text-accent fixed bottom-5 left-5 z-90 grid size-11 place-items-center rounded-full border shadow-[0_10px_26px_-14px_rgba(0,0,0,0.4)] transition-colors"
    >
      {theme === "dark" ? (
        <Sun className="size-4.5" aria-hidden="true" />
      ) : (
        <Moon className="size-4.5" aria-hidden="true" />
      )}
    </button>
  );
}
