'use client';

import { useUser } from '@/features/context/userContext';
import { DeveloperDashboard } from '@/app/user/dashboard/components/DeveloperDashboard';
import { ManagerDashboard } from '@/app/user/dashboard/components/ManagerDashboard';
import { TFSDashboard } from '@/app/user/dashboard/components/TFSDashboard';

export function DashboardContainer() {
  const { userDetails } = useUser();

  const role = userDetails?.role?.toLowerCase();

  const dashboardTitle = role
    ? `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`
    : 'Dashboard';

  if (role === 'developer') {
    return (
      <>
        <h2 className="text-2xl font-bold tracking-tight mb-4">{dashboardTitle}</h2>
        <DeveloperDashboard />
      </>
    );
  }

  if (role === 'manager') {
    return (
      <>
        <h2 className="text-2xl font-bold tracking-tight mb-4">{dashboardTitle}</h2>
        <ManagerDashboard />
      </>
    );
  }

  if (role === 'tfs') {
    return (
      <>
        <h2 className="text-2xl font-bold tracking-tight mb-4">{dashboardTitle}</h2>
        <TFSDashboard />
      </>
    );
  }

  return (
    <>
      <div>

      </div>
    </>
  );
}
