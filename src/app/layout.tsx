import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { VisualEditsMessenger } from "orchids-visual-edits";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0f",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://notexia.com"),
  title: {
    default: "Notexia - Student Collaboration Platform | Share Notes, Solve Doubts, Learn Together",
    template: "%s | Notexia",
  },
  description: "Notexia is the ultimate student platform to share notes, ask doubts with AI-powered hints, join study forums, and write educational blogs. Join 10,000+ students learning smarter.",
  keywords: [
    "student notes",
    "study materials",
    "doubt solving",
    "AI learning",
    "student forums",
    "educational platform",
    "share notes",
    "study groups",
    "online learning",
    "peer learning",
    "academic collaboration",
    "student community",
    "free study resources",
    "homework help",
    "exam preparation",
  ],
  authors: [{ name: "Notexia Team" }],
  creator: "Notexia",
  publisher: "Notexia",
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
    locale: "en_US",
    url: "https://notexia.com",
    siteName: "Notexia",
    title: "Notexia - Student Collaboration Platform | Learn Smarter, Grow Faster",
    description: "The ultimate student platform to share notes, ask doubts with AI-powered hints, join study forums, and connect with 10,000+ students.",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "Notexia - Student Collaboration Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Notexia - Student Collaboration Platform",
    description: "Share notes, solve doubts with AI hints, join forums. The ultimate platform for students.",
    images: ["/image.png"],
    creator: "@notexia",
  },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "any" },
      { url: "/logo.png", type: "image/png", sizes: "32x32" },
      { url: "/logo.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/logo.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://notexia.com",
  },
  category: "education",
  classification: "Educational Platform",
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Notexia",
              url: "https://notexia.com",
              description: "The ultimate student platform to share notes, ask doubts with AI-powered hints, join study forums, and write educational blogs.",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "10000",
              },
              featureList: [
                "Share and download study notes",
                "AI-powered doubt solving",
                "Student forums and discussions",
                "Educational blog platform",
                "Leaderboard and gamification",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
