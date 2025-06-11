import { useState } from 'react';
import { useUser } from '@/features/context/userContext';

interface AddFeedbackParams {
    roleId: number;
    name: string;
    description: string;
    feedback: string;
    project_id: number;
}

export function useAddFeedback() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const addFeedback = async ({
    roleId,
    name,
    description,
    feedback,
    project_id,
  }: AddFeedbackParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/project-roles/${roleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userAuth?.accessToken}`,
        },
        body: JSON.stringify({
          name,
          description,
          feedback,
          project_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update feedback');
      }

      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
      return null;
    }
  };

  return {
    addFeedback,
    isLoading,
    error,
  };
}
