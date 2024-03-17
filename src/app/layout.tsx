import { auth as nextAuth } from "@/auth";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hello! Picboard",
  description: "Japanese Idols Picture Board",
};

export default async function RootLayout({
  children,
  auth,
}: {
  children: React.ReactNode;
  auth: React.ReactNode;
}) {
  const session = await nextAuth();
  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(inter.className, "bg-background")}>
          <ThemeProvider attribute="class" disableTransitionOnChange>
            <TooltipProvider>
              <Toaster closeButton richColors position="top-center" />
              {children}
              {auth}
            </TooltipProvider>
          </ThemeProvider>
        </body>
        <Script
          defer
          src="https://analytics.hellopicboard.com/script.js"
          data-website-id="a5ad84f5-8421-491c-9f78-9c16110d3a20"
        />
      </html>
    </SessionProvider>
  );
}
