'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { generateDashboardPDF } from '../utils/pdfGenerator';
import { useUser } from '@/features/context/userContext';

interface DownloadReportButtonProps {
  dashboardType: 'manager' | 'tfs';
  data: any;
  chartRefs?: Record<string, React.RefObject<HTMLDivElement | null>>;
}

export function DownloadReportButton({
  dashboardType,
  data,
  chartRefs,
}: DownloadReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { userDetails } = useUser();

  const handleDownloadReport = async () => {
    setIsGenerating(true);
    try {
      await generateDashboardPDF(data, dashboardType, chartRefs, userDetails);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownloadReport}
      disabled={isGenerating || !data}
      className="bg-[#7500C0] hover:bg-[#6200a0] text-white"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
              Download Report
        </>
      )}
    </Button>
  );
}
