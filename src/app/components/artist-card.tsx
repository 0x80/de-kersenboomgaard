"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Artist } from "~/types";

function formatWebsiteDisplay(link: string): string {
  return link.replace(/^https?:\/\//, "").replace(/^www\./, "");
}

export function ArtistCard({ artist }: { artist: Artist }) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images =
    artist.all_images.length > 0
      ? artist.all_images
      : [artist.image, artist.flip_image].filter(Boolean);

  const currentImage = images[currentImageIndex] || images[0] || "";

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
    setCurrentImageIndex(0); // Reset to first image on leave
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (images.length <= 1) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    // Calculate index based on mouse position
    // 0 to width maps to 0 to images.length - 1
    const percentage = Math.max(0, Math.min(1, x / width));
    const index = Math.floor(percentage * images.length);
    const clampedIndex = Math.max(0, Math.min(images.length - 1, index));

    setCurrentImageIndex(clampedIndex);
  };

  return (
    <div
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
        <div
          className="relative h-[120px] w-[120px] cursor-pointer"
          onMouseMove={handleMouseMove}
        >
          {/* Front Image */}
          <Image
            src={frontImage || "/placeholder.svg"}
            alt={artist.name}
            width={120}
            height={120}
            className={`absolute inset-0 h-[120px] w-[120px] border-4 border-white object-cover shadow-lg transition-opacity duration-500 ease-in-out ${
              showFront ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Back Image */}
          <Image
            src={backImage || "/placeholder.svg"}
            alt={artist.name}
            width={120}
            height={120}
            className={`absolute inset-0 h-[120px] w-[120px] border-4 border-white object-cover shadow-lg transition-opacity duration-500 ease-in-out ${
              showFront ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
      </div>
      <div className="relative z-10 min-w-0 flex-1">
        <h3 className="mb-1 text-xl font-medium text-gray-900">
          {artist.name}
        </h3>
        {artist.profession && (
          <p className="text-m mb-2 leading-relaxed text-gray-600">
            {artist.profession}
          </p>
        )}
        {artist.link && (
          <Link
            href={artist.link}
            className={`text-md text-gray-400 transition-colors hover:text-gray-600 ${
              isHovered ? "border-b border-gray-400" : ""
            }`}
          >
            {formatWebsiteDisplay(artist.link)}
          </Link>
        )}
      </div>
    </div>
  );
}
