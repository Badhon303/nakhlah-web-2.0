"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

// Tailwind background-color classes cycled across confetti particles so the
// decoration follows the existing design tokens instead of hardcoded hex.
const CONFETTI_TONES = [
  "bg-accent",
  "bg-palm-green",
  "bg-primary",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-sky-500",
  "bg-rose-500",
  "bg-violet-500",
];

const CONFETTI_SHAPES = ["rounded-full", "rounded-sm", "rounded-[2px]"];

function buildConfettiParticles(bursts, particlesPerBurst) {
  const list = [];
  for (let b = 0; b < bursts; b += 1) {
    const originX = 15 + Math.random() * 70;
    const originY = 12 + Math.random() * 22;
    const burstDelay = b * 0.5;
    for (let i = 0; i < particlesPerBurst; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 80;
      const shape = CONFETTI_SHAPES[i % CONFETTI_SHAPES.length];
      const isStrip = shape === "rounded-sm" && i % 2 === 0;
      list.push({
        id: `${b}-${i}`,
        originX,
        originY,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        width: isStrip ? 10 : 6 + Math.random() * 5,
        height: isStrip ? 4 : 6 + Math.random() * 5,
        rotate: Math.random() * 360,
        shape,
        tone: CONFETTI_TONES[(b + i) % CONFETTI_TONES.length],
        delay: burstDelay + Math.random() * 0.15,
      });
    }
  }
  return list;
}

/**
 * Firework/firecracker-style confetti burst used behind celebratory /
 * success moments (subscription active, payment confirmed, etc). A handful
 * of small, differently shaped and colored particles explode outward from
 * a few origin points, then settle downward and fade. Purely decorative —
 * absolutely positioned, non-interactive, and clipped to its parent, so it
 * never affects layout or existing mechanisms.
 *
 * Particle positions are randomized, so they're generated client-side only
 * (after mount) rather than during render — generating them during render
 * would produce different values on the server vs. the client and trigger
 * a hydration mismatch.
 */
export function ConfettiBurst({
  bursts = 3,
  particlesPerBurst = 14,
  className = "",
}) {
  const cycleSeconds = bursts * 0.5 + 2.2;
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setParticles(buildConfettiParticles(bursts, particlesPerBurst));
  }, [bursts, particlesPerBurst]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className={`absolute ${particle.tone} ${particle.shape}`}
          style={{
            left: `${particle.originX}%`,
            top: `${particle.originY}%`,
            width: particle.width,
            height: particle.height,
          }}
          initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.3 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: [0, particle.dx, particle.dx * 1.2],
            y: [0, particle.dy, particle.dy + 150],
            rotate: particle.rotate,
            scale: [0.3, 1, 1],
          }}
          transition={{
            duration: 1.9,
            delay: particle.delay,
            repeat: Infinity,
            repeatDelay: cycleSeconds - 1.9,
            times: [0, 0.35, 1],
            ease: ["easeOut", "easeIn"],
          }}
        />
      ))}
    </div>
  );
}

function buildDriftingLeaves(count) {
  return Array.from({ length: count }).map((_, index) => ({
    id: index,
    left: Math.random() * 100,
    size: 14 + Math.random() * 10,
    duration: 9 + Math.random() * 5,
    delay: Math.random() * 6,
    drift: (Math.random() - 0.5) * 40,
    spin: 90 + Math.random() * 180,
  }));
}

/**
 * A quieter, muted counterpart used for failed / canceled states — a few
 * slow-drifting, low-opacity leaves instead of a celebration, so the
 * screen still feels alive without clashing with the "not quite" tone.
 *
 * As with ConfettiBurst, the randomized positions are generated client-side
 * only (after mount) to avoid a server/client hydration mismatch.
 */
export function DriftingLeaves({ count = 7, className = "" }) {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    setLeaves(buildDriftingLeaves(count));
  }, [count]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {leaves.map((leaf) => (
        <motion.span
          key={leaf.id}
          className="absolute text-muted-foreground"
          style={{ left: `${leaf.left}%`, top: "-8%" }}
          initial={{ y: "-10vh", opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            x: [0, leaf.drift, 0],
            opacity: [0, 0.35, 0.35, 0],
            rotate: leaf.spin,
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Leaf style={{ width: leaf.size, height: leaf.size }} />
        </motion.span>
      ))}
    </div>
  );
}

const BADGE_TONES = {
  success: "bg-accent/15 text-accent",
  failed: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
};

/**
 * Circular glowing icon badge shown above the headline, mirroring the
 * "crown in a soft circle" treatment from the reference screenshot.
 */
export function ResultIconBadge({ icon: Icon, variant = "success" }) {
  const tone = BADGE_TONES[variant] || BADGE_TONES.neutral;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
      className="relative mx-auto mb-2 flex items-center justify-center"
    >
      {variant === "success" && (
        <span className="absolute inset-0 -m-4 rounded-full bg-accent/10 blur-xl" />
      )}
      <span
        className={`relative flex h-16 w-16 items-center justify-center rounded-full ${tone}`}
      >
        <Icon className="h-8 w-8" />
      </span>
    </motion.div>
  );
}
