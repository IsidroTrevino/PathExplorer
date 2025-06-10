import { useState, useEffect } from 'react';
import { useUser } from '@/features/context/userContext';
import { RoleSkill } from '../types/ProjectTypes';

export function useGetRoleSkills(roleId: number | null) {
  const [skills, setSkills] = useState<RoleSkill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  useEffect(() => {
    const fetchSkills = async () => {
      if (!roleId) {
        setSkills([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/project-roles/${roleId}/skills`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userAuth?.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch role skills');
        }

        const data = await response.json();
        setSkills(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [roleId, userAuth?.accessToken]);

  return { skills, loading, error };
}
