// src/app/user/projects/page.tsx
import { PageHeader } from '@/components/pageHeader';
import { Projects } from './components/Projects';

export default function ProjectsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <PageHeader
          title="Projects"
          subtitle="Create new projects for the company and review assigned employees."
        />

        <Projects />
      </div>
    </div>
  );
}
