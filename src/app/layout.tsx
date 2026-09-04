import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AudienceModeProvider } from "@/components/audience-mode/context";
import { ThemeProvider, themeInitScript } from "@/components/theme/theme-provider";
import Script from "next/script";
import { TerminalProvider } from "@/components/terminal/context";
import { Terminal } from "@/components/terminal/terminal";
import { TerminalTriggers } from "@/components/terminal/terminal-triggers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://abhishekkokadwar.com";

const title = "Abhishek Kokadwar — Software Engineer";
const description =
  "Building AI systems, backend infrastructure, and security tooling. B.Tech IT + MBA student at IIITM Gwalior.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s — Abhishek Kokadwar",
  },
  description,
  keywords: [
    "Abhishek Kokadwar",
    "Software Engineer",
    "AI systems",
    "backend",
    "security",
    "IIITM Gwalior",
  ],
  authors: [{ name: "Abhishek Kokadwar" }],
  creator: "Abhishek Kokadwar",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Abhishek Kokadwar",
    title,
    description,
    // opengraph-image.tsx is picked up automatically by Next.
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <AudienceModeProvider>
            <TerminalProvider>
              {children}
              <Terminal />
              <TerminalTriggers />
            </TerminalProvider>
          </AudienceModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
