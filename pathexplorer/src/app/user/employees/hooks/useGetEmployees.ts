'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@/features/context/userContext';
import {
  APIEmployeeResponse,
  APIEmployee,
  Employee,
  UseGetEmployeesParams,
  EmployeesResponse,
} from '../types/EmployeeTypes';

export function useGetEmployees({
  page = 1,
  size = 20,
  role = null,
  alphabetical = null,
  search = null,
  assigned = null,
}: UseGetEmployeesParams = {}): EmployeesResponse {
  const [data, setData] = useState<Employee[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userAuth, isLoading: isAuthLoading } = useUser();
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  const fetchEmployees = useCallback(async () => {
    if (!userAuth?.accessToken) {
      return;
    }

    setLoading(true);
    setError(null);
    setHasAttemptedFetch(true);

    try {
      let url = `/api/users?page=${page}&size=${size}`;

      if (assigned !== null) {
        url += `&assigned=${assigned}`;
      }

      if (role) {
        url += `&role=${role}`;
      }

      if (alphabetical !== null) {
        url += `&alphabetical=${alphabetical}`;
      }

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userAuth.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}`);
      }

      const apiData: APIEmployeeResponse = await response.json();

      const enhancedData: Employee[] = apiData.items.map((emp: APIEmployee) => {
        return {
          id: emp.employee_id,
          name: emp.name,
          last_name_1: emp.last_name_1,
          position: emp.position,
          role: emp.role,
          assigned_project: emp.project ? emp.project.project_name : 'None',
          status: emp.project ? 'Assigned' : 'Staff',
          assignment_percentage: 0,
        };
      });

      setData(enhancedData);
      setTotalPages(apiData.pages);
      setCurrentPage(apiData.page);
      setTotalItems(apiData.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  }, [page, size, role, alphabetical, search, assigned, userAuth]);

  useEffect(() => {
    if (isAuthLoading) {
      setError(null);
    }

    if (!isAuthLoading && userAuth?.accessToken) {
      fetchEmployees().catch(err => {
        console.error('Unhandled promise rejection:', err);
      });
    }
    else if (!isAuthLoading && hasAttemptedFetch && !userAuth?.accessToken) {
      setLoading(false);
      setError('Authentication required');
    }
  }, [fetchEmployees, userAuth, isAuthLoading, hasAttemptedFetch]);

  return {
    data,
    totalPages,
    currentPage,
    totalItems,
    loading: loading || isAuthLoading,
    error,
    refetch: fetchEmployees,
  };
}
