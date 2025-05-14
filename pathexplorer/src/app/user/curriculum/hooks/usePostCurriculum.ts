import { useState } from 'react';

export const useCurriculumApi = () => {
  const [isLoading, setIsLoading] = useState(false);

  const saveFileAssociation = async (fileKey: string, employeeId: number) => {
    try {
      setIsLoading(true);
      console.log('💾 Saving file association:', { fileKey, employeeId });

      // This will get rewritten by Next.js to the proper external URL
      const response = await fetch(`/api/curriculum?curriculum=${fileKey}&employee_id=${employeeId}`, {
        method: 'POST',
        headers: {
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

      // This will get rewritten by Next.js to the proper external URL
      const response = await fetch(`/api/curriculum?employee_id=${employeeId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        console.error('Get file error:', response.status);
        return null;
      }

      const data = await response.json();
      console.log('📄 Got file key from database:', data.file_key);
      return data.file_key;
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
