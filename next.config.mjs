

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'systemgroupbd.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  // Strict CSP via headers
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
