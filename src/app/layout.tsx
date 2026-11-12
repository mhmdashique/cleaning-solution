import type { Metadata } from "next";
import "./globals.css";
import { NavbarShell, FooterShell } from "@/components/layout/ClientShell";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";
import { getApprovedReviews, getServices } from "@/lib/data/store";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://plancsolutions.in"
  ),
  title: {
    default:
      "Professional Cleaning & Pest Control Services in Thiruvananthapuram | PLAN C",
    template: "%s | PLAN C",
  },
  description:
    "PLAN C Cleaning Solutions is Kerala's trusted cleaning & pest control company based in Thrikannapuram, Thiruvananthapuram. 5+ years of experience in full house deep cleaning, water tank cleaning, sofa shampooing & termite control. Call 7994342372.",
  keywords: [
    "cleaning services in Thiruvananthapuram",
    "pest control in Trivandrum",
    "deep cleaning Kerala",
    "sofa cleaning Thrikannapuram",
    "water tank cleaning Trivandrum",
    "anti termite treatment Kerala",
    "house cleaning Kazhakkoottam",
    "office cleaning Technopark",
    "kitchen deep cleaning Kowdiar",
    "PLAN C Cleaning Solutions",
  ],
  authors: [{ name: "PLAN C Cleaning Solutions" }],
  creator: "PLAN C Cleaning Solutions",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://plancsolutions.in",
    siteName: "PLAN C Cleaning Solutions",
    title: "PLAN C Cleaning Solutions | You leave it, we clean it",
    description:
      "Premier cleaning and pest control services in Thiruvananthapuram, Kerala. Top-rated deep cleaning, water tank sanitisation, and odorless pest treatments.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "PLAN C Professional Cleaning Solutions Kerala",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PLAN C Cleaning Solutions | Professional Cleaning in Kerala",
    description:
      "Professional cleaning & pest control in Thiruvananthapuram. 5+ years experience. Call 7994342372.",
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    ],
  },
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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured-data rating is derived from real approved reviews only.
  const [approvedReviews, services] = await Promise.all([
    getApprovedReviews().catch(() => []),
    getServices().catch(() => []),
  ]);
  const aggregateRating =
    approvedReviews.length > 0
      ? {
          ratingValue: (
            approvedReviews.reduce((sum, review) => sum + review.rating, 0) /
            approvedReviews.length
          ).toFixed(1),
          reviewCount: approvedReviews.length,
        }
      : undefined;

  const footerServices = services.map((service) => ({
    title: service.title,
    slug: service.slug,
  }));

  return (
    <html lang="en">
      <head>
        {/* Plus Jakarta Sans — loaded from CDN at runtime (avoids build-time network requirement) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 antialiased selection:bg-brand-100 selection:text-brand-900">
        <LocalBusinessJsonLd aggregateRating={aggregateRating} />
        <NavbarShell />
        <main className="flex-1 flex flex-col min-h-0">{children}</main>
        <FooterShell services={footerServices} />
      </body>
    </html>
  );
}
