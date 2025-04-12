import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WhatsApp Receipt Cleaner - Extract Payment Messages",
  description: "Clean tool for freelancers and small businesses to extract payment-related messages from WhatsApp chats. Export to PDF or CSV.",
  keywords: ["whatsapp", "payment tracking", "receipt extractor", "freelance tools", "business tools", "chat export", "payment records"],
  authors: [{ name: "WhatsApp Receipt Cleaner" }],
  openGraph: {
    title: "WhatsApp Receipt Cleaner",
    description: "Extract payment messages from WhatsApp chats easily",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
