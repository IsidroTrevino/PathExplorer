import { useState } from 'react';
import { useUser } from '@/features/context/userContext';

interface CreateRoleSkillParams {
    roleId: number;
    skillName: string;
    level: number;
    type: 'hard' | 'soft';
}

export function useCreateRoleSkill() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const createRoleSkill = async ({ roleId, skillName, level, type }: CreateRoleSkillParams) => {
    if (!userAuth?.accessToken) {
      setError('Not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/project-roles/${roleId}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userAuth.accessToken}`,
        },
        body: JSON.stringify({
          skill_name: skillName,
          level,
          type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add skill to role');
      console.error('Error adding skill to role:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createRoleSkill,
    loading,
    error,
  };
}
