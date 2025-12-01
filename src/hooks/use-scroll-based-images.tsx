"use client";

import { useEffect, useState } from "react";

interface UseScrollBasedImagesProps {
  images: string[];
  enabled?: boolean;
  /** Initial offset for the image index, used for varied starting positions */
  initialOffset?: number;
}

/** Shared scroll state across all hook instances */
let globalAccumulatedScroll = 0;
let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
let listenerCount = 0;
let subscribers: Set<() => void> = new Set();

/** Single global scroll handler - updates state once and notifies all subscribers */
function handleGlobalScroll() {
  const currentScrollY = window.scrollY;
  const delta = Math.abs(currentScrollY - lastScrollY);
  lastScrollY = currentScrollY;
  globalAccumulatedScroll += delta;

  /** Notify all subscribers */
  subscribers.forEach((callback) => callback());
}

/** Throttled scroll handler using requestAnimationFrame */
let ticking = false;
function throttledScrollHandler() {
  if (!ticking) {
    requestAnimationFrame(() => {
      handleGlobalScroll();
      ticking = false;
    });
    ticking = true;
  }
}

/** Register/unregister the global scroll listener based on subscriber count */
function subscribe(callback: () => void) {
  subscribers.add(callback);
  listenerCount++;

  if (listenerCount === 1) {
    lastScrollY = window.scrollY;
    window.addEventListener("scroll", throttledScrollHandler, {
      passive: true,
    });
  }

  return () => {
    subscribers.delete(callback);
    listenerCount--;

    if (listenerCount === 0) {
      window.removeEventListener("scroll", throttledScrollHandler);
    }
  };
}

export function useScrollBasedImages({
  images,
  enabled = true,
  initialOffset = 0,
}: UseScrollBasedImagesProps) {
  /** Initialize with provided offset for varied starting positions */
  const [currentImageIndex, setCurrentImageIndex] = useState(initialOffset);

  useEffect(() => {
    if (!enabled || images.length <= 1) {
      return;
    }

    /** Calculate image index from current global state */
    const updateImageIndex = () => {
      /** Guard against division by zero if images array becomes empty */
      if (images.length === 0) return;

      const pixelsPerTransition = window.innerHeight / 2;
      const globalIndex = Math.floor(
        globalAccumulatedScroll / pixelsPerTransition,
      );
      const imageIndex = (globalIndex + initialOffset) % images.length;
      setCurrentImageIndex(imageIndex);
    };

    /** Subscribe to global scroll updates */
    const unsubscribe = subscribe(updateImageIndex);

    return unsubscribe;
  }, [enabled, images.length, initialOffset]);

  return {
    currentImageIndex,
    currentImage: images[currentImageIndex] || images[0] || "",
  };
}
