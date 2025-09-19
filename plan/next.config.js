/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'your-cloudfront-domain.cloudfront.net' },
      { protocol: 'https', hostname: 's3.ap-northeast-2.amazonaws.com' }
    ]
  },
  experimental: {
    serverActions: { allowedOrigins: ['your-domain.com', 'localhost:3000'] }
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ]
      }
    ]
  }
};

module.exports = nextConfig;
