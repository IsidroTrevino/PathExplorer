import { AIRecommendationsSection } from './AIRecommendationsSection';
import { ExperienceItem, Experience } from './ExperienceItem';
import type { RoleLog } from '../types/profesionalPath';

interface ExperienceTimelineProps {
    roles: RoleLog[];
}

export function ExperienceTimeline({ roles }: ExperienceTimelineProps) {
  const experiences: Experience[] = roles.map((r: RoleLog) => ({
    date: r.approval_date,
    title: r.role_name,
    company: r.project_name,
    description: r.role_feedback,
  }));

  return (
    <>
      <div className="relative space-y-16">
        <div className="absolute top-0 bottom-0 left-8 w-1 bg-gradient-to-b from-purple-300 to-purple-100 rounded-full z-0" />
        {experiences.map((exp, idx) => (
          <ExperienceItem key={idx} exp={exp} idx={idx} />
        ))}
      </div>

      {/* AI Section */}
      <div className="mt-12">
        <AIRecommendationsSection />
      </div>
    </>
  );
}
