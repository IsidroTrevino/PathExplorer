import { useState, useCallback } from 'react';
import { useUser } from '@/features/context/userContext';

export function useRefreshCertificationStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const refreshStatus = useCallback(async () => {
    if (!userAuth?.accessToken) {
      console.error('No access token available for refresh-status');
      throw new Error('Authentication token not available');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/certifications/refresh-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userAuth.accessToken}`,
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
  }, [userAuth?.accessToken]);

  return {
    refreshStatus,
    loading,
    error,
  };
}
