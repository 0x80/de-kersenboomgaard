"use client";

import { useEffect, useRef, useState } from "react";

interface UseScrollBasedImagesProps {
  images: string[];
  enabled?: boolean;
}

export function useScrollBasedImages({
  images,
  enabled = true,
}: UseScrollBasedImagesProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [initialPosition, setInitialPosition] = useState<number | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || images.length <= 1) {
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const avatarCenter = rect.top + rect.height / 2; // Use center of avatar
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      // Store initial position when element first becomes visible
      if (initialPosition === null && avatarCenter < viewportHeight) {
        setInitialPosition(avatarCenter);
        return;
      }

      // Only calculate if we have an initial position
      if (initialPosition === null) return;

      // Determine travel distance based on initial position
      let travelDistance: number;

      if (initialPosition <= viewportHeight) {
        // Artist was initially visible - travel from initial position to top
        travelDistance = Math.max(initialPosition, 100);
      } else {
        // Artist was initially outside viewport - travel from initial position to viewport center
        travelDistance = initialPosition - viewportCenter;
      }

      // Calculate current progress (0 = at initial position, 1 = at target position)
      const scrollProgress = Math.max(
        0,
        Math.min(1, (initialPosition - avatarCenter) / travelDistance),
      );

      // Map progress to image index
      // 0% scroll = first image (alphabetically first)
      // 100% scroll = last image (alphabetically last)
      const imageIndex = Math.floor(scrollProgress * images.length);
      const clampedIndex = Math.max(0, Math.min(images.length - 1, imageIndex));

      setCurrentImageIndex(clampedIndex);
    };

    // Initial check
    handleScroll();

    // Add scroll listener with throttling for better performance
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
  }, [enabled, images.length, initialPosition]);

  // Reset when images change
  useEffect(() => {
    setCurrentImageIndex(0);
    setInitialPosition(null);
  }, [images]);

  return {
    currentImageIndex,
    currentImage: images[currentImageIndex] || images[0] || "",
    elementRef,
  };
}
