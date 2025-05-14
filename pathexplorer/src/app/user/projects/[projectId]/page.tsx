'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/GlobalComponents/pageHeader';
import { EmployeeTable } from '@/components/GlobalComponents/employeeTable';
import { useGetEmployees } from '@/features/user/useGetEmployees';
import { toast } from 'sonner';

export default function ProjectEmployeesPage() {
  const { projectId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [alphabetical, setAlphabetical] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const {
    data: employees,
    totalPages,
    loading,
    error,
    refetch,
  } = useGetEmployees({
    page: currentPage,
    size: pageSize,
    role: roleFilter,
    alphabetical,
    search: searchTerm,
    assigned: false, // 👈 Filtrar solo empleados NO asignados
  });

  useEffect(() => {
    refetch();
  }, [projectId]);

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
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title={`Available Employees for Project ${projectId}`}
          subtitle="Filter and view available employees for assignment."
        />

        <div className="mt-8">
          {error ? (
            <div className="rounded-md bg-red-50 p-4 text-red-700">
              {error}
            </div>
          ) : (
            <div className="h-[calc(100vh-250px)] overflow-auto">
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
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
