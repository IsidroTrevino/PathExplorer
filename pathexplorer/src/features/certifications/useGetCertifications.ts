import { useState, useEffect } from 'react';
import { useUser } from '@/features/context/userContext';

export interface Certification {
  name: string;
  type: string;
  description: string;
  certification_date: string;
  expiration_date: string;
  certification_id: number;
  status: 'active' | 'expired';
}

export function useGetCertifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const fetchCertifications = async () => {
    setLoading(true);
    setError(null);

    try {
      // First refresh the certification statuses
      const refreshResponse = await fetch('/api/certifications/refresh-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userAuth?.accessToken}`,
        },
      });

      if (!refreshResponse.ok) {
        console.warn('Failed to refresh certification statuses');
      }

      // Then fetch the certifications
      const response = await fetch('/api/certifications/my-certifications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userAuth?.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch certifications');
      }

      const data = await response.json();
      setCertifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, [userAuth?.accessToken]);

  return {
    certifications,
    loading,
    error,
    refetch: fetchCertifications,
  };
}
