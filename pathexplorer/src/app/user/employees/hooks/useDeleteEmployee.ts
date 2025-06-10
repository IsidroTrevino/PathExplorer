import { useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '@/features/context/userContext';

export function useDeleteEmployee() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { userAuth } = useUser();

  const deleteEmployee = async (employeeId: number) => {
    if (isDeleting) return false;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/delete/auth/employee/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userAuth?.accessToken}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('Server response:', errorText);
        throw new Error(`Failed to delete employee: ${response.status}`);
      }

      toast.success('Employee deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete employee');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteEmployee, isDeleting };
}
