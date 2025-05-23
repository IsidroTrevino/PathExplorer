'use client';

import { Button } from '@/components/ui/button';
import { useGetAIRecommendations } from '../hooks/useGetAIRecommendations';
import { RefreshCw, BrainCircuit, Lightbulb, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function AIRecommendationsSection() {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, loading, error, refetch } = useGetAIRecommendations();

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
            <BrainCircuit className="h-5 w-5 text-[#7500C0]" />
              AI Career Recommendations
          </h2>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="bg-[#f9f0ff] p-6 rounded-full mb-4">
            <Lightbulb className="h-12 w-12 text-[#7500C0]" />
          </div>
          <h3 className="text-lg font-medium mb-2">Get Career Guidance</h3>
          <p className="text-gray-600 mb-6 max-w-md">
              Receive personalized recommendations to improve your professional growth based on your experience and skills.
          </p>
          <Button
            onClick={handleGetRecommendations}
            className="bg-[#7500C0] hover:bg-[#6200a0] text-white px-6"
          >
            <BrainCircuit className="h-4 w-4 mr-2" />
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
            <BrainCircuit className="h-5 w-5 text-[#7500C0]" />
              AI Career Recommendations
          </h2>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-[#f9f0ff] px-4 py-2 rounded-full flex items-center">
              <RefreshCw className="h-4 w-4 text-[#7500C0] mr-2 animate-spin" />
              <span className="text-sm text-[#7500C0] font-medium">Generating recommendations...</span>
            </div>
          </div>
          <div>
            <Skeleton className="h-24 w-full mb-6 rounded-md" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={`skeleton-${i}`} className="rounded-lg border p-4">
                  <Skeleton className="h-5 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
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
            <BrainCircuit className="h-5 w-5 text-[#7500C0]" />
              AI Career Recommendations
          </h2>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
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

  if ((!data || !data.feedback || data.feedback.length === 0) && shouldFetch) {
    return (
      <div className="mt-8 bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-[#7500C0]" />
              AI Career Recommendations
          </h2>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
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

  if (data && data.feedback && data.feedback.length > 0 && shouldFetch) {
    return (
      <div className="mt-8 bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-[#7500C0]" />
              AI Career Recommendations
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
          <div className="rounded-lg border bg-card p-5 mb-5">
            <p className="text-gray-700">{data.message}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.feedback.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-[#7500C0] mb-2">{item.action}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-[#7500C0]" />
            AI Career Recommendations
        </h2>
      </div>
      <div className="p-8 flex flex-col items-center justify-center text-center">
        <div className="bg-[#f9f0ff] p-6 rounded-full mb-4">
          <Lightbulb className="h-12 w-12 text-[#7500C0]" />
        </div>
        <h3 className="text-lg font-medium mb-2">Get Career Guidance</h3>
        <p className="text-gray-600 mb-6 max-w-md">
            Receive personalized recommendations to improve your professional growth based on your experience and skills.
        </p>
        <Button
          onClick={handleGetRecommendations}
          className="bg-[#7500C0] hover:bg-[#6200a0] text-white px-6"
        >
          <BrainCircuit className="h-4 w-4 mr-2" />
            Generate Recommendations
        </Button>
      </div>
    </div>
  );
}
