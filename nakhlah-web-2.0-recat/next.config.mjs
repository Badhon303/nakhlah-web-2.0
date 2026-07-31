/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
    NEXT_PUBLIC_RC_ANDROID_API_KEY: process.env.NEXT_PUBLIC_RC_ANDROID_API_KEY || '',
    NEXT_PUBLIC_RC_IOS_API_KEY: process.env.NEXT_PUBLIC_RC_IOS_API_KEY || '',
    NEXT_PUBLIC_RC_WEB_API_KEY: process.env.NEXT_PUBLIC_RC_WEB_API_KEY || '',
    NEXT_PUBLIC_RC_ENTITLEMENT_ID: process.env.NEXT_PUBLIC_RC_ENTITLEMENT_ID || 'premium',
    NEXT_PUBLIC_RC_SUBSCRIPTION_OFFERING_ID: process.env.NEXT_PUBLIC_RC_SUBSCRIPTION_OFFERING_ID || '',
    NEXT_PUBLIC_RC_DATES_OFFERING_ID: process.env.NEXT_PUBLIC_RC_DATES_OFFERING_ID || 'dates',
  },
};

export default nextConfig;
