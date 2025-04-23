import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/register',
        destination: 'https://pathexplorer.vercel.app/auth/register',
      },
      {
        source: '/api/my-info',
        destination: 'https://pathexplorer.vercel.app/profile/my-info',
      },
      {
        source: '/api/users',
        destination: 'https://pathexplorer.vercel.app/users',
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
        destination: 'https://pathexplorer.vercel.app/auth/token',
      },
      {
        source: '/api/edit',
        destination: 'https://pathexplorer.vercel.app/profile/edit',
      },
      {
        source: '/api/send-otp',
        destination: 'https://pathexplorer.vercel.app/otp/send-otp',
      },
      {
        source: '/api/verify-otp',
        destination: 'https://pathexplorer.vercel.app/otp/verify-otp',
      },
      {
        source: '/api/project',
        destination: 'https://pathexplorer.vercel.app/project',
      },
    ];
  },
};

export default nextConfig;
