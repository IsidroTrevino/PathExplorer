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
        source: '/api/users/:id',
        destination: 'https://pathexplorer.vercel.app/users/:id',
      },
    ];
  },
};

export default nextConfig;
