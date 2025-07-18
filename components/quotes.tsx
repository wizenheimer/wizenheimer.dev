"use client";

import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { useKeyboardShortcut } from '../hooks/keyboard-shortcuts';
import { getTestimonials } from '@/lib/data';

const quotes = getTestimonials();

export const Quotes = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Add auto-advance timer with resize handling
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const handleResize = () => {
      // Clear existing timer
      if (timer) clearInterval(timer);
      
      // Only set new timer if mobile
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        timer = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 5000);
      }
    };

    // Initial setup
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    return () => {
      if (timer) clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useKeyboardShortcut({
    handlers: [
      {
        key: 'n',
        handler: () => setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length),
        description: 'Next quote'
      },
      {
        key: 'p',
        handler: () => setCurrentIndex((prevIndex) => (prevIndex - 1 + quotes.length) % quotes.length),
        description: 'Previous quote'
      }
    ]
  });

  // Add swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    },
    onSwipedRight: () => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + quotes.length) % quotes.length
      );
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
    trackTouch: true,
    delta: 10,
    swipeDuration: 500,
  });

  return (
    <div className="pt-5 pb-10">
      <div className="flex items-center gap-6">
        <div
          {...handlers}
          className="flex gap-6"
          tabIndex={0}
          role="region"
          aria-label="Testimonial quotes"
        >
          <div className="border-l-4 border-[var(--color-primary)] pl-6 flex flex-col justify-between">
            <p className="text-sm">&ldquo;{quotes[currentIndex].text}&rdquo;</p>
            <p className="mt-4">
              —{" "}
              <a
                href={quotes[currentIndex].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary)] hover:text-[var(--color-secondary)]"
              >
                <span className="font-bold">{quotes[currentIndex].author}</span>
                {quotes[currentIndex].title && (
                  <span>, {quotes[currentIndex].title}</span>
                )}
                {quotes[currentIndex].company && (
                  <span>, {quotes[currentIndex].company}</span>
                )}
              </a>
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length)
          }
          className="hidden md:block text-sm p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors whitespace-nowrap"
        >
          [n] next
        </button>
      </div>
    </div>
  );
};
