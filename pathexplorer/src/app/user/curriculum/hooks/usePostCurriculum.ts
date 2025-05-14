import { useState } from 'react';
import { useUser } from '@/features/context/userContext';

const getAuthToken = () => {
  return typeof window !== 'undefined'
    ? localStorage.getItem('token')
    : null;
};

export const useCurriculumApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { userAuth } = useUser();

  const saveFileAssociation = async (fileKey: string, employeeId: number) => {
    try {
      setIsLoading(true);

      const token = userAuth?.accessToken || getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/curriculum?curriculum=${fileKey}&employee_id=${employeeId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Failed to save file association');
      }

      return await response.json();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeeFile = async (employeeId: number) => {
    try {
      setIsLoading(true);

      const token = userAuth?.accessToken || getAuthToken();
      if (!token) {
        return null;
      }

      const response = await fetch(`/api/curriculum?employee_id=${employeeId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        return data[0].file_key;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFileAssociation = async (employeeId: number) => {
    try {
      setIsLoading(true);

      const token = userAuth?.accessToken || getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/curriculum?employee_id=${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Failed to delete file association');
      }

      return await response.json();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveFileAssociation,
    getEmployeeFile,
    deleteFileAssociation,
    isLoading,
  };
};
