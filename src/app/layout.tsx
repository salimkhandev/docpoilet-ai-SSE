import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { AIProvider } from "../contexts/AIStateContext";
import { AuthProvider } from "../contexts/AuthContext";
import "./globals.css";
const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DocPilot AI",
  description: "AI-powered document builder with GrapesJS and PDF export",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <AuthProvider>
        <AIProvider>
          {children}
        </AIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
