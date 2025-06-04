import { useState } from 'react';
import { useUser } from '@/features/context/userContext';

interface CertificateData {
    name: string;
    type: string;
    description: string;
    certification_date: string;
    expiration_date: string;
}

export function useCreateCertificate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const createCertificate = async (data: CertificateData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/certifications/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userAuth?.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create certificate');
      }

      const result = await response.json();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
      throw err;
    }
  };

  return {
    createCertificate,
    loading,
    error,
  };
}
