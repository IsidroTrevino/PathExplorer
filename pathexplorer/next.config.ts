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
        source: '/api/projects',
        destination: 'https://pathexplorer.vercel.app/projects',
      },
      {
        source: '/api/projects/:project_id',
        destination: 'https://pathexplorer.vercel.app/projects/:project_id',
      },
      {
        source: '/api/certifications/add',
        destination: 'https://pathexplorer.vercel.app/certifications/add',
      },
      {
        source: '/api/certifications/my-certifications',
        destination: 'https://pathexplorer.vercel.app/certifications/my-certifications',
      },
      {
        source: '/api/certifications/refresh-status',
        destination: 'https://pathexplorer.vercel.app/certifications/refresh-status',
      },
      {
        source: '/api/skills/add',
        destination: 'https://pathexplorer.vercel.app/skills/add',
      },
      {
        source: '/api/skills/my-skills',
        destination: 'https://pathexplorer.vercel.app/skills/my-skills',
      },
      {
        source: '/api/goals/add',
        destination: 'https://pathexplorer.vercel.app/goals/add',
      },
      {
        source: '/api/goals/my-goals',
        destination: 'https://pathexplorer.vercel.app/goals/my-goals',
      },
      {
        source: '/api/certifications/expiring',
        destination: 'https://pathexplorer.vercel.app/certifications/expiring',
      },
    ];
  },
};

export default nextConfig;
