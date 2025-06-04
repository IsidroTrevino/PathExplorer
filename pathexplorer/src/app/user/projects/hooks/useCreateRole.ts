import { useState } from 'react';
import { useUser } from '@/features/context/userContext';

interface CreateRoleParams {
    name: string;
    description: string;
    project_id: number;
}

export function useCreateRole() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const createRole = async (params: CreateRoleParams): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        name: params.name,
        description: params.description,
        feedback: '',
        project_id: params.project_id,
      };

      const response = await fetch('/api/project-roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userAuth?.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Error: ${response.status} ${response.statusText}`,
        );
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create role';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createRole,
    isLoading,
    error,
  };
}
