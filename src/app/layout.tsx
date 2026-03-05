import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Voice Agents",
  description: "Talk to responsive AI voice agents in your browser",
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
