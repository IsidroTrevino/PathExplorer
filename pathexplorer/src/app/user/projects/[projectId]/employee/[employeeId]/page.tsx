import { EmployeeInfoProvider } from './components/EmployeeInfoProvider';

interface PageProps {
  params: Promise<{
    projectId: string;
    employeeId: string;
  }>;
}

export default async function EmployeeRoleComparisonPage({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <EmployeeInfoProvider
      projectId={resolvedParams.projectId}
      employeeId={resolvedParams.employeeId}
    />
  );
}
