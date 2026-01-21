/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: "export", // Mandatory for Capacitor
  images: {
    unoptimized: true, // Required because Next.js Image Optimization needs a server
  },
}

export default nextConfig
