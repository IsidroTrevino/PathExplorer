import { PageHeader } from '@/components/pageHeader';
import { EmployeeProfessionalPath } from './components/EmployeeProfessionalPath';

export default function ProfessionalPathPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        <PageHeader
          title="Professional Path"
          subtitle="Visualize your professional journey within the company or discover your future opportunities"
        />

        <EmployeeProfessionalPath />
      </div>
    </div>
  );
}
