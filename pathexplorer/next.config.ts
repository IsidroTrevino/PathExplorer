import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/register',
        destination: 'https://pathexplorer.vercel.app/register',
      },
      {
        source: '/api/users/:id',
        destination: 'https://pathexplorer.vercel.app/users/:id',
      },
      {
        source: '/api/send-otp',
        destination: 'https://pathexplorer.vercel.app/send-otp',
      },
      {
        source: '/api/verify-otp',
        destination: 'https://pathexplorer.vercel.app/verify-otp',
      },
    ];
  },
};

export default nextConfig;
