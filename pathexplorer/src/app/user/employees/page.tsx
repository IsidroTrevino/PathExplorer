import { PageHeader } from '@/components/GlobalComponents/pageHeader';

export default function EmployeesPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex-1 p-8 max-w-5xl mx-16">
        <PageHeader
          title="Employees"
          subtitle="Search through the employees currently registered and visualize their information."
        />
      </div>
      <div className="flex-grow p-4">
      </div>
    </div>
  );
}
