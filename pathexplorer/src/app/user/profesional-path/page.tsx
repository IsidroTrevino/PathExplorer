// src/components/ProfessionalPathPage.tsx
'use client';

import { PageHeader } from '@/components/GlobalComponents/pageHeader';
import { ExperienceItem, Experience } from './components/ExperienceItem';
import { useGetRoles } from './hooks/useGetRoles';
import type { RoleLog } from './types/profesionalPath';

export default function ProfessionalPathPage() {
  const { data: roles, loading, error } = useGetRoles();

  if (loading) return <p>Cargando roles anteriores...</p>;
  if (error)   return <p className="text-red-500">Error: {error}</p>;

  const experiences: Experience[] = roles.map((r: RoleLog) => ({
    date:         r.approval_date,
    title:        r.role_name,
    company:      r.project_name,
    description:  r.role_feedback,
  }));

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PageHeader
          title="Professional Path"
          subtitle="Visualiza tu historial de roles y tu crecimiento profesional."
        />

        <div className="relative mt-12">
          {/* Línea vertical */}
          <div className="absolute top-0 bottom-0 left-8 w-1 bg-gradient-to-b from-purple-300 to-purple-100 rounded-full z-0" />

          {/* Eventos */}
          <div className="space-y-16">
            {experiences.map((exp, idx) => (
              <ExperienceItem key={idx} exp={exp} idx={idx} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
