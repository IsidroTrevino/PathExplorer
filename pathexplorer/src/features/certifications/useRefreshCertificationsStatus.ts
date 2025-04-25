import { useState } from 'react';
import { useUser } from '@/features/context/userContext';

export function useRefreshCertificationStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const refreshStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/certifications/refresh-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userAuth?.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to refresh certification statuses');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    refreshStatus,
    loading,
    error,
  };
}
