"use client";

import { useCallback, useEffect, useState } from "react";

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
   * Random offset initialized once per component mount.
   * This makes each artist potentially start at a different image on page load.
   */
  const [randomOffset] = useState(() =>
    images.length > 0 ? Math.floor(Math.random() * images.length) : 0,
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(randomOffset);

  const handleScroll = useCallback(() => {
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
  }, [images.length, randomOffset]);

  useEffect(() => {
    if (!enabled || images.length <= 1) {
      return;
    }

    /** Initialize last scroll position */
    lastScrollY = window.scrollY;

    /** Set initial image based on current accumulated scroll (deferred to avoid sync setState) */
    const initialFrame = requestAnimationFrame(() => {
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
  }, [enabled, images.length, handleScroll, randomOffset]);

  return {
    currentImageIndex,
    currentImage: images[currentImageIndex] || images[0] || "",
  };
}
