"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
// Import ScrollSmoother and ScrollTrigger from their specific paths
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Explicitly import ScrollTrigger

// Register plugins. It's a good practice to register all dependencies.
// Even if you only use ScrollSmoother, it depends on ScrollTrigger.
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

interface ScrollSmootherProviderProps {
  children: React.ReactNode;
}

export default function ScrollSmootherProvider({ children }: ScrollSmootherProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) {
        console.warn("ScrollSmootherProvider: Container ref is not assigned.");
        return;
      }

      // Query the specific wrapper and content elements within the containerRef's scope
      // Type assertions here are crucial for TypeScript to know these are HTMLDivElement
      const wrapper = containerRef.current.querySelector("#smooth-wrapper") as HTMLDivElement | null;
      const content = containerRef.current.querySelector("#smooth-content") as HTMLDivElement | null;

      if (!wrapper || !content) {
        console.error("ScrollSmoother: Could not find #smooth-wrapper or #smooth-content elements within the provider. Make sure they are rendered.");
        return;
      }

      // Check if ScrollSmoother has already been initialized.
      // ScrollSmoother.get() might return undefined if not yet created.
      const existingSmoother = ScrollSmoother.get();
      if (existingSmoother) {
        existingSmoother.kill(); // Kill the old instance
        console.log("Existing ScrollSmoother killed.");
      }

      // Create the ScrollSmoother instance
      ScrollSmoother.create({
        wrapper: wrapper,
        content: content,
        smooth: 1,
        effects: true,
        smoothTouch: 0.1,
      });

      console.log("ScrollSmoother initialized.");

    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <div ref={containerRef} className="container mx-auto max-w-7xl pt-20 px-6 flex-grow">
      <div id="smooth-wrapper ">
        <div id="smooth-content ">
          <div className="container mx-auto max-w-7xl pt-20 px-6 flex-grow">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}