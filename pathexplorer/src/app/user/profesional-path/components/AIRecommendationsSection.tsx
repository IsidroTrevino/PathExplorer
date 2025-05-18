'use client';

import { Button } from '@/components/ui/button';
import { useGetAIRecommendations } from '../hooks/useGetAIRecommendations';
import { Loader2, RefreshCw, BrainCircuit } from 'lucide-react';
import { useState, useEffect } from 'react';

export function AIRecommendationsSection() {
  const { data, loading, error, refetch } = useGetAIRecommendations();
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  useEffect(() => {
    if (data && !hasInitialFetch) {
      setHasInitialFetch(true);
    }
  }, [data, hasInitialFetch]);

  const handleFetchRecommendations = () => {
    setHasInitialFetch(true);
    refetch();
  };

  const shouldShowData = hasInitialFetch && data;

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">AI Career Recommendations</h2>
        <Button
          onClick={handleFetchRecommendations}
          variant="outline"
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
                            Loading...
            </>
          ) : (
            <>
              {shouldShowData ? (
                <RefreshCw className="h-4 w-4" />
              ) : (
                <BrainCircuit className="h-4 w-4" />
              )}
              {shouldShowData ? 'Refresh Recommendations' : 'Get AI Recommendations'}
            </>
          )}
        </Button>
      </div>

      {hasInitialFetch && error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {shouldShowData && (
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <p className="text-card-foreground">{data.message}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {data.feedback.map((item, index) => (
              <div key={index} className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-[#7500C0]">{item.action}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!shouldShowData && !loading && (
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-muted-foreground">Click the button to get personalized AI recommendations for your career path.</p>
        </div>
      )}
    </div>
  );
}
