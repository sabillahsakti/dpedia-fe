import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/layout/QueryProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DPedia",
  description: "Streaming drama pendek dalam satu aplikasi.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={inter.variable}>
      <body>
        <QueryProvider>
          {children}
          <Toaster richColors position="top-center" theme="dark" />
        </QueryProvider>
      </body>
    </html>
  );
}
