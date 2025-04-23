import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/register',
        destination: 'https://pathexplorer.vercel.app/register',
      },
      {
        source: '/api/my-info',
        destination: 'https://pathexplorer.vercel.app/my-info',
      },
      {
        source: '/api/users',
        destination: 'https://pathexplorer.vercel.app/users',
      },
      {
        source: '/api/users/:id',
        destination: 'https://pathexplorer.vercel.app/users/:id',
      },
      {
        source: '/api/token',
        destination: 'https://pathexplorer.vercel.app/token',
      },
      {
        source: '/api/edit',
        destination: 'https://pathexplorer.vercel.app/edit',
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
