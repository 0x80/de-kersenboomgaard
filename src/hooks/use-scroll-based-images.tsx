"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseScrollBasedImagesProps {
  images: string[];
  enabled?: boolean;
}

/** Shared scroll state across all hook instances for synchronized transitions */
let globalAccumulatedScroll = 0;
let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;

export function useScrollBasedImages({
  images,
  enabled = true,
}: UseScrollBasedImagesProps) {
  /**
   * Random offset stored in ref, initialized after hydration.
   * This makes each artist potentially start at a different image on page load.
   */
  const randomOffsetRef = useRef<number | null>(null);

  /** Start at index 0 for SSR, will be updated after hydration */
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const randomOffset = randomOffsetRef.current ?? 0;

    /** Calculate pixels per transition: 2 transitions per viewport height */
    const pixelsPerTransition = window.innerHeight / 2;

    /** Update global accumulated scroll (both directions count) */
    const currentScrollY = window.scrollY;
    const delta = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;
    globalAccumulatedScroll += delta;

    /** Calculate global grid index based on accumulated scroll */
    const globalIndex = Math.floor(
      globalAccumulatedScroll / pixelsPerTransition,
    );
    /** Apply random offset and cycle through images round-robin */
    const imageIndex = (globalIndex + randomOffset) % images.length;
    setCurrentImageIndex(imageIndex);
  }, [images.length]);

  useEffect(() => {
    if (!enabled || images.length <= 1) {
      return;
    }

    /** Initialize random offset once on mount (client-side only) */
    if (randomOffsetRef.current === null) {
      randomOffsetRef.current = Math.floor(Math.random() * images.length);
    }

    /** Initialize last scroll position */
    lastScrollY = window.scrollY;

    /** Set initial image based on current accumulated scroll (deferred to avoid sync setState) */
    const initialFrame = requestAnimationFrame(() => {
      const randomOffset = randomOffsetRef.current ?? 0;
      const pixelsPerTransition = window.innerHeight / 2;
      const globalIndex = Math.floor(
        globalAccumulatedScroll / pixelsPerTransition,
      );
      const imageIndex = (globalIndex + randomOffset) % images.length;
      setCurrentImageIndex(imageIndex);
    });

    /** Add scroll listener with throttling for better performance */
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(initialFrame);
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [enabled, images.length, handleScroll]);

  return {
    currentImageIndex,
    currentImage: images[currentImageIndex] || images[0] || "",
  };
}
