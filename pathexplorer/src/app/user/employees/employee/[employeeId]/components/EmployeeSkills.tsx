// src/app/employees/employee/components/EmployeeSkills.tsx
import { SkillCard } from '@/app/user/curriculum/components/SkillCard';

export function EmployeeSkills({ skills }) {
  const hardSkills = skills.filter(skill => skill.type === 'hard');
  const softSkills = skills.filter(skill => skill.type === 'soft');

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Skills</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Hard Skills</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {hardSkills.map(skill => (
              <SkillCard
                key={skill.skill_id}
                skill_name={skill.skill_name}
                level={skill.level}
                iconType="hard"
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Soft Skills</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {softSkills.map(skill => (
              <SkillCard
                key={skill.skill_id}
                skill_name={skill.skill_name}
                level={skill.level}
                iconType="soft"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
