"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const DisintegratingText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const text = children?.toString() || "";

  const chars = text.split("").map((char, index) => ({
    char,
    position: index,
    isSpace: char === " ",
  }));

  useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => {
        setIsHovered(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isHovered]);

  return (
    <div className={className} style={{ position: "relative" }}>
      <motion.div
        className="inline-block cursor-default"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {chars.map((item, i) =>
          item.isSpace ? (
            <span key={i}>&nbsp;</span>
          ) : (
            <motion.span
              key={i}
              style={{
                display: "inline-block",
                position: isHovered ? "relative" : "static",
              }}
              animate={
                isHovered
                  ? {
                      y: Math.random() * 100 - 50,
                      x: Math.random() * 100 - 50,
                      scale: 0,
                      opacity: 0,
                    }
                  : {
                      y: 0,
                      x: 0,
                      scale: 1,
                      opacity: 1,
                    }
              }
              transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              {item.char}
            </motion.span>
          )
        )}
      </motion.div>
    </div>
  );
};

const PREV_ITEMS = [
  "oversaw product and investor relations at a $10M ARR startup",
  "somehow ended up winning more product case competitons than hackathons",
  "made up for it by shipping a vector DB with HNSW indexing on top of Chrome's IndexedDB",
  "hit front page of Hacker News, and lived to tell the tale",
  "shipped open-source competitive intelligence infrastructure for teams",
  "built a tiny SDK that lets you run inference right inside your browser",
  "also made an ios app that monitors your posture using your airpods motion sensors",
  "built a toolkit to help engineering managers stop flying blind",
  "shipped a tool to help teams transform unstructured data into usable datasets",
  "built chaos engineering toolkit for teams - re-implemented chaos monkey - ",
  "implemented a B-tree-based database from scratch, because why not?",
  "shipped a platform to streamline micro private equity buyouts - streamlining due diligence",
  "built an incident management platform designed for scale-ups",
];

const NOW_ITEMS = [
  "currently i'm heads down building cruso - an ai assistant you can email",
  "it's part utility, part ubiquity, and fully an excuse to avoid building a UI",
  "i also work at Couchbase, owning all things model serving and inference",
  "shipped 3 out of 5 major undertakings in the last 2 years - from unstructured data service to model serving and inference",
  "outside of that, i'm trying to learn about distribution - how to get people to care",
  "other than that, i'm building my writing muscle, reading more consistently, and trying not to burn out",
  "somehow, i've managed to gain a rep - someone who is intense, takes extreme ownership, and holds the bar high (and then raises it slightly out of reach)",
  "one who actively seeks conflicts. ask a lot of tough questions, and move like it's your name on the cap table",
  "not everyone loves that. but things ship, and the bar stays high. maybe that's the whole job",
  "currently, i'm trying to get better at the less-talked-about half of the job - managing up, and collaborating wide",
];

export const About = () => {
  return (
    <div className="py-10">
      <div className="md:hidden">
        <h1 className="text-lg font-bold mb-4">tl;dr</h1>
      </div>
      <div className="hidden md:block">
        <DisintegratingText className="text-lg font-bold mb-4">
          work log
        </DisintegratingText>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <h2 className="font-semibold text-sm">prev</h2>
          <div className="space-y-3 text-sm">
            {PREV_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center space-x-3 text-sm">
                <span>* {item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="font-semibold text-sm">now</h2>
          <div className="space-y-3 text-sm">
            {NOW_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center space-x-3 text-sm">
                <span>* {item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
