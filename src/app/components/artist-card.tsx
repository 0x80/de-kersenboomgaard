"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useScrollBasedImages } from "~/hooks/use-scroll-based-images";
import type { Artist } from "~/types";

function formatWebsiteDisplay(link: string): string {
  return link.replace(/^https?:\/\//, "").replace(/^www\./, "");
}

export function ArtistCard({ artist }: { artist: Artist }) {
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const images =
    artist.all_images.length > 0
      ? artist.all_images
      : [artist.image, artist.flip_image].filter(Boolean);

  const { currentImage, currentImageIndex } = useScrollBasedImages({
    images,
    enabled: images.length > 1,
  });

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  /** Focus the carousel when dialog opens for keyboard navigation */
  const handleDialogOpen = useCallback((open: boolean) => {
    if (open) {
      /** Small delay to ensure the carousel is mounted */
      setTimeout(() => {
        carouselRef.current?.focus();
      }, 0);
    }
  }, []);

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
        {images.length > 1 ? (
          <Dialog onOpenChange={handleDialogOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="relative h-[120px] w-[120px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
                aria-label={`View all images of ${artist.name}`}
              >
                {images.map((image, index) => (
                  <Image
                    key={image}
                    src={image}
                    alt={artist.name}
                    width={120}
                    height={120}
                    className={`absolute inset-0 h-[120px] w-[120px] border-4 border-white object-cover shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-opacity duration-300 ${
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </button>
            </DialogTrigger>
            <DialogContent className="h-[100dvh] w-screen max-w-none border-none bg-transparent p-0 shadow-none sm:h-auto sm:w-[90vw] sm:max-w-4xl sm:p-4 [&>button]:absolute [&>button]:top-4 [&>button]:right-4 [&>button]:z-50 [&>button]:text-white [&>button]:drop-shadow-md">
              <DialogTitle className="sr-only">
                {artist.name} Gallery
              </DialogTitle>
              <div className="flex h-full w-full items-center justify-center px-12 sm:px-16">
                <Carousel
                  ref={carouselRef}
                  className="w-full outline-none"
                  opts={{ startIndex: currentImageIndex, loop: true }}
                  tabIndex={0}
                >
                  <CarouselContent>
                    {images.map((image, index) => (
                      <CarouselItem key={image}>
                        <div className="relative h-[80vh] w-full sm:h-[70vh] sm:max-h-[600px]">
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
                  <CarouselPrevious className="-left-10 border-none bg-white/90 shadow-md hover:bg-white sm:-left-12" />
                  <CarouselNext className="-right-10 border-none bg-white/90 shadow-md hover:bg-white sm:-right-12" />
                </Carousel>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Image
            src={currentImage || "/placeholder.svg"}
            alt={artist.name}
            width={120}
            height={120}
            className="h-[120px] w-[120px] border-4 border-white object-cover shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
          />
        )}
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
