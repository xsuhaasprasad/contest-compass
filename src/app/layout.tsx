import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contest Compass",
  description: "A training dashboard for contest-math review, spaced repetition, and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
