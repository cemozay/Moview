import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import { storage } from "../utils/Mmkv";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useSystemColorScheme();
  const [theme, setThemeState] = useState<Theme>("dark"); // default dark
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await storage.getString("theme");
        if (storedTheme === "light" || storedTheme === "dark") {
          setThemeState(storedTheme);
        } else {
          // Use system preference if no stored preference
          setThemeState(systemColorScheme === "light" ? "light" : "dark");
        }
      } catch (error) {
        console.error("Error loading theme:", error);
        setThemeState("dark");
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  const setTheme = async (newTheme: Theme) => {
    try {
      await storage.setString("theme", newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const value = {
    theme,
    setTheme,
    isDark: theme === "dark",
  };

  // Show loading state while theme is being loaded
  if (!isLoaded) {
    return (
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
