import { useState } from 'react';
import { useUser } from '@/features/context/userContext';

export function useDeleteRoleSkill() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { userAuth } = useUser();

  const deleteRoleSKill = async (roleId: number | string, skill_name: string): Promise<boolean> => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/project-roles/${roleId}/skills/${skill_name}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userAuth?.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting project role:', error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, deleteRoleSKill };
}
