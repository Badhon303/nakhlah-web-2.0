"use client";

import Image from "next/image";
import { useGateImage } from "@/stores/useCharacterVideoStore";

/**
 * GateBanner - Gate banner with prefetched blob URL for instant rendering.
 * SVG intrinsic size: 2528×1696 (ratio ≈ 3:2)
 */
export function GateBanner({ title, className = "" }) {
  const gateSrc = useGateImage();

  return (
    <div className={`relative mx-auto w-[200px] md:w-[280px] ${className}`}>
      {/* Gate image — width/height reflect SVG intrinsic ratio */}
      <Image
        src={gateSrc}
        alt="Gate"
        width={2528}
        height={1696}
        className="w-full h-auto block"
        priority
        unoptimized
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
