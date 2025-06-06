import { PageHeader } from '@/components/pageHeader';
import { CertificationsContainer } from './components/CertificationsContainer';

export default function CertificationsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        <PageHeader
          title="Certifications"
          subtitle="Track your completed courses and certifications. Stay up to date with your professional development."
        />

        <CertificationsContainer />
      </div>
    </div>
  );
}
