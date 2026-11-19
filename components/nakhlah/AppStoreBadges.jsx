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
import { X } from "lucide-react";

// The iOS App Store link will be added once the listing is available.
const ANDROID_STORE_LINK =
  "https://play.google.com/store/apps/details?id=com.fintechhub.nakhlah";

export function AppStoreBadges({ className = "" }) {
  const [activeTab, setActiveTab] = useState("android");
  const [qrCodeDataUrls, setQrCodeDataUrls] = useState({
    android: "",
  });
  const [open, setOpen] = useState(false);
  const [iosNoticeOpen, setIosNoticeOpen] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(ANDROID_STORE_LINK, {
      margin: 1,
      width: 320,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then((androidUrl) => setQrCodeDataUrls({ android: androidUrl }))
      .catch((err) => console.error("QR Code Error:", err));
  }, []);

  const currentQr = activeTab === "android" ? qrCodeDataUrls.android : "";

  return (
    <div
      className={`flex flex-col items-center gap-3 w-full max-w-sm ${className}`}
    >
      {/* Store Navigation Buttons */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {/* Apple App Store: show a launch note until the iOS listing is ready. */}
        <button
          type="button"
          onClick={() => setIosNoticeOpen(true)}
          className="flex min-w-0 cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5 text-left shadow-sm transition-all duration-150 hover:bg-muted/40 hover:shadow active:scale-95"
        >
          <AppleStoreIcon className="w-6 h-6 shrink-0" />
          <div className="flex flex-col text-left leading-tight min-w-0">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground whitespace-nowrap">
              Coming soon
            </span>
            <span className="text-sm font-bold text-foreground tracking-tight whitespace-nowrap">
              App Store
            </span>
          </div>
        </button>

        {/* Google Play Store */}
        <a
          href={ANDROID_STORE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm transition-all duration-150 hover:bg-muted/40 hover:shadow active:scale-95"
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
        onClick={() => {
          setActiveTab("android");
          setOpen(true);
        }}
        className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-1 cursor-pointer"
      >
        <QrScanIcon className="w-4 h-4 text-accent shrink-0" />
        <span>Scan QR code to download</span>
      </button>

      {/* Smart QR Scanner Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md bg-card border-border rounded-3xl p-6 sm:p-8 shadow-2xl [&>button]:hidden">
          <DialogHeader className="text-center sm:text-center space-y-2 relative">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-0 top-0 rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <DialogTitle className="text-2xl font-bold text-foreground">
              Download Nakhlah App
            </DialogTitle>
            <DialogDescription className="mx-auto max-w-xs text-sm text-muted-foreground">
              {activeTab === "android"
                ? "Scan this QR code with your phone camera to download directly to your device."
                : "Nakhlah for iOS is on its way. We’re putting the finishing touches on your iPhone experience."}
            </DialogDescription>
          </DialogHeader>

          {/* QR Code Presentation */}
          <div className="my-2 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "ios" ? (
                  <div className="flex min-h-64 w-full max-w-64 flex-col items-center justify-center rounded-2xl border border-accent/15 bg-accent/[0.04] px-6 text-center">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent">
                      <AppleStoreIcon className="h-7 w-7" />
                    </span>
                    <p className="mt-4 text-lg font-bold text-foreground">
                      A little more time for iOS
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      We’ll be ready to welcome you to Nakhlah on iPhone soon.
                    </p>
                    <p className="mt-4 text-lg font-bold text-accent">
                      Launching soon
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
                    {currentQr ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={currentQr}
                        alt="Download Nakhlah for Android"
                        className="h-52 w-52 rounded-lg"
                      />
                    ) : (
                      <div className="flex h-52 w-52 items-center justify-center text-sm text-muted-foreground">
                        Generating QR code...
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Platform switcher */}
            <div className="mt-5 flex items-center gap-3 rounded-full border border-border/50 bg-muted/40 px-4 py-2 text-xs">
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
                className={`order-3 flex items-center gap-1.5 px-2 py-0.5 transition-colors duration-200 cursor-pointer ${
                  activeTab === "ios"
                    ? "text-accent font-bold"
                    : "text-muted-foreground hover:text-foreground font-medium"
                }`}
              >
                <AppleStoreIcon className="w-4 h-4 shrink-0" />
                <span>iOS</span>
              </motion.button>

              <span className="order-2 text-muted-foreground/30">•</span>

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
                className={`order-1 flex items-center gap-1.5 px-2 py-0.5 transition-colors duration-200 cursor-pointer ${
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

      <Dialog open={iosNoticeOpen} onOpenChange={setIosNoticeOpen}>
        <DialogContent className="w-[calc(100%-2rem)] rounded-3xl border-border bg-card p-6 shadow-2xl sm:max-w-sm sm:p-8">
          <DialogHeader className="space-y-3 text-center sm:text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent">
              <AppleStoreIcon className="h-7 w-7" />
            </span>
            <DialogTitle className="text-xl font-bold text-foreground">
              Nakhlah for iOS is on its way
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 text-muted-foreground">
              We’re putting the finishing touches on your iPhone experience.
              The App Store link will be ready here soon.
            </DialogDescription>
          </DialogHeader>
          <p className="text-center text-lg font-bold text-accent">
            Launching soon
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
