import { useState } from 'react';
import { useUser } from '@/features/context/userContext';
import { useProjects } from '@/features/context/projectContext';

interface CreateProjectParams {
    title: string;
    client: string;
    startDate: Date;
    deliveryDate: Date;
    necessaryEmployees: number;
    description: string;
    createdBy: string;
}

interface CreateProjectResponse {
    id: string;
    projectName: string;
    client: string;
    description: string;
    startDate: string;
    endDate: string;
    employees_req: number;
}

export function useCreateProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();
  const { addProject } = useProjects();

  const createProject = async (data: CreateProjectParams): Promise<CreateProjectResponse | null> => {
    setIsLoading(true);
    setError(null);

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    try {
      const payload = {
        projectName: data.title,
        client: data.client,
        description: data.description,
        startDate: formatDate(data.startDate),
        endDate: formatDate(data.deliveryDate),
        employees_req: data.necessaryEmployees,
      };

      const response = await fetch('/api/project', {
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
      console.log('API response:', apiResponse);

      // Transform API response to match the Project interface
      const result: CreateProjectResponse = {
        id: apiResponse.project_id.toString(),
        projectName: apiResponse.projectname,
        client: apiResponse.client,
        description: apiResponse.description,
        startDate: apiResponse.startdate,
        endDate: apiResponse.enddate,
        employees_req: apiResponse.employees_req,
      };

      const projectWithCreator = {
        ...result,
        createdBy: data.createdBy,
      };

      addProject(projectWithCreator);

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
