import { useGetAICertificationRecommendations } from './useGetAICertificationRecommendation';
import { RecommendedCertificationCard } from './recommendedCertificationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw, Award } from 'lucide-react';

export function RecommendedCertifications() {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, loading, error, refetch } = useGetAICertificationRecommendations();

  useEffect(() => {
    if (!shouldFetch && loading) {
      refetch();
    }
  }, [loading, shouldFetch, refetch]);

  const handleGetRecommendations = () => {
    setShouldFetch(true);
    refetch();
  };

  if (!shouldFetch) {
    return (
      <div className="mt-8 bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-[#7500C0]" />
                        AI Recommended Certifications
          </h2>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="bg-[#f9f0ff] p-6 rounded-full mb-4">
            <Award className="h-12 w-12 text-[#7500C0]" />
          </div>
          <h3 className="text-lg font-medium mb-2">Discover Your Next Certification</h3>
          <p className="text-gray-600 mb-6 max-w-md">
                        Get personalized certification recommendations based on your skills, experience, and career goals.
          </p>
          <Button
            onClick={handleGetRecommendations}
            className="bg-[#7500C0] hover:bg-[#6200a0] text-white px-6"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
                        Generate Recommendations
          </Button>
        </div>
      </div>
    );
  }

  if (loading && shouldFetch) {
    return (
      <div className="mt-8 bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-[#7500C0]" />
                        AI Recommended Certifications
          </h2>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-[#f9f0ff] px-4 py-2 rounded-full flex items-center">
              <RefreshCw className="h-4 w-4 text-[#7500C0] mr-2 animate-spin" />
              <span className="text-sm text-[#7500C0] font-medium">Generating recommendations...</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(3).fill(0).map((_, i) => (
              <div key={`skeleton-${i}`} className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <Skeleton className="h-5 w-[180px]" />
                  <Skeleton className="h-4 w-[60px] rounded-full ml-2" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5 mb-2" />
                <Skeleton className="h-4 w-3/5 mb-4" />
                <div className="mt-auto">
                  <Skeleton className="h-6 w-[120px] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && shouldFetch) {
    return (
      <div className="mt-8 bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-[#7500C0]" />
                        AI Recommended Certifications
          </h2>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <p className="text-gray-600 mb-4">No recommendations available for you right now</p>
          <Button
            onClick={handleGetRecommendations}
            className="bg-[#7500C0] hover:bg-[#6200a0] text-white"
          >
                        Try Again
          </Button>
        </div>
      </div>
    );
  }

  if ((!data || data.certifications.length === 0) && shouldFetch) {
    return (
      <div className="mt-8 bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-[#7500C0]" />
                        AI Recommended Certifications
          </h2>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <p className="text-gray-600 mb-4">No certification recommendations available</p>
          <Button
            onClick={handleGetRecommendations}
            className="bg-[#7500C0] hover:bg-[#6200a0] text-white"
          >
                        Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-[#7500C0]" />
                    AI Recommended Certifications
        </h2>
        <Button
          onClick={handleGetRecommendations}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
                    Refresh
        </Button>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.certifications.map((certification, index) => (
            <RecommendedCertificationCard
              key={`${certification.name}-${index}`}
              certification={certification}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
