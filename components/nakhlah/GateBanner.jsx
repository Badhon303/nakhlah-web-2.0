"use client";

import Image from "next/image";
import { useGateImage } from "@/stores/useCharacterVideoStore";
import { useState } from "react";

/**
 * GateBanner - Gate banner with prefetched blob URL for instant rendering.
 * SVG intrinsic size: 2528×1696 (ratio ≈ 3:2)
 */
export function GateBanner({ title, className = "" }) {
  const gateSrc = useGateImage();
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative mx-auto w-[200px] md:w-[280px] ${className}`}>
      {/* Skeleton placeholder shown until SVG decodes */}
      {!loaded && (
        <div className="w-full aspect-[3/2] rounded-lg bg-muted/60 animate-pulse" />
      )}

      {/* Gate image — width/height reflect SVG intrinsic ratio */}
      <Image
        src={gateSrc}
        alt="Gate"
        width={1264}
        height={848}
        className={`w-full h-auto block transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        priority
        unoptimized
        onLoad={() => setLoaded(true)}
      />

      {/* Text positioned on banner fabric */}
      <div className="absolute top-[32%] left-[20%] right-[20%] flex items-center justify-center">
        <span className="text-white font-bold text-sm md:text-base drop-shadow-md text-center leading-tight">
          {title}
        </span>
      </div>
    </div>
  );
}
