"use client";

import Content from "./content";
import CTA from "./cta";
import Navigation from "./nav";

export default function HomePage() {
  return (
    <div className="min-h-screen font-mono">
      <Navigation />
      <div className="px-4 max-w-4xl mx-auto mb-8">
        <Content />
        <CTA />
      </div>
    </div>
  );
}