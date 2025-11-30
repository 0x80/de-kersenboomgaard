"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Artist } from "~/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "~/components/ui/carousel";

function formatWebsiteDisplay(link: string): string {
  return link.replace(/^https?:\/\//, "").replace(/^www\./, "");
}

export function ArtistCard({ artist }: { artist: Artist }) {
  const [isHovered, setIsHovered] = useState(false);

  const images =
    artist.all_images.length > 0
      ? artist.all_images
      : [artist.image, artist.flip_image].filter(Boolean);

  const currentImage = images[0] || "";

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
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
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="relative h-[120px] w-[120px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
            >
              <Image
                src={currentImage || "/placeholder.svg"}
                alt={artist.name}
                width={120}
                height={120}
                className="h-[120px] w-[120px] border-4 border-white object-cover shadow-lg transition-transform hover:scale-105"
              />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none sm:max-w-4xl [&>button]:text-white [&>button]:hover:text-gray-300">
            <DialogTitle className="sr-only">{artist.name} Gallery</DialogTitle>
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem
                    key={index}
                    className="flex items-center justify-center"
                  >
                    <div className="relative aspect-square h-[50vh] w-full max-w-[80vw] sm:h-[70vh]">
                      <Image
                        src={image}
                        alt={`${artist.name} - Image ${index + 1}`}
                        fill
                        className="object-contain"
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2 border-none bg-white/80 hover:bg-white sm:left-4" />
                  <CarouselNext className="right-2 border-none bg-white/80 hover:bg-white sm:right-4" />
                </>
              )}
            </Carousel>
          </DialogContent>
        </Dialog>
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
