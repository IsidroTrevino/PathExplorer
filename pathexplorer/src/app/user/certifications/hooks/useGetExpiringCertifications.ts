import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/features/context/userContext';
import { Certification } from './useGetCertifications';

export function useGetExpiringCertifications(fetchOnMount = true) {
  const [expiringCertifications, setExpiringCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(fetchOnMount);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const fetchExpiringCertifications = useCallback(async () => {
    if (!userAuth?.accessToken) {
      console.error('No access token available for expiring certifications');
      setError('Authentication token not available');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/certifications/expiring', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userAuth.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch expiring certifications');
      }

      const data = await response.json();
      setExpiringCertifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [userAuth?.accessToken]);

  useEffect(() => {
    if (fetchOnMount && userAuth?.accessToken) {
      fetchExpiringCertifications();
    }
  }, [fetchOnMount, userAuth?.accessToken, fetchExpiringCertifications]);

  return {
    expiringCertifications,
    loading,
    error,
    refetch: fetchExpiringCertifications,
  };
}
