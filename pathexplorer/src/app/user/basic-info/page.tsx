import { PageHeader } from '@/components/pageHeader';
import { BasicInfoForm } from './components/BasicInfoForm';

export default function BasicInfoPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8 max-w-6xl mx-auto">
        <PageHeader
          title="Personal Information"
          subtitle="Fill in and verify your personal information, you can modify it whenever you want."
        />
        <div className="mt-6">
          <BasicInfoForm />
        </div>
      </div>
    </div>
  );
}
