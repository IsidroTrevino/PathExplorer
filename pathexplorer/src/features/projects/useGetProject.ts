import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/features/context/userContext';
import { Project } from './useGetProjects';

interface ApiProject {
  project_id: number;
  project_name: string;
  client: string;
  description: string;
  start_date: string;
  end_date: string;
  employees_req: number;
  manager_id: number;
  manager: string;
  roles?: {
    role_id: number;
    role_name: string;
    role_description: string;
  }[];
}

interface ApiProjectRole {
  role_id: number;
  role_name: string;
  role_description: string;
}

export function useGetProject(projectId: string | number | null) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const fetchProject = useCallback(async () => {
    if (!projectId || !userAuth?.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${userAuth.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      let projectsArray;
      if (Array.isArray(data)) {
        projectsArray = data;
      } else if (data && typeof data === 'object') {
        for (const key of ['data', 'items', 'projects', 'results']) {
          if (Array.isArray(data[key])) {
            projectsArray = data[key];
            break;
          }
        }
      }

      if (!projectsArray) {
        console.error('API response structure:', data);
        throw new Error('Unexpected API response format');
      }

      const targetProject = projectsArray.find((proj: ApiProject) =>
        proj.project_id.toString() === projectId.toString(),
      );

      if (!targetProject) {
        throw new Error(`Project with ID ${projectId} not found`);
      }

      const mappedRoles = targetProject.roles?.map((role: ApiProjectRole) => ({
        role_id: role.role_id,
        name: role.role_name,
        description: role.role_description,
        skills: [],
      })) || [];

      const formattedProject: Project = {
        id: targetProject.project_id?.toString() || '',
        project_name: targetProject.project_name || '',
        client: targetProject.client || '',
        description: targetProject.description || '',
        start_date: targetProject.start_date || '',
        end_date: targetProject.end_date || '',
        employees_req: targetProject.employees_req || 0,
        manager_id: targetProject.manager_id,
        manager: targetProject.manager || '',
        roles: mappedRoles,
        project_id: targetProject.project_id,
      };

      setProject(formattedProject);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project');
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId, userAuth]);

  useEffect(() => {
    if (userAuth?.accessToken && projectId) {
      fetchProject();
    }
  }, [fetchProject, userAuth, projectId]);

  return {
    project,
    loading,
    error,
    refetch: fetchProject,
  };
}
