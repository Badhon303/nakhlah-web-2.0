/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.nakhlah.net",
        pathname: "/api/general-media/**",
      },
    ],
  },
};

export default nextConfig;
