import { PageHeader } from '@/components/pageHeader';
import { BasicInfoForm } from './components/BasicInfoForm';

export default function BasicInfoPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 pt-8 pb-16">
      <div className="max-w-5xl mx-auto px-8 mb-16">
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
