'use client';

import { useEmployeeProfile } from '../hooks/useGetEmployeeInfo';
import { EmployeeProfileContainer } from './EmployeeProfileContainer';
import { EmployeeProfileSkeleton } from './EmployeeProfileSkeleton';

export function EmployeeProfileWrapper({ employeeId }: { employeeId: number }) {
  const { employeeData, isLoading, error } = useEmployeeProfile(employeeId);

  if (isLoading) {
    return <EmployeeProfileSkeleton />;
  }

  if (error || !employeeData) {
    return (
      <div className="p-6 max-w-lg mx-auto mt-10 bg-red-50 border border-red-200 rounded-md">
        <h2 className="text-lg font-medium text-red-800 mb-2">Failed to load employee data</h2>
        <p className="text-red-700">{error || 'Employee not found'}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <EmployeeProfileContainer employeeData={employeeData} />
    </div>
  );
}
