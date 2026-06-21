"use client";

/**
 * GateBanner - Uses x2.svg image with text overlay
 */
export function GateBanner({ title, className = "" }) {
  return (
    <div className={`relative mx-auto w-[200px] md:w-[280px] ${className}`}>
      {/* Gate image */}
      <img src="/x2.svg" alt="Gate" className="w-full h-auto block" />

      {/* Text positioned on banner fabric */}
      <div className="absolute top-[32%] left-[20%] right-[20%] flex items-center justify-center">
        <span className="text-white font-bold text-sm md:text-base drop-shadow-md text-center leading-tight">
          {title}
        </span>
      </div>
    </div>
  );
}
