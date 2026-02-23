import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextGen Image Optimizer - Privacy-First Image Tools",
  description: "Resize, compress and optimize images directly in your browser. 100% Client-side, secure, and free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-mesh" />
        {children}
      </body>
    </html>
  );
}
