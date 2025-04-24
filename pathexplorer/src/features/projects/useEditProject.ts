import { useState } from 'react';
import { useUser } from '@/features/context/userContext';

interface EditProjectParams {
  id: string;
  projectName: string;
  client: string;
  startDate: Date;
  endDate: Date;
  employees_req: number;
  description: string;
}

export function useEditProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const editProject = async (data: EditProjectParams): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    try {
      const payload = {
        projectName: data.projectName,
        client: data.client,
        description: data.description,
        startDate: formatDate(data.startDate),
        endDate: formatDate(data.endDate),
        employees_req: data.employees_req,
      };

      const response = await fetch(`/api/projects/${data.id}`, {
        method: 'PUT',
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    editProject,
    isLoading,
    error,
  };
}
