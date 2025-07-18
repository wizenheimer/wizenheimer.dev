"use client";

import * as React from "react";
import { useCallback, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { themeColors, type ThemeColor } from "@/config/colors";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useKeyboardShortcut } from "@/hooks/keyboard-shortcuts";

export function ColorSwitcher() {
  const DEFAULT_THEME: ThemeColor = "red";

  const setThemeColor = useCallback((color: ThemeColor) => {
    const root = document.documentElement;
    const colors = themeColors[color];

    root.style.setProperty("--color-primary", colors.primary);
    root.style.setProperty("--color-secondary", colors.secondary);
    root.style.setProperty("--color-background-light", colors.light);
    root.style.setProperty("--color-background-dark", colors.dark);
    
    localStorage.setItem("theme-color", color);
  }, []);

  useEffect(() => {
    const savedColor = localStorage.getItem("theme-color") as ThemeColor | null;
    if (savedColor && themeColors[savedColor]) {
      setThemeColor(savedColor);
    } else {
      setThemeColor(DEFAULT_THEME);
    }
  }, [setThemeColor]);

  useKeyboardShortcut({
    handlers: Object.entries(themeColors).map(([key, color], index) => ({
      key: `${index + 1}`,
      handler: () => setThemeColor(key as ThemeColor),
      description: `Switch to ${color.name} theme`,
    })).slice(0, 7),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-2 sm:h-auto h-12 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)] inline-flex items-center gap-2"
        >
          <div
            className="sm:w-4 sm:h-4 w-5 h-5 rounded-full [background-color:var(--color-primary)]"
          />
          <ChevronDown className="sm:w-4 sm:h-4 w-5 h-5" />
          <span className="sr-only">change theme color</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="dark:bg-[var(--color-background-dark)] bg-[var(--color-background-light)]"
      >
        {Object.entries(themeColors).map(([key, color]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setThemeColor(key as ThemeColor)}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color.primary }}
              />
              <span className="font-mono">{color.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
