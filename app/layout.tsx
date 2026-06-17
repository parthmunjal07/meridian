import type { Metadata } from "next";
import { Inter, Syne_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const syneMono = Syne_Mono({
  weight: "400",
  variable: "--font-syne-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meridian",
  description: "The fastest email and calendar experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
        lang="en"
        className={`${inter.variable} ${syneMono.variable} h-full antialiased`}
      >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
