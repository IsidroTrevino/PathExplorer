import { useState, useEffect, useRef } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useR2Storage } from '@/features/hooks/useR2Storage';

interface EmployeeCurriculumProps {
  curriculumKey: string;
  employeeName: string;
}

export function EmployeeCurriculum({ curriculumKey, employeeName }: EmployeeCurriculumProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getPdfFromR2 } = useR2Storage();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch once
    if (hasFetchedRef.current || !curriculumKey) return;

    const fetchPdf = async () => {
      try {
        setIsLoading(true);
        const url = await getPdfFromR2(curriculumKey);
        setPdfUrl(url);
        hasFetchedRef.current = true;
      } catch (error) {
        console.error('Error fetching PDF:', error);
        setError('Failed to load curriculum');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdf();
  }, [curriculumKey, getPdfFromR2]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${employeeName.replace(/\s+/g, '_')}_CV.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold">Curriculum Vitae</h2>
        </div>
        {pdfUrl && (
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
                Download CV
          </Button>
        )}
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px] bg-gray-50">
            <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[300px] bg-gray-50">
            <p className="text-gray-500">{error}</p>
          </div>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="Employee Curriculum"
            className="w-full h-[800px] bg-gray-50"
          />
        ) : (
          <div className="flex justify-center items-center h-[300px] bg-gray-50">
            <p className="text-gray-500">CV not available</p>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
      </div>
    </div>
  );
}
