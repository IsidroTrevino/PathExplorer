import { useState } from 'react';

export const useR2Storage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadPdfToR2 = async (file: File, employeeId: number) => {
    try {
      setIsUploading(true);
      console.log('🚀 Starting upload process for file:', file.name, 'employee ID:', employeeId);

      // Create progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const next = prev + Math.floor(Math.random() * 15);
          return next > 90 ? 90 : next;
        });
      }, 100);

      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('employeeId', employeeId.toString());

      console.log('📤 Sending upload request to R2 API');

      // Send to our API route that handles R2 upload
      const response = await fetch('/api/r2/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload API error:', response.status, errorText);
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      const fileKey = data.fileKey;

      console.log('✅ File uploaded to R2 successfully, fileKey:', fileKey);

      // Now we'll save file association in database - this needs to use the proper endpoint
      // We don't need to call this here since useCurriculumApi will handle it
      setProgress(100);
      setTimeout(() => {
        setProgress(0);
        setIsUploading(false);
      }, 1000);

      return fileKey;
    } catch (error) {
      console.error('❌ Upload process failed:', error);
      setIsUploading(false);
      setProgress(0);
      throw error;
    }
  };

  const getPdfFromR2 = async (fileKey: string) => {
    console.log('🔍 Fetching PDF with fileKey:', fileKey);
    try {
      const response = await fetch(`/api/r2/download?fileKey=${fileKey}`);

      if (!response.ok) {
        console.error('Download API error:', response.status);
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      console.log('✅ File downloaded successfully');
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('❌ Download process failed:', error);
      throw error;
    }
  };

  const deletePdfFromR2 = async (fileKey: string) => {
    console.log('🗑️ Deleting PDF with fileKey:', fileKey);
    try {
      const response = await fetch(`/api/r2/delete?fileKey=${fileKey}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error('Delete API error:', response.status);
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      console.log('✅ File deleted successfully from R2');
      return true;
    } catch (error) {
      console.error('❌ Delete process failed:', error);
      throw error;
    }
  };

  return {
    uploadPdfToR2,
    getPdfFromR2,
    deletePdfFromR2,
    isUploading,
    progress,
  };
};
