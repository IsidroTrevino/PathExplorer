'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CurriculumUploadProps {
  className?: string;
  onUploadSuccess?: (pdfBase64: string, fileName: string) => void;
}

const CurriculumUpload: React.FC<CurriculumUploadProps> = ({
  className = '',
  onUploadSuccess,
}) => {
  const [cvPdf, setCvPdf] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const savedPdf = localStorage.getItem('curriculumPDF');
    const savedName = localStorage.getItem('curriculumPDFName');
    if (savedPdf && savedName) {
      setCvPdf(savedPdf);
      setFileName(savedName);
    }
  }, []);

  const handleUpload = (file: File) => {
    if (!file) return;
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const next = prev + Math.floor(Math.random() * 15);
        return next > 90 ? 90 : next;
      });
    }, 100);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      localStorage.setItem('curriculumPDF', base64);
      localStorage.setItem('curriculumPDFName', file.name);
      setCvPdf(base64);
      setFileName(file.name);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setTimeout(() => {
        setUploadProgress(0);
        toast.success('CV uploaded successfully.');
      }, 1000);
      if (onUploadSuccess) onUploadSuccess(base64, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
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
    if (file && file.type === 'application/pdf') {
      handleUpload(file);
    }
  };

  const removeFile = () => {
    localStorage.removeItem('curriculumPDF');
    localStorage.removeItem('curriculumPDFName');
    setCvPdf(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = '';
    toast.info('CV removed successfully.');
  };

  return (
    <section className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Curriculum PDF</h2>
      </div>
      {!cvPdf ? (
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
              src={cvPdf!}
              title="Curriculum PDF"
              className="w-full h-[600px] bg-gray-100"
            />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
          </div>

          <div className="p-4 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-1 bg-green-100 rounded-full mr-2">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-green-700 font-medium">CV uploaded successfully</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              <Upload className="w-4 h-4" /> Replace
            </Button>
          </div>
        </div>
      )}

      {uploadProgress > 0 && (
        <div className="mt-4 w-full">
          <div className="bg-gray-200 rounded-full h-1.5 mb-1">
            <div
              className="bg-purple-600 h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {uploadProgress < 100 ? 'Uploading...' : 'Upload complete'}
          </p>
        </div>
      )}
    </section>
  );
};

export default CurriculumUpload;
