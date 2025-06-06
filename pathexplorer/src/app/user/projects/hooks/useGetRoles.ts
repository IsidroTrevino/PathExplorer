import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/features/context/userContext';

export interface RoleSkill {
    skill_name: string;
    type: string;
    level: number;
}

export interface ProjectRole {
    name: string;
    description: string;
    feedback: string;
    project_id: number;
    role_id: number;
    assigned: boolean | null;
    developer_id: number | null;
    developer_name: string | null;
    skills: RoleSkill[];
}

export function useGetRoles(projectId: string | number | null) {
  const [roles, setRoles] = useState<ProjectRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const fetchRoles = useCallback(async () => {
    if (!projectId || !userAuth?.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/project-roles/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${userAuth.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setRoles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch roles');
      console.error('Error fetching roles:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId, userAuth]);

  useEffect(() => {
    if (userAuth?.accessToken && projectId) {
      fetchRoles();
    }
  }, [fetchRoles, userAuth, projectId]);

  return {
    roles,
    loading,
    error,
    refetch: fetchRoles,
  };
}
