import { useEffect, useState } from "react";
import { Appearance } from "react-native";
import { storage } from "./Mmkv";

export type ThemeMode = "light" | "dark";

export const THEME_KEY = "theme_mode";

export function useColorScheme(): ThemeMode {
  const [theme, setTheme] = useState<ThemeMode>("dark"); // default dark

  useEffect(() => {
    (async () => {
      const stored = await storage.getString(THEME_KEY);
      if (stored === "light" || stored === "dark") {
        setTheme(stored);
      } else {
        // fallback to system
        const sys = Appearance.getColorScheme();
        setTheme(sys === "light" ? "light" : "dark");
      }
    })();
  }, []);

  return theme;
}

export async function setThemeMode(mode: ThemeMode) {
  await storage.setString(THEME_KEY, mode);
}
