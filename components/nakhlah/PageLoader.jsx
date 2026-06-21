"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const CAMEL_SRC = "/animations/Camel.json";

const MESSAGES = [
  "Getting your journey ready...",
  "Loading your lessons...",
  "Preparing your progress...",
  "Almost there...",
  "Fetching your quests...",
];

/**
 * Lightweight CSS-only camel placeholder shown instantly before WASM loads.
 * No canvas, no WASM, no heavy deps — just a pulsing violet drop shape.
 */
function CamelPlaceholder() {
  return (
    <div
      style={{ width: 220, height: 220 }}
      className="flex items-center justify-center"
    >
      <motion.div
        className="rounded-full bg-accent/20 flex items-center justify-center"
        style={{ width: 140, height: 140 }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
      >
        <motion.div
          className="rounded-full bg-accent/40"
          style={{ width: 80, height: 80 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1.6,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />
      </motion.div>
    </div>
  );
}

/**
 * PageLoader
 *
 * Shows a CSS placeholder immediately on mount (zero WASM cost),
 * then swaps to the Camel Lottie animation after hydration settles.
 * Fades out smoothly when isLoading becomes false.
 *
 * Usage:
 *   <PageLoader />
 *   <PageLoader isLoading={bool} />
 *   <PageLoader isLoading={bool} message="Custom..." onDone={() => ...} />
 *
 * Props:
 *   isLoading  {boolean}   default true
 *   message    {string}    optional fixed message (overrides cycling)
 *   onDone     {function}  called after exit animation completes
 */
export function PageLoader({ isLoading = true, message, onDone }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [lottieReady, setLottieReady] = useState(false);

  useEffect(() => {
    if (!isLoading) return;
    let raf1, raf2;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setTimeout(() => setLottieReady(true), 300);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) return;
    const msgTimer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(msgTimer);
  }, [isLoading]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {isLoading && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
        >
          {/* Mascot: CSS placeholder first, Lottie after hydration */}
          <div style={{ width: 220, height: 220 }}>
            <AnimatePresence mode="wait">
              {lottieReady ? (
                <motion.div
                  key="lottie"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <DotLottieReact
                    src={CAMEL_SRC}
                    loop
                    autoplay
                    style={{ width: 220, height: 220 }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CamelPlaceholder />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* App name */}
          <motion.p
            className="mt-2 text-2xl font-extrabold tracking-wide text-accent"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Nakhlah
          </motion.p>

          {/* Cycling message */}
          <div className="mt-3 h-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={message ?? msgIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-muted-foreground text-center"
              >
                {message ?? MESSAGES[msgIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Animated dots */}
          <div className="mt-5 flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 rounded-full bg-accent/60"
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
