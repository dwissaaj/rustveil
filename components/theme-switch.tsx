"use client";

import { FC } from "react";
import { Switch } from "@heroui/switch";
import { useTheme } from "next-themes";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();

  const isLight = theme === "light";

  return (
    <Switch
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      isSelected={isLight}
      onValueChange={(selected) => setTheme(selected ? "light" : "dark")}
      className={className}
    >
      {isLight ? (
        <SunFilledIcon size={22} />
      ) : (
        <MoonFilledIcon size={22} />
      )}
    </Switch>
  );
};