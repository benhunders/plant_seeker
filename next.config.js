/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow larger request bodies for base64 image uploads to the identify route.
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

module.exports = nextConfig;
