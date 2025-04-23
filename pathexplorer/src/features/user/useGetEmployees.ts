'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/features/context/userContext';

interface APIEmployeeResponse {
    items: APIEmployee[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export interface APIEmployee {
    name: string;
    last_name_1: string;
    last_name_2: string;
    phone_number: string;
    location: string;
    capability: string;
    position: string;
    seniority: number;
    role: string;
}

export interface Employee {
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
}

interface EmployeesResponse {
    data: Employee[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
    loading: boolean;
    error: string | null;
}

const DUMMY_PROJECTS = ['PathExplorer', 'Client Portal', 'Internal Tools', 'Data Analytics', 'Mobile App', 'None'];

export function useGetEmployees({
  page = 1,
  size = 10,
  role = null,
  alphabetical = null,
  search = null,
}: UseGetEmployeesParams = {}): EmployeesResponse {
  const [data, setData] = useState<Employee[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = `/api/users?page=${page}&size=${size}`;

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
            'Authorization': `Bearer ${userAuth?.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}`);
        }

        const apiData: APIEmployeeResponse = await response.json();

        const enhancedData: Employee[] = apiData.items.map((emp, index) => {
          const assignedProject = Math.random() < 0.2
            ? 'None'
            : DUMMY_PROJECTS[Math.floor(Math.random() * (DUMMY_PROJECTS.length - 1))];

          const status = assignedProject === 'None' ? 'Staff' : 'Assigned';

          const assignmentPercentage = assignedProject === 'None'
            ? 0
            : Math.floor(Math.random() * 51) + 50;

          return {
            id: index + 1,
            name: emp.name,
            last_name_1: emp.last_name_1,
            position: emp.position,
            role: emp.role,
            assigned_project: assignedProject,
            status,
            assignment_percentage: assignmentPercentage,
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
    };

    fetchEmployees();
  }, [page, size, role, alphabetical, search, userAuth]);

  return {
    data,
    totalPages,
    currentPage,
    totalItems,
    loading,
    error,
  };
}
