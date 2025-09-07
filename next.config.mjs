/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Enable ESLint checking during builds
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Enable TypeScript checking during builds
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
