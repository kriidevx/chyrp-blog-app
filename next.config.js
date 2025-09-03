/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  //experimental: {
  //  appDir: true, // Enable /app directory routing
  //},
  images: {
    domains: ["your-supabase-storage-url.supabase.co"], // Add your media domains here
  },
};

module.exports = nextConfig;
