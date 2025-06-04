import { useState, useEffect } from 'react';
import { useUser } from '@/features/context/userContext';
import { Certification } from './useGetCertifications';

export function useGetExpiringCertifications() {
  const [expiringCertifications, setExpiringCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const fetchExpiringCertifications = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/certifications/expiring', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userAuth?.accessToken}`,
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
  };

  useEffect(() => {
    if (userAuth?.accessToken) {
      fetchExpiringCertifications();
    }
  }, [userAuth?.accessToken]);

  return {
    expiringCertifications,
    loading,
    error,
    refetch: fetchExpiringCertifications,
  };
}
