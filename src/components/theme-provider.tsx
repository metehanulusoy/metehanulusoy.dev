"use client";

import { useCallback, useEffect, useSyncExternalStore, type ReactNode } from "react";

type Theme = "dark" | "light";

const THEME_STORAGE_KEY = "theme";
const THEME_EVENT = "themechange";

function storedTheme(): Theme {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

/* The DOM is the store: SSR ships the `dark` class, ThemeProvider re-applies the
   persisted theme on mount, and every consumer reads the class via
   useSyncExternalStore — no provider state, so no setState-in-effect and no
   React-rendered <script> (which React 19 warns about). */
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

/** The single source of truth for the .light/.dark class strategy on <html>. */
export function applyThemeClass(root: HTMLElement, theme: Theme) {
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

function applyTheme(theme: Theme) {
  applyThemeClass(document.documentElement, theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* storage may be unavailable (private mode) — theme still applies */
  }
  window.dispatchEvent(new Event(THEME_EVENT)); // notify same-tab subscribers
}

/** SSR ships the dark class; on mount we apply the persisted theme so returning
 *  light-mode users switch over (one brief frame of dark — the dark-first default
 *  — since there's no blocking inline script). */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    applyThemeClass(document.documentElement, storedTheme());
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);
  return <>{children}</>;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setTheme = useCallback((next: Theme) => applyTheme(next), []);
  return { theme, resolvedTheme: theme, setTheme };
}
