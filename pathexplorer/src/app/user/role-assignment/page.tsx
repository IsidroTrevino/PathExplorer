import { PageHeader } from '@/components/pageHeader';
import { AssignmentsContainer } from './components/AssignmentsContainer';

export default function AssignmentsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8 max-w-6xl mx-auto">
        <div className="space-y--8">
          <PageHeader
            title="Project Requests"
            subtitle="Approve and manage project requests from employees."
          />
        </div>

        <AssignmentsContainer />
      </div>
    </div>
  );
}
