"use client";

import { useState } from "react";
import { useScramble } from "use-scramble";
import { getBooks } from "@/lib/data";

export const Bookshelf = () => {
  const books = getBooks();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isIconicHovered, setIsIconicHovered] = useState(false);

  return (
    <div className="py-10">
      <div className="mb-8">
        <h2 className="text-lg font-bold cursor-default">
          some of my{" "}
          <span
            className={`inline-block transition-all duration-300 ${
              isIconicHovered ? "scale-110" : "scale-100"
            }`}
            onMouseEnter={() => setIsIconicHovered(true)}
            onMouseLeave={() => setIsIconicHovered(false)}
          >
            favourite
          </span>{" "}
          reads
        </h2>
      </div>

      <div className="space-y-5">
        {books.map((book, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span className="text-gray-800 dark:text-gray-400">+</span>
            <div className="flex items-center gap-1">
              <a
                href={book.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-block"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {hoveredIndex === index ? (
                  <span>
                    <ScrambleText
                      text={book.title}
                      className="text-sm underline text-[var(--color-primary)]"
                    />
                    <span className="text-sm text-gray-500">
                      {" "}
                      by {book.author}
                    </span>
                  </span>
                ) : (
                  <span>
                    <span className="text-sm underline">{book.title}</span>
                    <span className="text-sm text-gray-500">
                      {" "}
                      by {book.author}
                    </span>
                  </span>
                )}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ScrambleText = ({
  text,
  className = "text-sm underline text-[var(--color-primary)]",
}: {
  text: string;
  className?: string;
}) => {
  const { ref } = useScramble({
    text,
    speed: 0.8,
    tick: 1,
    step: 1,
    scramble: 3,
    seed: 3,
  });

  return <span ref={ref} className={className} />;
};
