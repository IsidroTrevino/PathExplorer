import { PageNavigation } from './components/PageNavigation';
import { ProjectEmployeeTabs } from './components/ProjectEmployeeTabs';

interface PageProps {
  params: {
    projectId: string;
  };
}

export default async function AvailableEmployeesPage({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageNavigation />
        <ProjectEmployeeTabs projectId={resolvedParams.projectId} />
      </div>
    </div>
  );
}
