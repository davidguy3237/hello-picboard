"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { MouseEvent } from "react";

export function DarkModeToggle() {
  const { theme, systemTheme, setTheme } = useTheme();

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    if (theme === "system") {
      if (systemTheme === "dark") {
        setTheme("light");
      } else if (systemTheme === "light") {
        setTheme("dark");
      }
    } else if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    }
  };

  return (
    <DropdownMenuItem onClick={handleClick} className="flex justify-between">
      <label
        className="flex items-center justify-center"
        htmlFor="dark-mode-toggle"
      >
        <Moon className="mr-2 h-4 w-4" />
        Dark Mode
      </label>
      <Switch
        checked={
          theme === "dark" || (theme === "system" && systemTheme === "dark")
        }
        id="dark-mode-toggle"
      />
    </DropdownMenuItem>
  );
}
