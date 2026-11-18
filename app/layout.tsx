
import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAUDI AFAQ | General Contracting Company",
  description:
    "SAUDI AFAQ - Professional contracting and construction services in Saudi Arabia.",
  keywords: [
    "Saudi AFAQ",
    "Saudi Contracting Company",
    "Construction Saudi Arabia",
    "General Contracting",
  ],
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
