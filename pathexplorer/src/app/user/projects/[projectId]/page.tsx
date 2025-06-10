import { PageNavigation } from './components/PageNavigation';
import { ProjectEmployeeTabs } from './components/ProjectEmployeeTabs';
import { decryptId } from '@/lib/utils/idEncryption';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function AvailableEmployeesPage({ params }: PageProps) {
  try {
    const resolvedParams = await params;
    const decodedProjectId = decryptId(resolvedParams.projectId);

    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageNavigation />
          <ProjectEmployeeTabs projectId={decodedProjectId.toString()} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error decrypting project ID:', error);
    return notFound();
  }
}
