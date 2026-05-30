import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { m } from "@/lib/i18n/uk";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: m.meta.title,
  description: m.meta.description,
  icons: {
    icon: [{ url: "/icon", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={200}>
          <div className="relative flex min-h-screen flex-col">
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.93_0.02_264)_0%,transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,oklch(0.22_0.02_264)_0%,transparent_55%)]"
            />
            <main className="relative flex flex-1 flex-col">{children}</main>
          </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
