'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@/features/context/userContext';

interface APIEmployeeResponse {
  items: APIEmployee[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

interface APIEmployee {
  employee_id: number;
  name: string;
  last_name_1: string;
  last_name_2: string;
  phone_number: string;
  location: string;
  capability: string;
  position: string;
  seniority: number;
  role: string;
  project: {
    project_id: number;
    project_name: string;
    project_start_date: string;
    project_end_date: string;
  } | null;
  assignment_status: string;
  days_since_last_project: number;
}

interface Employee {
  id: number;
  name: string;
  last_name_1: string;
  position: string;
  role: string;
  assigned_project: string;
  status: 'Assigned' | 'Staff';
  assignment_percentage: number;
}

interface UseGetEmployeesParams {
  page?: number;
  size?: number;
  role?: string | null;
  alphabetical?: boolean | null;
  search?: string | null;
  assigned?: boolean | null;
}

interface EmployeesResponse {
  data: Employee[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

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
      // Base URL
      let url = `/api/users?page=${page}&size=${size}`;

      // Only add assigned param if it's explicitly set
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
          assignment_percentage: 0, // Default to 0%
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
    // Reset error when auth is loading
    if (isAuthLoading) {
      setError(null);
    }

    // Only fetch when auth is loaded and we have a token
    if (!isAuthLoading && userAuth?.accessToken) {
      fetchEmployees().catch(err => {
        console.error('Unhandled promise rejection:', err);
      });
    }
    // Only show auth error if we've tried to fetch and auth is definitely done loading
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
    loading: loading || isAuthLoading, // Show loading while auth is loading
    error,
    refetch: fetchEmployees,
  };
}
