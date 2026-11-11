import Image from "next/image";

export function GooglePlayIcon({ className = "w-6 h-6", size = 26, ...props }) {
  return (
    <Image
      src="/icons/google-play-icon.svg"
      alt="Google Play"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      {...props}
    />
  );
}
