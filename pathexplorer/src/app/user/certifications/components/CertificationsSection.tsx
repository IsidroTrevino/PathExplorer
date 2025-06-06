import { CertificationCard } from './certificationCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Certification } from '../types/CertificationTypes';

interface CertificationsSectionProps {
    certifications: Certification[];
    loading: boolean;
    error: string | null;
    onUpdateOpen: (certification: Certification) => void;
}

export function CertificationsSection({
  certifications,
  loading,
  error,
  onUpdateOpen,
}: CertificationsSectionProps) {
  return (
    <div className="bg-white rounded-lg border shadow-sm h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">My Certifications</h2>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {loading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={`skeleton-${i}`} className="p-4 border-b border-gray-100">
              <div className="flex items-center">
                <Skeleton className="h-3 w-3 rounded-full mr-4" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-[200px] mb-2" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
                <Skeleton className="h-4 w-[60px]" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : certifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
                        No certifications found. Add your first certificate to get started.
          </div>
        ) : (
          certifications.map(certification => (
            <CertificationCard
              key={certification.certification_id}
              certification={certification}
              onClick={onUpdateOpen}
            />
          ))
        )}
      </div>
    </div>
  );
}
