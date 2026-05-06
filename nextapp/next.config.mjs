/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    // Local images in /public serve fine; add external domains if needed later
    remotePatterns: [],
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
