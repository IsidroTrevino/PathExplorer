import { useState } from 'react';
import { useUser } from '@/features/context/userContext';

interface UpdateRoleSkillParams {
  roleId: number;
  skillName: string;
  originalSkillName: string;
  level: number;
  type: 'hard' | 'soft';
}

export function useUpdateRoleSkill() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const updateRoleSkill = async (data: UpdateRoleSkillParams): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        skill_name: data.skillName,
        level: data.level,
        type: data.type,
      };

      const response = await fetch(`/api/update/project-roles/${data.roleId}/skills/?skill_name=${encodeURIComponent(data.originalSkillName)}`, {
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to update skill';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateRoleSkill,
    isLoading,
    error,
  };
}
