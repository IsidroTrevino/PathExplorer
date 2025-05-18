import { useState } from 'react';
import { useUser } from '@/features/context/userContext';
import { toast } from 'sonner';

interface RequestEmployeeParams {
  developer_id: number;
  project_role_id: number;
  project_id: number;
  comments?: string;
}

export function useRequestEmployee() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userAuth } = useUser();

  const requestEmployee = async (params: RequestEmployeeParams): Promise<boolean> => {
    setIsSubmitting(true);

    try {
      const requestBody = {
        tfs_id: null,
        developer_id: params.developer_id,
        project_role_id: params.project_role_id,
        project_id: params.project_id,
        comments: params.comments || '',
      };

      console.log('Request payload:', requestBody);

      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userAuth?.accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        toast.error('Failed to submit request', {
          description: errorData.message || 'Something went wrong. Please try again.',
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting employee:', error);
      toast.error('Error', {
        description: 'Failed to submit request. Please try again.',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, requestEmployee };
}
