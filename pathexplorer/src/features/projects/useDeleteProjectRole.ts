import { useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '@/features/context/userContext';

export function useDeleteProjectRole() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { userAuth } = useUser();

  const deleteProjectRole = async (roleId: number | string): Promise<boolean> => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/project-roles/${roleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userAuth?.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        toast.error('Failed to delete role', {
          description: errorData.message || 'Something went wrong. Please try again.',
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting project role:', error);
      toast.error('Error', {
        description: 'Failed to delete role. Please try again.',
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, deleteProjectRole };
}
