import { useState, useCallback } from 'react';
import { useUser } from '@/features/context/userContext';
import { format } from 'date-fns';

interface UpdateCertificationData {
  name: string;
  type: string;
  description: string;
  certification_date: Date | undefined;
  expiration_date: Date | undefined;
}

export function useUpdateCertification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const updateCertification = useCallback(async (
    certificationId: number,
    data: UpdateCertificationData,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/certifications/update/${certificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userAuth?.accessToken}`,
        },
        body: JSON.stringify({
          name: data.name,
          type: data.type,
          description: data.description,
          certification_date: data.certification_date ? format(data.certification_date, 'yyyy-MM-dd') : null,
          expiration_date: data.expiration_date ? format(data.expiration_date, 'yyyy-MM-dd') : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update certification');
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userAuth]);

  return {
    updateCertification,
    loading,
    error,
  };
}
