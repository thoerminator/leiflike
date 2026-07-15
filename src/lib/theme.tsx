"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "leiflike-theme";
let listeners = new Set<() => void>();

function current(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function apply(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {}
  listeners.forEach((fn) => fn());
}

export function useTheme() {
  const theme = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    current,
    () => "light" as const
  );
  const toggle = useCallback(() => apply(current() === "dark" ? "light" : "dark"), []);
  return { theme, toggle };
}

/** Inline-Script gegen Theme-Flackern beim Laden */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${KEY}");if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})();`;
