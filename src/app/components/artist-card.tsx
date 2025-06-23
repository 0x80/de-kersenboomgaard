"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useScrollBasedImages } from "~/hooks/use-scroll-based-images";
import type { Artist } from "~/types";

function formatWebsiteDisplay(website: string): string {
  return website.replace(/^https?:\/\//, "").replace(/^www\./, "");
}

export function ArtistCard({ artist }: { artist: Artist }) {
  const [isHovered, setIsHovered] = useState(false);

  // Use scroll-based images for all devices
  const { currentImage, elementRef } = useScrollBasedImages({
    images:
      artist.all_images.length > 0
        ? artist.all_images
        : [artist.image, artist.flip_image].filter(Boolean),
    enabled: true,
  });

  // Cross-fade state management
  const [frontImage, setFrontImage] = useState(currentImage);
  const [backImage, setBackImage] = useState(currentImage);
  const [showFront, setShowFront] = useState(true);

  // Handle cross-fade when currentImage changes
  useEffect(() => {
    if (currentImage && currentImage !== (showFront ? frontImage : backImage)) {
      if (showFront) {
        setBackImage(currentImage);
        setShowFront(false);
      } else {
        setFrontImage(currentImage);
        setShowFront(true);
      }
    }
  }, [currentImage, frontImage, backImage, showFront]);

  // Initialize images when component mounts
  useEffect(() => {
    if (currentImage) {
      setFrontImage(currentImage);
      setBackImage(currentImage);
    }
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={elementRef}
      id={`artist-${artist.id}`}
      className="relative flex items-start space-x-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {artist.house_number && (
        <div
          className="text-gray-150 absolute -top-24 right-0 w-28 origin-bottom-left rotate-90 text-left text-8xl font-bold"
          style={{
            fontFamily:
              'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}
        >
          {artist.house_number}
        </div>
      )}
      <div className="relative z-10 flex-shrink-0">
        <div className="relative h-[120px] w-[120px]">
          {/* Front Image */}
          <Image
            src={frontImage || "/placeholder.svg"}
            alt={artist.name}
            width={120}
            height={120}
            className={`absolute inset-0 h-[120px] w-[120px] rounded-full border-4 border-white object-cover shadow-lg transition-opacity duration-500 ease-in-out ${
              showFront ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Back Image */}
          <Image
            src={backImage || "/placeholder.svg"}
            alt={artist.name}
            width={120}
            height={120}
            className={`absolute inset-0 h-[120px] w-[120px] rounded-full border-4 border-white object-cover shadow-lg transition-opacity duration-500 ease-in-out ${
              showFront ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
      </div>
      <div className="relative z-10 min-w-0 flex-1">
        <h3 className="mb-1 text-xl font-medium text-gray-900">
          {artist.name}
        </h3>
        {artist.description && (
          <p className="text-m mb-2 leading-relaxed text-gray-600">
            {artist.description}
          </p>
        )}
        {artist.website && (
          <Link
            href={artist.website}
            className={`text-sm text-gray-400 transition-colors hover:text-gray-600 ${
              isHovered ? "border-b border-gray-400" : ""
            }`}
          >
            {formatWebsiteDisplay(artist.website)}
          </Link>
        )}
      </div>
    </div>
  );
}
