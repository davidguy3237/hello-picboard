"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { MouseEvent } from "react";

export function DarkModeToggle() {
  const { setTheme } = useTheme();

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "light") {
      setTheme("dark");
    } else if (currentTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("light");
    }
  };

  const handleDropDownClick = (e: MouseEvent) => {
    e.preventDefault();
  };

  return (
    <DropdownMenuItem
      onClick={handleDropDownClick}
      className="flex justify-between"
    >
      <label
        className="flex items-center justify-center"
        htmlFor="dark-mode-toggle"
      >
        <Moon className="mr-2 h-4 w-4" />
        Dark Mode
      </label>
      <Switch
        checked={localStorage.getItem("theme") === "dark"}
        id="dark-mode-toggle"
        onClick={handleClick}
      />
    </DropdownMenuItem>
  );
}
