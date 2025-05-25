'use client';

import { useUser } from '@/features/context/userContext';
import { DeveloperDashboard } from '@/features/Dashboards/DeveloperDashboard';

export function DashboardContainer() {
  const { userDetails } = useUser();

  const role = userDetails?.role?.toLowerCase();

  const dashboardTitle = `${role?.charAt(0).toUpperCase()! + role?.slice(1)!} Dashboard`;

  if (role === 'developer') {
    return (
      <>
        <h2 className="text-2xl font-bold tracking-tight mb-4">{dashboardTitle}</h2>
        <DeveloperDashboard />
      </>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight mb-4">{dashboardTitle}</h2>
      <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">
                    Dashboard for this role is currently under development.
        </p>
      </div>
    </>
  );
}
