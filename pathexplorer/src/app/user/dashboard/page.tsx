import { PageHeader } from '@/components/GlobalComponents/pageHeader';

export default function DashboardPage () {

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8 max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="space-y--8">
          <PageHeader
            title="Dashboard"
            subtitle="Visualice important information about all the employees in the company."
          />
        </div>
      </div>
    </div>
  );
}

