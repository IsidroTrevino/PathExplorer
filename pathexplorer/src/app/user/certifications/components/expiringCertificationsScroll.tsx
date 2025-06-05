import { useGetExpiringCertifications } from '../hooks/useGetExpiringCertifications';
import { ExpiringCertificationCard } from './expiringCertificationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { useUser } from '@/features/context/userContext';

interface ExpiringCertificationsScrollProps {
  isLoading?: boolean;
  refreshTrigger?: number;
}

export function ExpiringCertificationsScroll({
  isLoading = false,
  refreshTrigger = 0,
}: ExpiringCertificationsScrollProps) {
  const { expiringCertifications, loading: apiLoading, error, refetch } = useGetExpiringCertifications(false); // Don't fetch on mount
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { userAuth } = useUser();

  const loading = isLoading || apiLoading;

  useEffect(() => {
    if (userAuth?.accessToken) {
      refetch();
    }
  }, [refreshTrigger, userAuth?.accessToken, refetch]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Expiring Certifications</h2>
        {!loading && expiringCertifications.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-1 rounded-full bg-white border border-gray-300 hover:bg-gray-50"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1 rounded-full bg-white border border-gray-300 hover:bg-gray-50"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-4 flex space-x-8 overflow-x-auto">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={`skeleton-${i}`} className="h-40 w-80 flex-shrink-0 rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-500">
          <AlertCircle className="h-5 w-5 mx-auto mb-2" />
              Failed to load expiring certifications
        </div>
      ) : expiringCertifications.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
              No expiring certifications found
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="p-4 flex space-x-8 overflow-x-auto"
        >
          {expiringCertifications.map(certification => (
            <div key={certification.certification_id} className="flex-shrink-0 w-80">
              <ExpiringCertificationCard certification={certification} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
