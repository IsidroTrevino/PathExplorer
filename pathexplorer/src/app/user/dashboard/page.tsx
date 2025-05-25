import { PageHeader } from '@/components/GlobalComponents/pageHeader';
import { DashboardContainer } from '@/features/Dashboards/DashboardContainer';

export default function DashboardPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8 max-w-6xl mx-auto">
        <div>
          <PageHeader
            title="Dashboard"
            subtitle="Visualize important information relevant to your role."
          />
          <div className="mt-8">
            <DashboardContainer />
          </div>
        </div>
      </div>
    </div>
  );
}
