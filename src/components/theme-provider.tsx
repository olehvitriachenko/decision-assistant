"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import { THEME_STORAGE_KEY } from "@/lib/theme/constants";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme?: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  resolvedTheme?: ResolvedTheme;
  systemTheme?: ResolvedTheme;
  themes: Theme[];
};

const themes: Theme[] = ["light", "dark", "system"];

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

function applyTheme(theme: Theme, disableTransitionOnChange: boolean) {
  const root = document.documentElement;
  const resolved = resolveTheme(theme);
  let restoreTransitions: (() => void) | undefined;

  if (disableTransitionOnChange) {
    const style = document.createElement("style");
    style.appendChild(
      document.createTextNode(
        "*,*::before,*::after{transition:none!important}"
      )
    );
    document.head.appendChild(style);
    restoreTransitions = () => {
      window.getComputedStyle(document.body);
      document.head.removeChild(style);
    };
  }

  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;

  restoreTransitions?.();
  return resolved;
}

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);

    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // Ignore storage access errors.
  }

  return "system";
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  disableTransitionOnChange = false,
}: {
  children: ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  attribute?: "class";
  disableTransitionOnChange?: boolean;
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = readStoredTheme();
    setThemeState(stored);
    setResolvedTheme(applyTheme(stored, false));
    setMounted(true);

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function handleSystemThemeChange() {
      if (readStoredTheme() === "system") {
        setResolvedTheme(applyTheme("system", disableTransitionOnChange));
      }
    }

    media.addEventListener("change", handleSystemThemeChange);

    return () => {
      media.removeEventListener("change", handleSystemThemeChange);
    };
  }, [disableTransitionOnChange]);

  const setTheme = useCallback<Dispatch<SetStateAction<Theme>>>(
    (value) => {
      setThemeState((current) => {
        const next = typeof value === "function" ? value(current) : value;

        try {
          localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {
          // Ignore storage access errors.
        }

        setResolvedTheme(applyTheme(next, disableTransitionOnChange));
        return next;
      });
    },
    [disableTransitionOnChange]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: mounted ? theme : undefined,
      setTheme,
      resolvedTheme: mounted ? resolvedTheme : undefined,
      systemTheme: mounted ? getSystemTheme() : undefined,
      themes,
    }),
    [mounted, resolvedTheme, setTheme, theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
