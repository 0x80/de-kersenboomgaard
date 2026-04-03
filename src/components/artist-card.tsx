import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollBasedImages } from "../hooks/use-scroll-based-images";
import type { Artist } from "../utils/content";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

function formatWebsiteDisplay(link: string): string {
  return link
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

function ImageSkeleton() {
  return (
    <div className="h-[120px] w-[120px] animate-pulse border-4 border-white bg-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.15)]" />
  );
}

function CarouselImageSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-full w-full max-w-[80%] animate-pulse bg-gray-800/50" />
    </div>
  );
}

function CarouselImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && <CarouselImageSkeleton />}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
      />
    </>
  );
}

export function ArtistCard({ artist }: { artist: Artist }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const images =
    artist.allImages.length > 0
      ? artist.allImages
      : [artist.image, artist.flipImage].filter(Boolean);

  const [randomOffset] = useState(() =>
    images.length > 1 ? Math.floor(Math.random() * images.length) : 0,
  );

  const { currentImage, currentImageIndex } = useScrollBasedImages({
    images,
    enabled: isMounted && images.length > 1,
    initialOffset: randomOffset,
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleDialogOpen = useCallback((open: boolean) => {
    if (open) {
      setTimeout(() => {
        carouselRef.current?.focus();
      }, 0);
    }
  }, []);

  const renderImageContent = () => {
    if (!isMounted) {
      return <ImageSkeleton />;
    }

    if (images.length > 1) {
      return (
        <Dialog onOpenChange={handleDialogOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="relative h-[120px] w-[120px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
              aria-label={`View all images of ${artist.name}`}
            >
              {images.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={artist.name}
                  width={120}
                  height={120}
                  className={`absolute inset-0 h-[120px] w-[120px] border-4 border-white object-cover shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-opacity duration-300 ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                  loading="lazy"
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
                        <CarouselImage
                          src={image}
                          alt={`${artist.name} - Image ${index + 1}`}
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
      );
    }

    return (
      <img
        src={currentImage || "/placeholder.svg"}
        alt={artist.name}
        width={120}
        height={120}
        className="h-[120px] w-[120px] border-4 border-white object-cover shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
      />
    );
  };

  return (
    <div
      id={`artist-${artist.id}`}
      className="relative flex items-start space-x-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {artist.houseNumber && (
        <div
          className="text-gray-150 absolute -top-24 right-0 w-28 origin-bottom-left rotate-90 text-left text-8xl font-bold"
          style={{
            fontFamily:
              'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}
        >
          {artist.houseNumber}
        </div>
      )}
      <div className="relative z-10 flex-shrink-0">{renderImageContent()}</div>
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
          <a
            href={artist.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-md text-gray-400 transition-colors hover:text-gray-600 ${
              isHovered ? "border-b border-gray-400" : ""
            }`}
          >
            {formatWebsiteDisplay(artist.link)}
          </a>
        )}
      </div>
    </div>
  );
}
