import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist",
  subsets: ["latin"],
});

const metaDescription = "Talk to responsive AI voice agents in your browser";

export const metadata: Metadata = {
  title: "AI Voice Agents",
  description: metaDescription,
  openGraph: {
    title: "AI Voice Agents",
    description: metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Voice Agents",
    description: metaDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
