/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
    return [
      { source: '/cinema/:path*', destination: '/products', permanent: true },
      { source: '/admin/cinema/:path*', destination: '/admin/products', permanent: false },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 768, 1024, 1280, 1440, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
