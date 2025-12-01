"use client";

import { useCallback, useEffect, useState } from "react";

interface UseScrollBasedImagesProps {
  images: string[];
  enabled?: boolean;
  /** Initial offset for the image index, typically provided server-side for stable hydration */
  initialOffset?: number;
}

/** Shared scroll state across all hook instances for synchronized transitions */
let globalAccumulatedScroll = 0;
let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;

export function useScrollBasedImages({
  images,
  enabled = true,
  initialOffset = 0,
}: UseScrollBasedImagesProps) {
  /** Initialize with server-provided offset for stable hydration */
  const [currentImageIndex, setCurrentImageIndex] = useState(initialOffset);

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
    /** Apply initial offset and cycle through images round-robin */
    const imageIndex = (globalIndex + initialOffset) % images.length;
    setCurrentImageIndex(imageIndex);
  }, [images.length, initialOffset]);

  useEffect(() => {
    if (!enabled || images.length <= 1) {
      return;
    }

    /** Initialize last scroll position */
    lastScrollY = window.scrollY;

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
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [enabled, images.length, handleScroll]);

  return {
    currentImageIndex,
    currentImage: images[currentImageIndex] || images[0] || "",
  };
}
