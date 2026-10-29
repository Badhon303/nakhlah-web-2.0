"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "qrcode";
import { AppleStoreIcon } from "@/components/icons/AppleStore";
import { GooglePlayIcon } from "@/components/icons/GooglePlay";
import { QrScanIcon } from "@/components/icons/QrScanIcon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Separate links for Android and iOS
const ANDROID_STORE_LINK =
  "https://play.google.com/store/apps/details?id=com.fintechhub.nakhlah";
const IOS_STORE_LINK =
  "https://play.google.com/store/apps/details?id=com.fintechhub.nakhlah";

export function AppStoreBadges({ className = "" }) {
  const [activeTab, setActiveTab] = useState("ios");
  const [qrCodeDataUrls, setQrCodeDataUrls] = useState({
    ios: "",
    android: "",
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      QRCode.toDataURL(IOS_STORE_LINK, {
        margin: 1,
        width: 320,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      }),
      QRCode.toDataURL(ANDROID_STORE_LINK, {
        margin: 1,
        width: 320,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      }),
    ])
      .then(([iosUrl, androidUrl]) => {
        setQrCodeDataUrls({
          ios: iosUrl,
          android: androidUrl,
        });
      })
      .catch((err) => console.error("QR Code Error:", err));
  }, []);

  const currentQr = qrCodeDataUrls[activeTab];

  return (
    <div className={`flex flex-col items-center gap-3 w-full max-w-sm ${className}`}>
      {/* Store Navigation Buttons */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {/* Apple App Store */}
        <a
          href={IOS_STORE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 shadow-sm hover:shadow transition-all duration-150 active:scale-95"
        >
          <AppleStoreIcon className="w-6 h-6 shrink-0" />
          <div className="flex flex-col text-left leading-tight min-w-0">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground whitespace-nowrap">
              Download on the
            </span>
            <span className="text-sm font-bold text-foreground tracking-tight whitespace-nowrap">
              App Store
            </span>
          </div>
        </a>

        {/* Google Play Store */}
        <a
          href={ANDROID_STORE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 shadow-sm hover:shadow transition-all duration-150 active:scale-95"
        >
          <GooglePlayIcon className="w-5 h-5 shrink-0" size={20} />
          <div className="flex flex-col text-left leading-tight min-w-0">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground whitespace-nowrap">
              GET IT ON
            </span>
            <span className="text-sm font-bold text-foreground tracking-tight whitespace-nowrap">
              Google Play
            </span>
          </div>
        </a>
      </div>

      {/* Smart QR Scanner Dialog Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-1 cursor-pointer"
      >
        <QrScanIcon className="w-4 h-4 text-accent shrink-0" />
        <span>Scan QR code to download</span>
      </button>

      {/* Smart QR Scanner Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border rounded-3xl p-6 sm:p-8 shadow-2xl">
          <DialogHeader className="text-center sm:text-center space-y-2">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Download Nakhlah App
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground max-w-xs mx-auto">
              Scan this QR code with your phone camera to download directly to your device.
            </DialogDescription>
          </DialogHeader>

          {/* QR Code Presentation */}
          <div className="flex flex-col items-center justify-center my-2">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentQr ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentQr}
                      alt={`Download Nakhlah for ${activeTab === "ios" ? "iOS" : "Android"}`}
                      className="w-52 h-52 rounded-lg"
                    />
                  ) : (
                    <div className="w-52 h-52 flex items-center justify-center text-sm text-muted-foreground">
                      Generating QR code...
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Platform switcher (reverted design: no background on buttons, text in accent color, animated font size) */}
            <div className="flex items-center gap-3 mt-5 px-4 py-2 bg-muted/40 rounded-full border border-border/50 text-xs">
              <motion.button
                type="button"
                onClick={() => setActiveTab("ios")}
                animate={{
                  scale: activeTab === "ios" ? 1.15 : 0.95,
                }}
                transition={{
                  duration: 0.3,
                  delay: 0.05,
                  ease: "easeInOut",
                }}
                className={`flex items-center gap-1.5 px-2 py-0.5 transition-colors duration-200 cursor-pointer ${
                  activeTab === "ios"
                    ? "text-accent font-bold"
                    : "text-muted-foreground hover:text-foreground font-medium"
                }`}
              >
                <AppleStoreIcon className="w-4 h-4 shrink-0" />
                <span>iOS</span>
              </motion.button>

              <span className="text-muted-foreground/30">•</span>

              <motion.button
                type="button"
                onClick={() => setActiveTab("android")}
                animate={{
                  scale: activeTab === "android" ? 1.15 : 0.95,
                }}
                transition={{
                  duration: 0.3,
                  delay: 0.05,
                  ease: "easeInOut",
                }}
                className={`flex items-center gap-1.5 px-2 py-0.5 transition-colors duration-200 cursor-pointer ${
                  activeTab === "android"
                    ? "text-accent font-bold"
                    : "text-muted-foreground hover:text-foreground font-medium"
                }`}
              >
                <GooglePlayIcon className="w-3.5 h-3.5 shrink-0" size={14} />
                <span>Android</span>
              </motion.button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
