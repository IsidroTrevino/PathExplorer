import { useState, useEffect } from 'react';
import { useUser } from '@/features/context/userContext';

export interface ProjectRole {
    name: string;
    description: string;
    feedback: string;
    project_id: number;
    role_id: number;
    assigned: boolean | null;
    developer_id: number | null;
    developer_name: string | null;
    skills: any[];
}

export function useGetProjectRoles(projectId: string) {
  const [roles, setRoles] = useState<ProjectRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  useEffect(() => {
    const fetchRoles = async () => {
      if (!userAuth?.accessToken || !projectId) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/project-roles/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${userAuth.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch project roles');
        }

        const data = await response.json();

        // Filter only unassigned roles (where assigned is null)
        const unassignedRoles = data.filter((role: ProjectRole) => role.assigned === null);

        setRoles(unassignedRoles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [projectId, userAuth]);

  return { roles, loading, error };
}
