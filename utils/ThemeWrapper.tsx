import React from "react";
import { View } from "react-native";
import { useTheme } from "./ThemeProvider";

interface ThemeWrapperProps {
  children: React.ReactNode;
  style?: any;
  className?: string;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({
  children,
  style,
  className = "",
}) => {
  const { isDark } = useTheme();

  // Add 'dark' class when in dark mode for Tailwind CSS
  const themeClass = isDark ? "dark " + className : className;

  return (
    <View style={style} className={themeClass}>
      {children}
    </View>
  );
};
