import { useGetExpiringCertifications } from '../hooks/useGetExpiringCertifications';
import { ExpiringCertificationCard } from './expiringCertificationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useRef } from 'react';

export function ExpiringCertificationsScroll() {
  const { expiringCertifications, loading, error } = useGetExpiringCertifications();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  if (loading) {
    return (
      <div className="mt-8">
        <div className="flex items-center mb-4">
          <h1 className="text-xl font-semibold">Expiring or expired certifications</h1>
          <div className="ml-auto flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={`skeleton-${i}`} className="min-w-[280px]">
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-600 font-medium">Failed to load expiring certifications</p>
        </div>
      </div>
    );
  }

  if (expiringCertifications.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center mb-4">
        <h1 className="text-xl font-semibold">Expiring or expired certifications</h1>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {expiringCertifications.map(certification => (
          <ExpiringCertificationCard
            key={certification.certification_id}
            certification={certification}
          />
        ))}
      </div>
    </div>
  );
}
