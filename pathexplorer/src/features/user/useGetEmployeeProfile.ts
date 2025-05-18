import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/features/context/userContext';

export interface EmployeeSkill {
    skill_name: string;
    type: 'soft' | 'hard';
    level: number;
    skill_id: number;
}

export interface EmployeeProfile {
    employee_id: number;
    name: string;
    last_name_1: string;
    last_name_2: string;
    phone_number: string;
    location: string;
    capability: string;
    position: string;
    seniority: number;
    email: string;
    role: string;
    project: {
        project_id: number;
        project_name: string;
        project_start_date: string;
        project_end_date: string;
    } | null;
    curriculum: string;
    assignment_status: string;
    certifications: any[];
    skills: EmployeeSkill[];
}

export function useGetEmployeeProfile(employeeId: string | number | null) {
  const [data, setData] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!userAuth?.accessToken || !employeeId || fetchedRef.current) return;

    const fetchEmployeeProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/users/profile/${employeeId}`, {
          headers: {
            'Authorization': `Bearer ${userAuth.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch employee profile: ${response.status}`);
        }

        const profileData = await response.json();
        setData(profileData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch employee profile';
        setError(errorMessage);
        console.error('Error fetching employee profile:', err);
      } finally {
        setLoading(false);
        fetchedRef.current = true;
      }
    };

    fetchEmployeeProfile();
  }, [employeeId, userAuth]);

  return {
    data,
    loading,
    error,
    refetch: () => {
      fetchedRef.current = false;
    },
  };
}
