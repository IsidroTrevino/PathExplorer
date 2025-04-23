'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/GlobalComponents/pageHeader';
import { EmployeeTable } from '@/components/GlobalComponents/employeeTable';
import { useGetEmployees } from '@/features/user/useGetEmployees';
import { Skeleton } from '@/components/ui/skeleton';

export default function EmployeesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [alphabetical, setAlphabetical] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

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
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Employees"
          subtitle="Search through the employees currently registered and visualize their information."
        />

        <div className="mt-8">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : error ? (
            <div className="rounded-md bg-red-50 p-4 text-red-700">
              {error}
            </div>
          ) : (
            <div className="h-[calc(100vh-250px)] overflow-auto">
              <EmployeeTable
                data={employees}
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
