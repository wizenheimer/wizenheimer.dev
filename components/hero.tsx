"use client";

import { useScramble } from "use-scramble";

export const Hero = () => {
  return (
    <div className="max-w-xl py-5">
      <h1 className="text-3xl font-bold mb-4 cursor-default h-[80px] sm:h-auto">
        <span className="inline-block">
          <ScrambleText
            text="tl;dr"
            className="whitespace-pre-wrap md:whitespace-nowrap"
          />
        </span>
      </h1>
      <p className="text-sm">
        i&apos;m a product engineer who loves chasing the thrill of 0→1. i enjoy
        turning things around—especially the messy, overlooked ones that quietly
        dare you to try.
        <br />
        <br />i care deeply about distributed systems - and even more when it
        intersects with machine learning. when i&apos;m not coding or
        whiteboarding, you&apos;ll probably find me reading non-fiction,
        writing, or playing badminton.
        <br />
        <br />
        this is my tiny corner on the internet where i share thoughts, notes, or
        works in progress. if something resonates - hit me up.
      </p>
    </div>
  );
};

const ScrambleText = ({
  text,
  className = "",
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
