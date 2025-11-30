"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseScrollBasedImagesProps {
  images: string[];
  enabled?: boolean;
}

export function useScrollBasedImages({
  images,
  enabled = true,
}: UseScrollBasedImagesProps) {
  /** Create a stable key from images array for dependency tracking */
  const imagesKey = useMemo(() => images.join(","), [images]);

  const [state, setState] = useState(() => ({
    currentImageIndex: 0,
    imagesKey,
  }));

  const initialPositionRef = useRef<number | null>(null);
  const lastImagesKeyRef = useRef(imagesKey);
  const elementRef = useRef<HTMLDivElement>(null);

  /** Reset when images change by checking key mismatch */
  const currentImageIndex =
    state.imagesKey === imagesKey ? state.currentImageIndex : 0;

  const setCurrentImageIndex = useCallback(
    (index: number) => {
      setState({ currentImageIndex: index, imagesKey });
    },
    [imagesKey],
  );

  const handleScroll = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    /** Reset initial position when images change */
    if (lastImagesKeyRef.current !== imagesKey) {
      lastImagesKeyRef.current = imagesKey;
      initialPositionRef.current = null;
    }

    const rect = element.getBoundingClientRect();
    const avatarCenter = rect.top + rect.height / 2;
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;

    /** Store initial position when element first becomes visible */
    if (initialPositionRef.current === null && avatarCenter < viewportHeight) {
      initialPositionRef.current = avatarCenter;
      return;
    }

    /** Only calculate if we have an initial position */
    if (initialPositionRef.current === null) return;

    const initialPosition = initialPositionRef.current;

    /** Determine travel distance based on initial position */
    let travelDistance: number;

    if (initialPosition <= viewportHeight) {
      /** Artist was initially visible - travel from initial position to top */
      travelDistance = Math.max(initialPosition, 100);
    } else {
      /** Artist was initially outside viewport - travel from initial position to viewport center */
      travelDistance = initialPosition - viewportCenter;
    }

    /** Calculate current progress (0 = at initial position, 1 = at target position) */
    const scrollProgress = Math.max(
      0,
      Math.min(1, (initialPosition - avatarCenter) / travelDistance),
    );

    /** Map progress to image index */
    const imageIndex = Math.floor(scrollProgress * images.length);
    const clampedIndex = Math.max(0, Math.min(images.length - 1, imageIndex));

    setCurrentImageIndex(clampedIndex);
  }, [images.length, imagesKey, setCurrentImageIndex]);

  useEffect(() => {
    if (!enabled || images.length <= 1) {
      return;
    }

    /** Initial check */
    handleScroll();

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
    elementRef,
  };
}
