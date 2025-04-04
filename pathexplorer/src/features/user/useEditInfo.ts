import { useState } from 'react';
import { useUser } from '@/features/context/userContext';

interface EditInfoData {
    name: string;
    email: string;
    position: string;
    seniority: number;
}

export const useEditInfo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userAuth, fetchUserDetails } = useUser();

  const updateUserInfo = async (data: EditInfoData): Promise<boolean> => {
    if (!userAuth?.accessToken) {
      setError('Authentication token is missing');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userAuth.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update information');
      }

      await fetchUserDetails(userAuth.accessToken);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update information');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUserInfo, isLoading, error };
};
