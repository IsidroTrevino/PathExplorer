import { useState } from 'react';
import { useUser } from '@/features/context/userContext';

export function useDeleteRoleAssignment() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { userAuth } = useUser();

  const deleteRoleAssignment = async (roleId: number | string): Promise<boolean> => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/project-roles/employee/${roleId}`, {
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
      console.error('Error deleting role assignment:', error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, deleteRoleAssignment };
}
