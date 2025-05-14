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
      console.log('💾 Saving file association:', { fileKey, employeeId });

      const token = userAuth?.accessToken || getAuthToken();
      if (!token) {
        console.error('No authentication token found');
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
        console.error('DB save error:', response.status, errorText);
        throw new Error('Failed to save file association');
      }

      console.log('✅ File association saved in database');
      return await response.json();
    } catch (error) {
      console.error('❌ Database save failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeeFile = async (employeeId: number) => {
    try {
      setIsLoading(true);
      console.log('🔍 Getting file for employee:', employeeId);

      const token = userAuth?.accessToken || getAuthToken();
      if (!token) {
        console.error('No authentication token found');
        return null;
      }

      const response = await fetch(`/api/curriculum?employee_id=${employeeId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Get file error:', response.status);
        return null;
      }

      const data = await response.json();
      console.log('📄 Got response from database:', data);

      // Check if data is an array and has at least one item
      if (Array.isArray(data) && data.length > 0) {
        console.log('📄 Found file key:', data[0].file_key);
        return data[0].file_key;
      } else {
        console.log('⚠️ No file found in response:', data);
        return null;
      }
    } catch (error) {
      console.error('❌ Get file failed:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveFileAssociation,
    getEmployeeFile,
    isLoading,
  };
};
