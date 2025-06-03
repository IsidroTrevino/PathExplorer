import { CertificationItem } from '@/features/certifications/types';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecommendedCertificationCardProps {
    certification: CertificationItem;
}

export function RecommendedCertificationCard({ certification }: RecommendedCertificationCardProps) {
  return (
    <div className="min-w-[320px] p-5 border border-gray-300 rounded-lg bg-white shadow-sm flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-gray-900">{certification.name}</h3>
        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded ml-2 whitespace-nowrap">
          {certification.type}
        </span>
      </div>

      {certification.description && (
        <p className="text-xs text-gray-600 mb-4">
          {certification.description}
        </p>
      )}

      <div className="mt-auto">
        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2 bg-blue-50 text-blue-700">
          <div className="h-1.5 w-1.5 rounded-full mr-1.5 bg-blue-500" />
                    Recommended
        </div>

        {certification.url && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={() => window.open(certification.url, '_blank', 'noopener,noreferrer')}
          >
            <ExternalLink className="h-3 w-3 mr-2" />
                        View Certification
          </Button>
        )}
      </div>
    </div>
  );
}
