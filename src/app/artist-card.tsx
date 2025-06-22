"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { type Artist } from "./page";

function formatWebsiteDisplay(website: string): string {
  return website.replace(/^www\./, "");
}

export function ArtistCard({ artist }: { artist: Artist }) {
  const [currentImage, setCurrentImage] = useState(
    artist.flip_image || artist.image,
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (artist.image) {
      setCurrentImage(artist.image);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setCurrentImage(artist.flip_image || artist.image);
    setIsHovered(false);
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
          className="absolute -top-24 right-0 w-28 origin-bottom-left rotate-90 text-left text-8xl font-bold text-gray-200"
          style={{
            fontFamily:
              'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}
        >
          {artist.house_number}
        </div>
      )}
      <div className="relative z-10 flex-shrink-0">
        <Image
          src={currentImage || "/placeholder.svg"}
          alt={artist.name}
          width={120}
          height={120}
          className="h-[120px] w-[120px] rounded-full border-4 border-white object-cover shadow-lg"
        />
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
            href={`https://${artist.website}`}
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
