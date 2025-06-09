'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/features/context/userContext';

export function useEmployeeProfile(employeeId: string | number) {
  const [employeeData, setEmployeeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  useEffect(() => {
    async function fetchEmployeeProfile() {
      if (!userAuth?.accessToken) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/all/${employeeId}/full-profile`, {
          headers: {
            'Authorization': `Bearer ${userAuth.accessToken}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch employee profile: ${response.status}`);
        }

        const data = await response.json();
        setEmployeeData(data);
      } catch (err) {
        console.error('Error fetching employee profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load employee data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEmployeeProfile();
  }, [employeeId, userAuth?.accessToken]);

  return { employeeData, isLoading, error };
}
