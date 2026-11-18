
import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://saudi-afaq-company.vercel.app"),

  title:
    "SAUDI AFAQ Company | General Contracting & Construction in Saudi Arabia",

  description:
    "SAUDI AFAQ is a general contracting company in Saudi Arabia, offering building construction, landscaping, stonework and professional construction services.",

  keywords: [
    "SAUDI AFAQ",
    "General Contracting Company in Saudi Arabia",
    "Construction Company Saudi Arabia",
    "Building Construction Services",
    "Landscaping Services Saudi Arabia",
    "Stone Work Services",
    "شركة آفاق السعودية للمقاولات",
    "شركة مقاولات عامة في السعودية",
    "خدمات البناء والتشييد",
  ],

  verification: {
    google: "rtodlz94CZn0IbwKXp5Gq_VPtUpwhAhqi6f9iNCQAq8",
  },

  openGraph: {
    title: "SAUDI AFAQ Company | Building New Horizons",
    description:
      "Professional general contracting, building construction, landscaping and stonework services in Saudi Arabia.",
    url: "https://saudi-afaq-company.vercel.app",
    siteName: "SAUDI AFAQ COMPANY",
    locale: "en_US",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
