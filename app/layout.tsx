import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "../components/context/UserContext";
import { GlobalContextProvider } from "@/components/context/GlobalContext";
import Providers from "./Providers";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Next Shop",
  description: "Next Shop",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans min-h-screen w-full flex flex-col bg-white dark:bg-black">
        
      <Providers>{children}</Providers>
      </body>
    </html>
  );
}
