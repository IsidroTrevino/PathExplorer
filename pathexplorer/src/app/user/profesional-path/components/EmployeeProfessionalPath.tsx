'use client';

import { useState } from 'react';
import { LoadingTimeline } from './LoadingTimeline';
import { useGetRoles } from '../hooks/useGetRoles';
import { useGetFutureRoles } from '../hooks/useGetFutureRoles';
import { ViewPicker } from './ViewPicker';
import { ExperienceTimeline } from './ExperienceTimeline';
import { AIRecommendationsTimeline } from './AIRecommendationsTimeline';
import { ErrorView } from './ErrorView';

export function EmployeeProfessionalPath() {
  const [view, setView] = useState<'experience' | 'recommendations'>('experience');

  const { data: roles, loading: loadingRoles, error: errorRoles } = useGetRoles();
  const { data: recommendations, loading: loadingRecs, error: errorRecs } = useGetFutureRoles();

  const isLoading = view === 'experience' ? loadingRoles : loadingRecs;
  const hasError = view === 'experience' ? errorRoles : errorRecs;

  return (
    <>
      <div className="mt-[20px] mb-8 flex items-center justify-between">
        <ViewPicker value={view} onChange={(val: 'experience' | 'recommendations') => setView(val)} />
      </div>

      {isLoading && <LoadingTimeline count={4} />}

      {!isLoading && hasError && <ErrorView />}

      {!isLoading && !hasError && view === 'experience' && (
        <ExperienceTimeline roles={roles} />
      )}

      {!isLoading && !hasError && view === 'recommendations' && (
        <AIRecommendationsTimeline data={recommendations} />
      )}
    </>
  );
}
