import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/features/context/userContext';
import { Project, GetProjectsParams, APIProject } from '../types/ProjectTypes';

export function useGetProjects({
  page = 1,
  size = 10,
  search = null,
  alphabetical = null,
  start_date = null,
  end_date = null,
}: GetProjectsParams) {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const { userAuth } = useUser();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      queryParams.append('page', page.toString());
      queryParams.append('size', size.toString());
      if (search) queryParams.append('search', search);
      if (alphabetical !== null) queryParams.append('alphabetical', alphabetical.toString());
      if (start_date) queryParams.append('start_date', start_date);
      if (end_date) queryParams.append('end_date', end_date);

      const url = `/api/projects?${queryParams.toString()}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${userAuth?.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      const projects: Project[] = result.items?.map((project: APIProject) => ({
        id: project.project_id?.toString(),
        project_name: project.project_name,
        client: project.client,
        description: project.description,
        start_date: project.start_date,
        end_date: project.end_date,
        employees_req: project.employees_req,
        manager_id: project.manager_id,
        manager: project.manager,
        roles: project.roles || [],
        project_id: project.project_id,
      })) || [];

      setData(projects);
      setTotalPages(result.pages || 1);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [userAuth, page, size, search, alphabetical, start_date, end_date]);

  useEffect(() => {
    if (userAuth?.accessToken) {
      fetchProjects();
    }
  }, [fetchProjects, userAuth]);

  return {
    data,
    totalPages,
    loading,
    error,
    refetch: fetchProjects,
  };
}
