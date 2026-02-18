import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/nakhlah/ConditionalNavbar";
import MainLayout from "@/components/MainLayout";
import { ThemeProvider } from "next-themes";
import SessionProvider from "@/components/SessionProvider";
import { CustomToaster } from "@/components/nakhlah/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
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
