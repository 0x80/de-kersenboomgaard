import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "~/components/navigation";
import "./globals.css";
import { getSEOData } from "./helpers/get-seo-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSEOData();

  return {
    metadataBase: new URL("https://dekersenboomgaard.nl"),
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords.join(", "),
    authors: [{ name: "De Kersenboomgaard" }],
    creator: "De Kersenboomgaard",
    publisher: "De Kersenboomgaard",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "nl_NL",
      url: "https://dekersenboomgaard.nl",
      siteName: "De Kersenboomgaard",
      title: seoData.title,
      description: seoData.description,
      images: [
        {
          url: "/assets/artists/max-kisman/image1.jpg",
          width: 1200,
          height: 630,
          alt: "De Kersenboomgaard - Kunstenaars & Ateliers Utrecht",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoData.title,
      description: seoData.description,
      images: ["/assets/artists/max-kisman/image1.jpg"],
    },
    alternates: {
      canonical: "https://dekersenboomgaard.nl",
    },
    other: {
      "geo.region": "NL-UT",
      "geo.placename": "Utrecht",
      "geo.position": "52.1015;5.0570",
      ICBM: "52.1015, 5.0570",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        {children}
      </body>
      <Analytics />
    </html>
  );
}
