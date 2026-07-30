import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/nakhlah/ConditionalNavbar";
import MainLayout from "@/components/MainLayout";
import { ThemeProvider } from "next-themes";
import SessionProvider from "@/components/SessionProvider";
import { CustomToaster } from "@/components/nakhlah/Toast";
import CapacitorInit from "@/components/CapacitorInit";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata = {
  title: "Nakhlah",
  description: "Language learning platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Rendered directly (not via the `viewport` export) so it is present
          in the static HTML at initial parse. iOS/WebKit only computes
          env(safe-area-inset-*) correctly when viewport-fit=cover is present
          at document load; Next.js streams the `viewport` export into <head>
          via client JS after hydration, which is too late for WebKit to pick
          up on the very first paint, leaving --sat/--sab at 0px on iOS.
        */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <CapacitorInit />
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConditionalNavbar />
            <MainLayout>{children}</MainLayout>
            <CustomToaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
