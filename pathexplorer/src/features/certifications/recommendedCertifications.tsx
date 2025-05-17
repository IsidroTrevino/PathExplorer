import { useGetAICertificationRecommendations } from './useGetAICertificationRecommendation';
import { RecommendedCertificationCard } from './recommendedCertificationCard';
import { Skeleton } from '@/components/ui/skeleton';

export function RecommendedCertifications() {
  const { data, loading, error } = useGetAICertificationRecommendations();

  if (loading) {
    return (
      <div className="mt-6">
        <h1 className="text-xl font-semibold mb-4">AI Recommended certifications</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(3).fill(0).map((_, i) => (
            <div key={`skeleton-${i}`} className="min-w-[320px] p-5 border border-gray-300 rounded-lg bg-white shadow-sm flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <Skeleton className="h-5 w-[180px]" />
                <Skeleton className="h-4 w-[60px] rounded ml-2" />
              </div>

              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5 mb-4" />

              <div className="mt-auto">
                <Skeleton className="h-6 w-[120px] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm mt-6">
        <p className="text-red-600">Error loading recommendations</p>
      </div>
    );
  }

  if (!data || data.certifications.length === 0) {
    return (
      <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm mt-6">
        <p className="text-gray-600">No certification recommendations available</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h1 className="text-xl font-semibold mb-4">AI Recommended certifications</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.certifications.map((certification, index) => (
          <RecommendedCertificationCard
            key={`${certification.name}-${index}`}
            certification={certification}
          />
        ))}
      </div>
    </div>
  );
}
