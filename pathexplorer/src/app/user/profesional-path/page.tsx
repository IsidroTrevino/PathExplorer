"use client";

import { PageHeader } from "@/components/GlobalComponents/pageHeader";
import { ExperienceItem, Experience } from "./components/ExperienceItem";
import { LoadingTimeline } from "./components/LoadingTimeline";
import { useGetRoles } from "./hooks/useGetRoles";
import type { RoleLog } from "./types/profesionalPath";
import { AlertCircleIcon } from "lucide-react";
import EmptyView from "@/components/GlobalComponents/EmptyView";

export default function ProfessionalPathPage() {
  const { data: roles, loading, error } = useGetRoles();
  const containerClasses = "max-w-6xl mx-auto p-8 space-y-8";

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className={containerClasses}>
          <div className="space-y--8">
            <PageHeader
              title="Professional Path"
              subtitle="Visualize your professional path and the roles you have played in the company."
            />
          </div>
          <LoadingTimeline count={4} />
        </div>
      </div>
    );
  }

  {/* No roles */}
  if (error) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className={containerClasses}>
          <div className="space-y--8">
            <PageHeader
              title="Professional Path"
              subtitle="Visualize your professional path and the roles you have played in the company."
            />
          </div>

          <EmptyView
            icon={<AlertCircleIcon className="w-12 h-12 text-purple-600" />}
            message="No hay roles asignados para ti"
          />
        </div>
      </div>
    );
  }

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
            subtitle="Visualize your professional path and the roles you have played in the company."
          />
        </div>
        
        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute top-0 bottom-0 left-8 w-1 bg-gradient-to-b from-purple-300 to-purple-100 rounded-full z-0" />

          {/* Puestos */}
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
