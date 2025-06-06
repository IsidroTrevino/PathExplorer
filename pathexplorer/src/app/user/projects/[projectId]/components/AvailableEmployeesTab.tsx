'use client';

import { useState } from 'react';
import { EmployeeTable } from '@/components/employeeTable';
import { useGetEmployees } from '@/app/user/employees/hooks/useGetEmployees';
import { Employee } from '@/app/user/projects/[projectId]/employee/[employeeId]/types/EmployeeProjectTypes';
import { useRequestEmployeeModal } from '@/app/user/projects/hooks/useRequestEmployeeModal';
import { useGetProjectRoles } from '@/app/user/projects/hooks/useGetProjectRoles';
import { RequestEmployeeModal } from '@/app/user/projects/components/requestEmployeeModal';

interface AvailableEmployeesTabProps {
    projectId: string;
}

export function AvailableEmployeesTab({ projectId }: AvailableEmployeesTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [alphabetical, setAlphabetical] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const { onOpen, onClose, isOpen } = useRequestEmployeeModal();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const { roles: projectRoles, loading: projectLoading } = useGetProjectRoles(projectId);

  const handleRequestEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    onOpen();
  };

  const {
    data: employees,
    totalPages,
    loading,
    error,
  } = useGetEmployees({
    page: currentPage,
    size: pageSize,
    role: roleFilter,
    alphabetical,
    search: searchTerm,
    assigned: false,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRoleFilter = (role: string | null) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  const handleSort = (isAlphabetical: boolean | null) => {
    setAlphabetical(isAlphabetical);
    setCurrentPage(1);
  };

  const handleSearch = (search: string | null) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  return (
    <>
      {error ? (
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : (
        <div className="h-[calc(100vh-320px)] overflow-auto">
          <EmployeeTable
            data={loading ? [] : employees}
            loading={loading}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPages}
            onRoleFilter={handleRoleFilter}
            onSort={handleSort}
            onSearch={handleSearch}
            isExternalPagination={true}
            variant="available"
            onRequestEmployeeOpen={(employee) => handleRequestEmployee(employee as unknown as Employee)}
            projectId={projectId}
          />
        </div>
      )}

      <RequestEmployeeModal
        projectId={projectId}
        selectedEmployee={selectedEmployee ?? undefined}
        isOpen={isOpen}
        onClose={onClose}
        projectRoles={projectRoles}
        projectLoading={projectLoading}
      />
    </>
  );
}
