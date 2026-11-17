"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  "bg-accent",
  "bg-primary",
  "bg-secondary",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-red-500",
  "bg-sky-500",
];

function randomBetween(min, max, seed) {
  const value = Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1;
  return value * (max - min) + min;
}

export default function Confetti({ active }) {
  const particles = useMemo(
    () =>
      active
        ? Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            color: COLORS[Math.floor(randomBetween(0, COLORS.length, i + 1))],
            x: randomBetween(-120, 120, i + 2),
            y: randomBetween(-140, -40, i + 3),
            rotate: randomBetween(-360, 360, i + 4),
            size: randomBetween(0, 1, i + 5) > 0.5 ? "w-2 h-2" : "w-1.5 h-3",
            delay: randomBetween(0, 0.15, i + 6),
          }))
        : [],
    [active],
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.8 }}
            animate={{
              x: particle.x,
              y: [0, particle.y, particle.y + 160],
              opacity: [1, 1, 0],
              rotate: particle.rotate,
              scale: [0.8, 1, 0.6],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.6,
              delay: particle.delay,
              ease: "easeOut",
              times: [0, 0.4, 1],
            }}
            className={`absolute rounded-sm ${particle.color} ${particle.size}`}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
