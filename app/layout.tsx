import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";

const inter = Inter({
  variable: "--font-sans",
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
        className={`${inter.variable} h-full antialiased`}
      >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 selection:bg-blue-100 selection:text-blue-900">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
