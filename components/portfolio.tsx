"use client";

import { useState } from "react";
import Image from "next/image";
import { useScramble } from "use-scramble";
import { useKeyboardShortcut } from "../hooks/keyboard-shortcuts";
import { getPortfolio } from "@/lib/data";

const getDomainFromUrl = (url: string) => {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
};

export const Portfolio = () => {
  const portfolio = getPortfolio();

  const ITEM_HEIGHT = 112; // Height of each grid item in pixels
  const GRID_COLS = 4;
  const gridRows = Math.ceil(portfolio.length / GRID_COLS);
  const totalHeight = ITEM_HEIGHT * gridRows;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isIconicHovered, setIsIconicHovered] = useState(false);
  const [isGridView, setIsGridView] = useState(false);

  useKeyboardShortcut({
    handlers: [
      {
        key: "l",
        handler: () => setIsGridView(false),
        description: "Switch to list view",
      },
      {
        key: "g",
        handler: () => setIsGridView(true),
        description: "Switch to grid view",
      },
    ],
  });

  const renderGridIntersections = () => {
    const rows = Math.ceil(portfolio.length / 4);
    const intersections = [];
    const horizontalPoints = 4 + 1;
    const verticalPoints = rows + 1;

    for (let row = 0; row < verticalPoints; row++) {
      for (let col = 0; col < horizontalPoints; col++) {
        const isHighlighted =
          hoveredIndex !== null &&
          // Check if this intersection point is one of the four corners of the hovered item
          ((row === Math.floor(hoveredIndex / 4) && col === hoveredIndex % 4) || // top-left
            (row === Math.floor(hoveredIndex / 4) &&
              col === (hoveredIndex % 4) + 1) || // top-right
            (row === Math.floor(hoveredIndex / 4) + 1 &&
              col === hoveredIndex % 4) || // bottom-left
            (row === Math.floor(hoveredIndex / 4) + 1 &&
              col === (hoveredIndex % 4) + 1)); // bottom-right

        intersections.push(
          <div
            key={`intersection-${row}-${col}`}
            className={`absolute w-3 h-3 flex items-center justify-center transition-colors duration-200 ${
              isHighlighted
                ? "text-[var(--color-primary)]"
                : "text-gray-800 dark:text-gray-400"
            }`}
            style={{
              top: `${(row * 100) / rows}%`,
              left:
                col === 0
                  ? "0%"
                  : col === horizontalPoints - 1
                  ? "100%"
                  : `${(col * 100) / 4}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            +
          </div>
        );
      }
    }

    return intersections;
  };

  return (
    <div className="py-10">
      <div className={`flex justify-between items-center mb-8`}>
        <h2 className="text-lg font-bold cursor-default">
          now{" "}
          <span
            className={`inline-block transition-all duration-300 ${
              isIconicHovered ? "scale-110" : "scale-100"
            }`}
            onMouseEnter={() => setIsIconicHovered(true)}
            onMouseLeave={() => setIsIconicHovered(false)}
          ></span>
        </h2>
        <button
          onClick={() => setIsGridView(!isGridView)}
          className="hidden md:block text-sm p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
        >
          {isGridView ? "[l] list view" : "[g] grid view"}
        </button>
      </div>

      <div className="relative" style={{ height: totalHeight }}>
        {/* Grid intersections - only show on md and up when in grid view */}
        {isGridView && (
          <div className="hidden md:block">{renderGridIntersections()}</div>
        )}

        {/* List view - show on mobile OR when list view is selected */}
        <div
          className={`flex flex-col ${isGridView ? "md:hidden" : ""}`}
          style={{ height: totalHeight }}
        >
          {portfolio.map((client, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm"
              style={{ height: `${totalHeight / portfolio.length}px` }}
            >
              <span className="text-gray-800 dark:text-gray-400">+</span>
              <div className="flex items-center gap-1">
                <a
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-block"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span className="text-sm md:hidden">
                    <span className="underline">{client.title}</span>
                    {client.status && (
                      <span className="text-sm text-gray-500">
                        {" "}
                        ({client.status.toLowerCase()})
                      </span>
                    )}
                  </span>
                  <span className="hidden md:inline">
                    {hoveredIndex === index ? (
                      <ScrambleText
                        text={
                          client.title === "diagram"
                            ? "diagram.com"
                            : getDomainFromUrl(client.url)
                        }
                        className="text-sm underline text-[var(--color-primary)]"
                      />
                    ) : (
                      <span>
                        <span className="text-sm underline">
                          {client.title}
                        </span>
                        {client.status && (
                          <span className="text-sm text-gray-500">
                            {" "}
                            ({client.status.toLowerCase()})
                          </span>
                        )}
                      </span>
                    )}
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Grid view - only show on md and up when grid view is selected */}
        {isGridView && (
          <div
            className="hidden md:grid md:grid-cols-4"
            style={{ height: totalHeight }}
          >
            {portfolio.map((client, index) => (
              <a
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
                className="cursor-pointer group"
                style={{ height: "112px" }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="h-full relative flex items-center justify-center">
                  <Image
                    src={client.icon}
                    alt={client.title}
                    width={32}
                    height={32}
                    className="h-8 w-auto object-contain group-hover:opacity-0 transition-opacity dark:invert hidden md:block"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center md:flex">
                    {hoveredIndex === index ? (
                      <ScrambleText
                        text={client.title}
                        className="text-2xl font-bold tracking-wide font-geist"
                      />
                    ) : (
                      <span className="text-2xl font-bold tracking-wide font-geist">
                        {client.title}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ScrambleText = ({
  text,
  className = "text-2xl font-bold tracking-wide font-geist",
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
