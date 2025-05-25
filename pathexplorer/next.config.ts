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
        destination: 'https://pathexplorer.vercel.app/otp/send',
      },
      {
        source: '/api/verify-otp',
        destination: 'https://pathexplorer.vercel.app/otp/verify',
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
        source: '/api/skills/update/:id',
        destination: 'https://pathexplorer.vercel.app/skills/update/:id',
      },
      {
        source: '/api/skills/delete/:id',
        destination: 'https://pathexplorer.vercel.app/skills/delete/:id',
      },
      {
        source: '/api/goals/update/:id',
        destination: 'https://pathexplorer.vercel.app/goals/update/:id',
      },
      {
        source: '/api/goals/delete/:id',
        destination: 'https://pathexplorer.vercel.app/goals/delete/:id',
      },
      {
        source: '/api/certifications/expiring',
        destination: 'https://pathexplorer.vercel.app/certifications/expiring',
      },
      {
        source: '/api/certifications/update/:id',
        destination: 'https://pathexplorer.vercel.app/certifications/update/:id',
      },
      {
        source: '/api/r2/upload',
        destination: '/api/r2/upload',
      },
      {
        source: '/api/r2/download',
        destination: '/api/r2/download',
      },
      {
        source: '/api/curriculum',
        destination: 'https://pathexplorer.vercel.app/curriculum',
        basePath: false,
      },
      {
        source: '/api/r2/delete',
        destination: '/api/r2/delete',
      },
      {
        source: '/api/project-roles',
        destination: 'https://pathexplorer.vercel.app/project-roles/',
      },
      {
        source: '/api/assignments',
        destination: 'https://pathexplorer.vercel.app/assignments/',
      },
      {
        source: '/api/project-roles/:project_id',
        destination: 'https://pathexplorer.vercel.app/project-roles/:project_id',
      },
      {
        source: '/api/project-roles/roles',
        destination: 'https://pathexplorer.vercel.app/project-roles/roles',
      },
      {
        source: '/api/project-roles/:role_id',
        destination: 'https://pathexplorer.vercel.app/project-roles/:role_id',
      },
      {
        source: '/api/users/profile/:id',
        destination: 'https://pathexplorer.vercel.app/users/profile/:id',
      },
      {
        source: '/api/project-roles/:roleId/skills',
        destination: 'https://pathexplorer.vercel.app/project-roles/:roleId/skills',
      },
      {
        source: '/api/project-roles/:projectId',
        destination: 'https://pathexplorer.vercel.app/project-roles/:projectId',
      },
      {
        source: '/api/ai/feedback',
        destination: 'https://pathexplorer.vercel.app/ai/feedback',
      },
      {
        source: '/api/ai/certifications',
        destination: 'https://pathexplorer.vercel.app/ai/certifications',
      },
      {
        source: '/api/assignments/pending-assignments',
        destination: 'https://pathexplorer.vercel.app/assignments/pending-assignments',
      },
      {
        source: '/api/assignments/:assignment_id/approve',
        destination: 'https://pathexplorer.vercel.app/assignments/:assignment_id/approve',
      },
      {
        source: '/api/assignments/:assignment_id/reject',
        destination: 'https://pathexplorer.vercel.app/assignments/:assignment_id/reject',
      },
      {
        source: '/api/stats/employee/summary',
        destination: 'https://pathexplorer.vercel.app/stats/employee/summary',
      },
    ];
  },
};

export default nextConfig;
