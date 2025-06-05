import { PageHeader } from '@/components/pageHeader';
import { Separator } from '@/components/ui/separator';
import { CurriculumDataProvider } from './components/CurriculumDataProvider';
import TechnicalSkillsSection from './components/TechnicalSkillsSection';
import SoftSkillsSection from './components/SoftSkillsSection';
import GoalsSection from './components/GoalsSection';
import CurriculumUploadSection from './components/CurriculumUploadSection';

export default function CurriculumPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <div className="space-y--8">
          <PageHeader
            title="Curriculum"
            subtitle="Add your curriculum, skills and goals to enhance your profile."
          />
        </div>

        <CurriculumDataProvider>
          <TechnicalSkillsSection />

          <Separator />

          <SoftSkillsSection />

          <Separator />

          <GoalsSection />

          <Separator />

          <CurriculumUploadSection />
        </CurriculumDataProvider>
      </div>
    </div>
  );
}
