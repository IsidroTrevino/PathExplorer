'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useR2Storage } from '@/features/hooks/useR2Storage';
import { useCurriculumApi } from '../hooks/usePostCurriculum';
import { useUser } from '@/features/context/userContext';

interface CurriculumUploadProps {
  className?: string;
  onUploadSuccess?: (fileKey: string) => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const CurriculumUpload: React.FC<CurriculumUploadProps> = ({
  className = '',
  onUploadSuccess,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fetchedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { userDetails } = useUser();
  const { uploadPdfToR2, getPdfFromR2, deletePdfFromR2, isUploading, progress } = useR2Storage();
  const { saveFileAssociation, getEmployeeFile, deleteFileAssociation } = useCurriculumApi();

  const isUserLoaded = !!userDetails?.id || !!userDetails?.employee_id;

  useEffect(() => {
    if (isUserLoaded && !fetchedRef.current) {
      fetchedRef.current = true;

      const employeeId = userDetails?.id || (userDetails?.employee_id as number);
      if (!employeeId) return;

      const fetchCvData = async () => {
        try {

          const existingFileKey = await getEmployeeFile(employeeId);

          if (existingFileKey) {
            setFileKey(existingFileKey);

            const url = await getPdfFromR2(existingFileKey);
            setPdfUrl(url);

            const nameFromKey = existingFileKey.split('/').pop() || 'curriculum.pdf';
            setFileName(nameFromKey);
          }
        } catch {
          toast.error('Could not load your CV');
        }
      };

      fetchCvData();
    }
  }, [isUserLoaded, userDetails, getEmployeeFile, getPdfFromR2]);

  const removeFile = async () => {
    const employeeId = userDetails?.id || (userDetails?.employee_id as number);

    if (!employeeId || !fileKey) return;

    try {
      await deletePdfFromR2(fileKey);
      await deleteFileAssociation(employeeId);

      setPdfUrl(null);
      setFileName(null);
      setFileKey(null);

      if (inputRef.current) inputRef.current.value = '';
      toast.success('CV removed successfully');
    } catch (error) {
      toast.error('Failed to remove CV');
    }
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 2MB limit. Please upload a smaller file.');
      return;
    }

    const employeeId = userDetails?.id || (userDetails?.employee_id as number);

    if (!employeeId) {
      toast.error('Cannot upload: User details not available');
      return;
    }

    try {
      const newFileKey = await uploadPdfToR2(file, employeeId);
      await saveFileAssociation(newFileKey, employeeId);

      const url = await getPdfFromR2(newFileKey);

      setFileKey(newFileKey);
      setPdfUrl(url);
      setFileName(file.name);

      toast.success('CV uploaded successfully');

      if (onUploadSuccess) onUploadSuccess(newFileKey);
    } catch {
      toast.error('Failed to upload CV');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 2MB limit. Please upload a smaller file.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    if (file.type === 'application/pdf') handleUpload(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 2MB limit. Please upload a smaller file.');
      return;
    }

    if (file.type === 'application/pdf') {
      handleUpload(file);
    }
  };

  if (!isUserLoaded) {
    return (
      <section className={`w-full ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Curriculum PDF</h2>
        </div>
        <div className="w-full border-2 border-dashed rounded-lg p-8 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="w-6 h-6 text-purple-600 animate-spin mb-2" />
            <p className="text-gray-500">Loading user data... Please wait</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Curriculum PDF</h2>
      </div>
      {!pdfUrl ? (
        <div
          className={`w-full border-2 cursor-pointer border-dashed rounded-lg p-8 transition-all duration-200 ${
            isDragging
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 bg-gray-50 hover:border-purple-300 hover:bg-purple-50'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 p-3 bg-purple-100 rounded-full">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-700">Drop your CV here</h3>
            <p className="text-gray-500 mb-4">Share your professional experience by uploading your CV</p>

            <input
              type="file"
              accept="application/pdf"
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <div className="w-full bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-md mr-3">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{fileName}</p>
                <p className="text-xs text-gray-500">PDF Document</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              className="text-gray-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>

          <div className="relative">
            <iframe
              src={pdfUrl || ''}
              title="Curriculum PDF"
              className="w-full h-[600px] bg-gray-100"
            />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
          </div>
        </div>
      )}

      {isUploading && (
        <div className="mt-4 w-full">
          <div className="bg-gray-200 rounded-full h-1.5 mb-1">
            <div
              className="bg-purple-600 h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {progress < 100 ? 'Uploading...' : 'Upload complete'}
          </p>
        </div>
      )}
    </section>
  );
};

export default CurriculumUpload;
