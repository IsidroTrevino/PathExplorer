'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/pageHeader';
import { ExperienceItem, Experience } from './components/ExperienceItem';
import { LoadingTimeline } from './components/LoadingTimeline';
import { useGetRoles } from './hooks/useGetRoles';
import { useGetFutureRoles } from './hooks/useGetFutureRoles';
import EmptyView from '@/components/EmptyView';
import { AlertCircleIcon } from 'lucide-react';
import { ViewPicker } from './components/ViewPicker';
import { AIRecommendationsTimeline } from './components/AIRecommendationsTimeline';
import { AIRecommendationsSection } from './components/AIRecommendationsSection';
import type { RoleLog } from './types/profesionalPath';

export default function ProfessionalPathPage() {
  const [view, setView] = useState<'experience' | 'recommendations'>('experience');

  const { data: roles, loading: loadingRoles, error: errorRoles } = useGetRoles();
  const { data: recommendations, loading: loadingRecs, error: errorRecs } = useGetFutureRoles();

  const isLoading = view === 'experience' ? loadingRoles : loadingRecs;
  const hasError = view === 'experience' ? errorRoles : errorRecs;

  const containerClasses = 'max-w-6xl mx-auto p-8 space-y-8';

  const experiences: Experience[] = roles.map((r: RoleLog) => ({
    date: r.approval_date,
    title: r.role_name,
    company: r.project_name,
    description: r.role_feedback,
  }));

  return (
    <div className="flex-1 overflow-y-auto">
      <div className={containerClasses}>
        <div className="space-y--8">
          <PageHeader
            title="Professional Path"
            subtitle="Visualiza tu camino profesional dentro de la empresa o descubre tus futuras oportunidades"
          />
        </div>

        <div className="mt-[-20px]">
          <ViewPicker value={view} onChange={(val) => val && setView(val)} />
        </div>

        {/* Loading */}
        {isLoading && <LoadingTimeline count={4} />}

        {/* Error */}
        {!isLoading && hasError && (
          <EmptyView
            icon={<AlertCircleIcon className="w-12 h-12 text-purple-600" />}
            message="No hay datos disponibles"
          />
        )}

        {/* Timeline de experiencia */}
        {!isLoading && !hasError && view === 'experience' && (
          <>
            <div className="relative space-y-16">
              <div className="absolute top-0 bottom-0 left-8 w-1 bg-gradient-to-b from-purple-300 to-purple-100 rounded-full z-0" />
              {experiences.map((exp, idx) => (
                <ExperienceItem key={idx} exp={exp} idx={idx} />
              ))}
            </div>

            {/* AI Section SOLO para experiencia */}
            <div className="mt-12">
              <AIRecommendationsSection />
            </div>
          </>
        )}

        {/* Timeline de recomendaciones AI */}
        {!isLoading && !hasError && view === 'recommendations' && (
          <AIRecommendationsTimeline data={recommendations} />
        )}
      </div>
    </div>
  );
}
