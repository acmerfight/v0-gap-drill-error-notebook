/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Trust CI ESLint checks, skip during builds for performance
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Enable TypeScript checking during builds
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

export default nextConfig
