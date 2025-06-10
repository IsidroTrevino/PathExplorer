import { EmployeeInfoProvider } from './components/EmployeeInfoProvider';
import { decryptId } from '@/lib/utils/idEncryption';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    projectId: string;
    employeeId: string;
  }>;
}

export default async function EmployeeRoleComparisonPage({ params }: PageProps) {
  try {
    const resolvedParams = await params;
    const decodedProjectId = decryptId(resolvedParams.projectId);
    const decodedEmployeeId = decryptId(resolvedParams.employeeId);

    return (
      <EmployeeInfoProvider
        projectId={decodedProjectId.toString()}
        employeeId={decodedEmployeeId.toString()}
      />
    );
  } catch (error) {
    console.error('Error decrypting IDs:', error);
    return notFound();
  }
}
