"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// 5 rotating themes - each level gets one theme in rotation
// Journey: Desert → Oasis → Coastal (transition) → Urban Twilight → Midnight City
// All assets positioned around center (50%) to align with zigzag path
const THEMES = [
  {
    id: "desert-dunes",
    name: "Desert Dunes",
    bgFrom: "#FF8C42",
    bgVia: "#F5A623",
    bgTo: "#E8853E",
    assets: {
      sun: { color: "from-amber-400 to-orange-500", size: "lg" },
      camel: { position: "center-right", size: "xl" },
      desertTent: { position: "center-area", size: "xl" },
      palmTrees: { position: "center-area-right", count: 2, size: "xl" },
      desertBirds: { position: "far-right", size: "xl" },
      dune1: { color: "#A65D29", opacity: 0.6 },
      dune2: { color: "#8B4D20", opacity: 0.8 },
    },
  },
  {
    id: "desert-oasis",
    name: "Desert Oasis",
    bgFrom: "#E8853E",
    bgVia: "#D47835",
    bgTo: "#C46830",
    assets: {
      sun: { color: "from-amber-300 to-orange-400", size: "md" },
      dallah: { position: "far-left" },
      madainSalihTombs: { position: "upper-area", size: "2xl" },
      palmTrees: { position: "middle-area", count: 3, size: "xl" },
      masmakhFortress: { position: "left-lower", size: "xl" },
      dune1: { color: "#9C5525", opacity: 0.5 },
    },
  },
  {
    id: "coastal-breeze",
    name: "Coastal Breeze",
    bgFrom: "#4A90A4",
    bgVia: "#3D7A8C",
    bgTo: "#2D5A6B",
    assets: {
      sun: { color: "from-amber-200 to-orange-300", size: "sm" },
      wave1: { color: "rgba(255,255,255,0.2)" },
      wave2: { color: "rgba(255,255,255,0.15)" },
      floatingMosque: { position: "far-left", inWaves: true },
      coral: { position: "upper-area", size: "2xl" },
      palmTrees: { position: "middle-area", count: 1, size: "xl" },
    },
  },
  {
    id: "urban-twilight",
    name: "Urban Twilight",
    bgFrom: "#2D5A6B",
    bgVia: "#1A3A4A",
    bgTo: "#0D2832",
    assets: {
      sun: { color: "from-orange-300 to-pink-400", size: "sm" },
      alFaisaliahTower: { position: "upper-left", size: "2xl" },
      kingdomCenter: { position: "mid-left", size: "2xl" },
      makkahClock: { position: "upper-area", size: "2xl" },
      moon: { color: "#E8DCC0", size: "md", crescent: true },
    },
  },
  {
    id: "midnight-city",
    name: "Midnight City",
    bgFrom: "#0D2832",
    bgVia: "#051A20",
    bgTo: "#020D12",
    assets: {
      stars: { count: 50 },
      alFaisaliahTower: { position: "upper-mid-left", size: "2xl" },
      kingdomCenter: { position: "upper-mid-right", size: "2xl" },
      makkahClock: { position: "upper-mid-area", size: "2xl" },
      moon: { color: "from-slate-100 to-slate-300", size: "lg" },
    },
  },
];

// Assign theme to each level based on rotation
const getLevelTheme = (levelIndex) => THEMES[levelIndex % THEMES.length];

export function UnitBasedBackground({ children, levels = [], className = "" }) {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const [activeLevelIndex, setActiveLevelIndex] = useState(0);

  // Get current theme based on active level
  const currentTheme = useMemo(() => {
    return getLevelTheme(activeLevelIndex);
  }, [activeLevelIndex]);

  // Use IntersectionObserver to track which level is currently in viewport
  useEffect(() => {
    if (typeof window === "undefined" || !levels.length) return;

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const levelId = entry.target.getAttribute("data-level-id");
          const levelIndex = levels.findIndex(
            (l) => l.id.toString() === levelId,
          );
          if (levelIndex !== -1) {
            setActiveLevelIndex(levelIndex);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    });

    // Observe all level elements
    const levelElements = document.querySelectorAll("[data-level-id]");
    levelElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [levels]);

  // Smooth background transition when theme changes
  useEffect(() => {
    if (!bgRef.current) return;

    gsap.to(bgRef.current, {
      background: `linear-gradient(to bottom, ${currentTheme.bgFrom} 0%, ${currentTheme.bgVia} 50%, ${currentTheme.bgTo} 100%)`,
      duration: 1.2,
      ease: "power2.inOut",
    });
  }, [currentTheme]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Animated background layer with smooth transition */}
      <div
        ref={bgRef}
        className="fixed inset-0 -z-20 w-full h-full"
        style={{
          background: `linear-gradient(to bottom, ${currentTheme.bgFrom} 0%, ${currentTheme.bgVia} 50%, ${currentTheme.bgTo} 100%)`,
        }}
      />

      {/* Per-level assets with AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">
        <UnitAssets key={currentTheme.id} theme={currentTheme} />
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Render assets for each unit
function UnitAssets({ theme }) {
  const { assets } = theme;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
    >
      {/* Sun/Moon */}
      {assets.sun && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={`absolute top-16 right-16 w-24 h-24 rounded-full bg-gradient-to-br ${assets.sun.color} shadow-2xl`}
          style={{ filter: "blur(1px)" }}
        />
      )}

      {assets.moon && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={`absolute top-16 right-16 w-20 h-20 ${
            assets.moon.crescent
              ? "bg-transparent"
              : `rounded-full bg-gradient-to-br ${assets.moon.color} shadow-xl`
          }`}
          style={
            assets.moon.crescent
              ? {
                  filter: "drop-shadow(0 0 6px rgba(232, 220, 192, 0.4))",
                }
              : undefined
          }
        >
          {assets.moon.crescent && (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d="M50 10 A40 40 0 1 1 50 90 A30 30 0 1 0 50 10 Z"
                fill={assets.moon.color}
              />
            </svg>
          )}
        </motion.div>
      )}

      {/* Dunes - Full width */}
      {assets.dune1 && (
        <svg
          className="absolute bottom-0 left-0 w-full h-48"
          viewBox="0 0 1920 160"
          preserveAspectRatio="none"
        >
          <path
            fill={assets.dune1.color}
            opacity={assets.dune1.opacity}
            d="M-100,160 L-100,80 C200,20 500,120 800,60 C1100,0 1400,100 1700,40 C1900,10 2020,80 2100,100 L2100,160 Z"
          />
        </svg>
      )}

      {assets.dune2 && (
        <svg
          className="absolute bottom-0 left-0 w-full h-40"
          viewBox="0 0 1920 128"
          preserveAspectRatio="none"
        >
          <path
            fill={assets.dune2.color}
            opacity={assets.dune2.opacity}
            d="M-100,128 L-100,64 C300,20 600,90 900,50 C1200,10 1500,80 1800,30 C1950,10 2020,60 2100,40 L2100,128 Z"
          />
        </svg>
      )}

      {/* Waves - Full width */}
      {assets.wave1 && (
        <svg
          className="absolute bottom-0 left-0 w-full h-56"
          viewBox="0 0 1920 192"
          preserveAspectRatio="none"
        >
          <path
            fill={assets.wave1.color}
            d="M-100,192 L-100,96 C300,48 600,144 900,96 C1200,48 1500,144 1800,96 C1950,72 2020,120 2100,96 L2100,192 Z"
          >
            <animate
              attributeName="d"
              dur="4s"
              repeatCount="indefinite"
              values="
                M-100,192 L-100,96 C300,48 600,144 900,96 C1200,48 1500,144 1800,96 C1950,72 2020,120 2100,96 L2100,192 Z;
                M-100,192 L-100,96 C300,144 600,48 900,96 C1200,144 1500,48 1800,96 C1950,120 2020,72 2100,96 L2100,192 Z;
                M-100,192 L-100,96 C300,48 600,144 900,96 C1200,48 1500,144 1800,96 C1950,72 2020,120 2100,96 L2100,192 Z
              "
            />
          </path>
        </svg>
      )}

      {/* Scene 1: Palm Trees - Center area right of tent, NORMAL size */}
      {assets.palmTrees &&
        assets.palmTrees.position === "center-area-right" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute left-[65%] -translate-x-1/2 bottom-16 w-40 lg:w-56 h-auto"
          >
            <img
              src="/bg-home/palm-tree-collection.png"
              alt="Palm Trees"
              className="w-full h-auto object-contain drop-shadow-lg"
            />
          </motion.div>
        )}

      {/* Scene 2: Palm Trees - Middle area, NORMAL size */}
      {assets.palmTrees && assets.palmTrees.position === "middle-area" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute left-[68%] -translate-x-1/2 bottom-20 w-44 lg:w-60 h-auto"
        >
          <img
            src="/bg-home/palm-tree-collection.png"
            alt="Palm Trees"
            className="w-full h-auto object-contain drop-shadow-lg"
          />
        </motion.div>
      )}

      {/* Desert Birds - Far right */}
      {assets.desertBirds && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.2 }}
          className={`absolute top-[15%] left-[20%] ${assets.desertBirds.size === "xl" ? "w-56 lg:w-72" : "w-24 lg:w-40"}`}
        >
          <img
            src="/bg-home/desert-birds.png"
            alt="Desert Birds"
            className="w-full h-auto drop-shadow-md"
          />
        </motion.div>
      )}

      {/* Scene 1: Desert Tent - Center area, LARGE size */}
      {assets.desertTent && assets.desertTent.position === "center-area" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute left-[28%] -translate-x-1/2 bottom-12 w-52 lg:w-80"
        >
          <img
            src="/bg-home/desert-tent.png"
            alt="Desert Tent"
            className="w-full h-auto object-contain drop-shadow-xl"
          />
        </motion.div>
      )}

      {/* Dallah - Scene 2: far left */}
      {assets.dallah && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 0.2 }}
          className={`absolute left-[72%] -translate-x-1/2 bottom-24 w-24 lg:w-32`}
        >
          <img
            src="/bg-home/dallah.png"
            alt="Arabic Coffee Pot"
            className="w-full h-auto object-contain drop-shadow-xl"
          />
        </motion.div>
      )}

      {/* Scene 3: Coral - Upper area, VERY LARGE */}
      {assets.coral && assets.coral.position === "upper-area" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.2 }}
          className="absolute left-[30%] -translate-x-1/2 top-[5%] w-80 lg:w-[30rem]"
        >
          <img
            src="/bg-home/coral.png"
            alt="Coral"
            className="w-full h-auto object-contain drop-shadow-lg"
          />
        </motion.div>
      )}

      {/* Scene 4: Urban Twilight - VERY LARGE buildings */}
      {/* {assets.alFaisaliahTower &&
        assets.alFaisaliahTower.position === "upper-left" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-[50%] left-[20%] w-72 lg:w-[22rem]"
          >
            <img
              src="/bg-home/Al-Faisaliah-Tower.png"
              alt="Al Faisaliah Tower"
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
          </motion.div>
        )} */}

      {assets.kingdomCenter && assets.kingdomCenter.position === "mid-left" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute top-[30%] left-[12%] w-72 lg:w-[22rem]"
        >
          <img
            src="/bg-home/kindom-center.png"
            alt="Kingdom Center"
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </motion.div>
      )}

      {assets.makkahClock && assets.makkahClock.position === "upper-area" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute top-[8%] left-[55%] w-72 lg:w-[24rem]"
        >
          <img
            src="/bg-home/makka-clock.png"
            alt="Makkah Royal Clock Tower"
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </motion.div>
      )}

      {/* Scene 5: Midnight City - VERY LARGE buildings */}
      {assets.alFaisaliahTower &&
        assets.alFaisaliahTower.position === "upper-mid-left" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[18%] left-[15%] w-72 lg:w-[28rem]"
          >
            <img
              src="/bg-home/Al-Faisaliah-Tower.png"
              alt="Al Faisaliah Tower"
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
          </motion.div>
        )}

      {assets.kingdomCenter &&
        assets.kingdomCenter.position === "upper-mid-right" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[12%] right-[18%] w-80 lg:w-[28rem]"
          >
            <img
              src="/bg-home/kindom-center.png"
              alt="Kingdom Center"
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
          </motion.div>
        )}

      {/* {assets.makkahClock &&
        assets.makkahClock.position === "upper-mid-area" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[22%] left-[50%] w-88 lg:w-[30rem]"
          >
            <img
              src="/bg-home/makka-clock.png"
              alt="Makkah Royal Clock Tower"
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
          </motion.div>
        )} */}

      {/* Scene 3: Floating Mosque - Left side, VERY LARGE */}
      {assets.floatingMosque && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-4 left-[22%] -translate-x-1/2 w-72 lg:w-[26rem]"
        >
          <img
            src="/bg-home/floating-mosque.png"
            alt="Floating Mosque"
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </motion.div>
      )}

      {/* Scene 2: Tombs - Upper area, VERY LARGE */}
      {assets.madainSalihTombs &&
        assets.madainSalihTombs.position === "upper-area" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute left-[30%] -translate-x-1/2 top-[5%] w-40 lg:w-64"
          >
            <img
              src="/bg-home/Madain-Salih-Tombs.png"
              alt="Madain Salih Tombs"
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
          </motion.div>
        )}

      {/* Scene 2: Masmakh Fortress - Left area, VERY LARGE */}
      {assets.masmakhFortress &&
        assets.masmakhFortress.position === "left-lower" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[55%] left-[20%] -translate-x-1/2 bottom-16 w-40 lg:w-64"
          >
            <img
              src="/bg-home/mesmakh-fortress.png"
              alt="Masmakh Fortress"
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
          </motion.div>
        )}

      {/* Stars */}
      {assets.stars && (
        <div className="absolute inset-0">
          {Array.from({ length: assets.stars.count }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 60}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* Camel Lottie - Center-right, NORMAL size */}
      {assets.camel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-12 left-[73%] -translate-x-1/2 w-48 lg:w-60 h-48 lg:h-60 opacity-90"
        >
          <DotLottieReact
            src="/animations/Camel.json"
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
