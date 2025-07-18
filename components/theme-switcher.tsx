"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useCallback } from "react"
import { useKeyboardShortcut } from "../hooks/keyboard-shortcuts"

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  const handleThemeChange = useCallback((newTheme: string) => {
    setTheme(newTheme)
  }, [setTheme])

  useKeyboardShortcut({
    handlers: [
      {
        key: 'd',
        handler: () => handleThemeChange(resolvedTheme === "dark" ? "light" : "dark"),
        description: 'Toggle dark/light mode',
      },
    ],
  });

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="p-1 sm:h-auto h-12 flex items-center rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)]">
      <button
        onClick={() => handleThemeChange("light")}
        className={`rounded-md p-2 sm:p-1 transition-colors ${
          resolvedTheme === "light" 
            ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white" 
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        <Sun className="sm:w-4 sm:h-4 w-5 h-5" />
        <span className="sr-only">Light mode</span>
      </button>

      <button
        onClick={() => handleThemeChange("dark")}
        className={`rounded-md p-2 sm:p-1 transition-colors ${
          resolvedTheme === "dark" 
            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" 
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        <Moon className="sm:w-4 sm:h-4 w-5 h-5" />
        <span className="sr-only">Dark mode</span>
      </button>
    </div>
  )
}
