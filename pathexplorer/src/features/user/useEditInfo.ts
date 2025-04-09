import { useState } from 'react';
import { useUser } from '@/features/context/userContext';

interface EditInfoData {
  email: string;
  name: string;
  last_name_1: string;
  last_name_2: string;
  phone_number: string;
  location: string;
  capability: string;
  position: string;
  seniority: number;
  role: string;
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userAuth.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update information');
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
