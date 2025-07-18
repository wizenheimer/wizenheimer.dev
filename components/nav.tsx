"use client";

import { useState } from "react";
import Link from "next/link";
import { SnakeGame } from "./snake";
import { FlappyBird } from "./flappy-bird";
import { ColorSwitcher } from "./color-switcher";
import { ThemeSwitcher } from "./theme-switcher";
import { Gamepad, Keyboard, Bird, Menu, X } from "lucide-react";
import { useKeyboardShortcut } from "../hooks/keyboard-shortcuts";
import Shortcuts from "./shortcuts";
import { siteConfig } from "@/config/site";

export default function Navigation() {
  const [showSnake, setShowSnake] = useState(false);
  const [showFlappyBird, setShowFlappyBird] = useState(false);
  const [minimizedSnake, setMinimizedSnake] = useState(false);
  const [minimizedFlappyBird, setMinimizedFlappyBird] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [minimizedShortcuts, setMinimizedShortcuts] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useKeyboardShortcut({
    handlers: [
      {
        key: "b",
        handler: () => (window.location.href = "/blog"),
        description: "Go to blog",
      },
      {
        key: "l",
        handler: () => window.open(siteConfig.linkedinUrl, "_blank"),
        description: "Open LinkedIn",
      },
      {
        key: "t",
        handler: () => window.open(siteConfig.twitterUrl, "_blank"),
        description: "Open Twitter",
      },
      {
        key: "e",
        handler: () => (window.location.href = `mailto:${siteConfig.email}`),
        description: "Send email",
      },
      {
        key: "r",
        handler: () => (window.location.href = "/bookshelf"),
        description: "Go to bookshelf",
      },
      {
        key: "s",
        handler: () => setShowSnake(true),
        description: "Show snake game",
      },
      {
        key: "f",
        handler: () => setShowFlappyBird(true),
        description: "Show bird game",
      },
      {
        key: "j",
        handler: () =>
          !showShortcuts && window.scrollBy({ top: 100, behavior: "smooth" }),
        description: "Scroll down",
      },
      {
        key: "k",
        handler: () =>
          !showShortcuts && window.scrollBy({ top: -100, behavior: "smooth" }),
        description: "Scroll up",
      },
      {
        key: "x",
        handler: () => setShowShortcuts(true),
        description: "Show keyboard shortcuts",
      },
    ],
  });

  return (
    <>
      <meta
        name="terminal-description"
        content="Use B/L/T/E/R/S/F keyboard shortcuts to navigate"
      />
      <nav className="w-full sticky top-0 z-50 mb-10">
        <div className="flex max-w-4xl justify-between items-center px-4 mx-auto py-4 sm:py-6">
          <div className="flex items-center">
            <Link
              href="/"
              className="p-2 sm:h-auto h-12 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 [background-color:var(--color-primary)] inline-flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                className="sm:w-[26px] sm:h-[16px] w-[32px] h-[20px] text-white dark:text-white"
                fill="currentColor"
              >
                <path d="M40.1 467.1l-11.2 9c-3.2 2.5-7.1 3.9-11.1 3.9C8 480 0 472 0 462.2L0 192C0 86 86 0 192 0S384 86 384 192l0 270.2c0 9.8-8 17.8-17.8 17.8c-4 0-7.9-1.4-11.1-3.9l-11.2-9c-13.4-10.7-32.8-9-44.1 3.9L269.3 506c-3.3 3.8-8.2 6-13.3 6s-9.9-2.2-13.3-6l-26.6-30.5c-12.7-14.6-35.4-14.6-48.2 0L141.3 506c-3.3 3.8-8.2 6-13.3 6s-9.9-2.2-13.3-6L84.2 471c-11.3-12.9-30.7-14.6-44.1-3.9zM160 192a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
              </svg>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 ml-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)] inline-flex items-center"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
            <div className="hidden md:flex items-center space-x-2 ml-2">
              <Link
                href="/blog"
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)] inline-flex items-center text-xs"
              >
                [b] blog
              </Link>
              <a
                href={siteConfig.linkedinUrl}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)] inline-flex items-center text-xs"
                target="_blank"
                rel="noopener noreferrer"
              >
                [l] linkedin
              </a>
              <a
                href={siteConfig.twitterUrl}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)] inline-flex items-center text-xs"
                target="_blank"
                rel="noopener noreferrer"
              >
                [t] twitter
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)] inline-flex items-center text-xs"
              >
                [e] email
              </a>
              <Link
                href="/bookshelf"
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)] inline-flex items-center text-xs"
              >
                [r] reads
              </Link>
              <button
                onClick={() => setShowSnake(true)}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)] inline-flex items-center text-xs"
              >
                [s] snake
              </button>
              <button
                onClick={() => setShowFlappyBird(true)}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)] inline-flex items-center text-xs"
              >
                [f] bird
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ColorSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)]">
            <div className="px-4 py-4 space-y-2">
              <Link
                href="/blog"
                className="block p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)] text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                [b] blog
              </Link>
              <a
                href={siteConfig.linkedinUrl}
                className="block p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)] text-sm"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
              >
                [l] linkedin
              </a>
              <a
                href={siteConfig.twitterUrl}
                className="block p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)] text-sm"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
              >
                [t] twitter
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="block p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)] text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                [e] email
              </a>
              <Link
                href="/bookshelf"
                className="block p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)] text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                [r] reads
              </Link>
            </div>
          </div>
        )}
      </nav>

      {showSnake && (
        <SnakeGame
          onClose={() => setShowSnake(false)}
          isMinimized={minimizedSnake}
          onMinimize={setMinimizedSnake}
        />
      )}
      {showFlappyBird && (
        <FlappyBird
          onClose={() => setShowFlappyBird(false)}
          isMinimized={minimizedFlappyBird}
          onMinimize={setMinimizedFlappyBird}
        />
      )}
      {showShortcuts && (
        <Shortcuts
          onClose={() => setShowShortcuts(false)}
          isMinimized={minimizedShortcuts}
          onMinimize={setMinimizedShortcuts}
        />
      )}

      {(minimizedSnake || minimizedFlappyBird || minimizedShortcuts) && (
        <div className="fixed bottom-4 right-4 flex gap-2 z-50">
          {minimizedSnake && showSnake && (
            <div
              className="cursor-pointer"
              onClick={() => setMinimizedSnake(false)}
            >
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 py-2 px-4 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)]">
                <Gamepad className="w-4 h-4 text-gray-500" />
                <span className="font-mono text-sm">snake game</span>
              </div>
            </div>
          )}
          {minimizedFlappyBird && showFlappyBird && (
            <div
              className="cursor-pointer"
              onClick={() => setMinimizedFlappyBird(false)}
            >
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 py-2 px-4 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)]">
                <Bird className="w-4 h-4 text-gray-500" />
                <span className="font-mono text-sm">bird</span>
              </div>
            </div>
          )}
          {minimizedShortcuts && showShortcuts && (
            <div
              className="cursor-pointer"
              onClick={() => setMinimizedShortcuts(false)}
            >
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 py-2 px-4 [background-color:var(--color-background-light)] dark:[background-color:var(--color-background-dark)]">
                <Keyboard className="w-4 h-4 text-gray-500" />
                <span className="font-mono text-sm">keyboard shortcuts</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
