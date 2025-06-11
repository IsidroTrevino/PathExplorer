import { EmployeePersonalInfo } from './EmployeePersonalInfo';
import { EmployeeProjectHistory } from './EmployeeProjectHistory';
import { EmployeeGoals } from './EmployeeGoals';
import { EmployeeCertifications } from './EmployeeCertifications';
import { EmployeeCurriculum } from './EmployeeCurriculum';
import { EmployeeSkills } from './EmployeeSkills';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Employee } from '../types/EmployeeTypes';

interface EmployeeProfileContainerProps {
    employeeData: Employee;
}

interface EmployeeProfileContainerProps {
    employeeData: Employee;
    refetchEmployeeData: () => void;
}

export function EmployeeProfileContainer({ employeeData, refetchEmployeeData }: EmployeeProfileContainerProps) {
  const router = useRouter();
  const initials = `${employeeData.name?.[0] || ''}${employeeData.last_name_1?.[0] || ''}`;
  const fullName = `${employeeData.name} ${employeeData.last_name_1} ${employeeData.last_name_2 || ''}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 overflow-y-auto">
      <Button
        variant="ghost"
        className="mb-4 text-gray-600 hover:text-gray-900"
        onClick={() => router.back()}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Employees
      </Button>

      {/* Rest of component remains the same */}

      <div className="space-y-6 w-full">
        <EmployeePersonalInfo employee={employeeData} />
        <EmployeeProjectHistory
          projects={employeeData.project_history}
          onFeedbackUpdated={refetchEmployeeData}
        />
        <EmployeeGoals goals={employeeData.goals} />
        <EmployeeSkills skills={employeeData.skills} />
        <EmployeeCertifications certifications={employeeData.certifications} />
        {employeeData.curriculum_url && (
          <EmployeeCurriculum
            curriculumKey={employeeData.curriculum_url}
            employeeName={fullName}
          />
        )}
      </div>
    </div>
  );
}
