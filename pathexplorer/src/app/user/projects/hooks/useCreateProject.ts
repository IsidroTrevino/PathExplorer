import { useState } from 'react';
import { useUser } from '@/features/context/userContext';
import { CreateProjectParams, CreateProjectResponse } from '../types/ProjectTypes';

export function useCreateProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const createProject = async (data: CreateProjectParams): Promise<CreateProjectResponse | null> => {
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

      const response = await fetch('/api/projects', {
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

      const apiResponse = await response.json();

      const result: CreateProjectResponse = {
        id: apiResponse.project_id.toString(),
        projectName: apiResponse.projectname,
        client: apiResponse.client,
        description: apiResponse.description,
        startDate: apiResponse.startdate,
        endDate: apiResponse.enddate,
        employees_req: apiResponse.employees_req,
      };

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createProject,
    isLoading,
    error,
  };
}
