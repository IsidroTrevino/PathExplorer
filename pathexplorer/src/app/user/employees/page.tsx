import { PageHeader } from '@/components/GlobalComponents/pageHeader';
import { EmployeeTable } from '@/components/GlobalComponents/employeeTable';

export default function EmployeesPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Employees"
          subtitle="Search through the employees currently registered and visualize their information."
        />

        <div className="mt-8">
          <EmployeeTable />
        </div>
      </div>
    </div>
  );
}
