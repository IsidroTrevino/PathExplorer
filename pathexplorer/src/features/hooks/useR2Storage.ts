import { useState } from 'react';

export const useR2Storage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadPdfToR2 = async (file: File, employeeId: number) => {
    try {
      setIsUploading(true);

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const next = prev + Math.floor(Math.random() * 15);
          return next > 90 ? 90 : next;
        });
      }, 100);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('employeeId', employeeId.toString());

      const response = await fetch('/api/r2/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      const fileKey = data.fileKey;

      setProgress(100);
      setTimeout(() => {
        setProgress(0);
        setIsUploading(false);
      }, 1000);

      return fileKey;
    } catch (error) {
      setIsUploading(false);
      setProgress(0);
      throw error;
    }
  };

  const getPdfFromR2 = async (fileKey: string) => {
    try {
      const response = await fetch(`/api/r2/download?fileKey=${fileKey}`);

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      throw error;
    }
  };

  const deletePdfFromR2 = async (fileKey: string) => {
    try {
      const response = await fetch(`/api/r2/delete?fileKey=${fileKey}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      return true;
    } catch (error) {
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
