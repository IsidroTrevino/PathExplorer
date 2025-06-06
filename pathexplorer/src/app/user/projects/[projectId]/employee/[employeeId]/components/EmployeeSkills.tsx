import { Employee } from '../types/EmployeeProjectTypes';

export function EmployeeSkills({ employee }: { employee: Employee }) {
  return (
    <div className="mt-6 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-2">Hard Skills</h3>
          {employee.skills.filter(s => s.type === 'hard').map(skill => (
            <div key={skill.skill_id} className="mb-3">
              <div className="flex justify-between mb-1">
                <span>{skill.skill_name}</span>
                <span>{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
          {!employee.skills.length || employee.skills.filter(s => s.type === 'hard').length === 0 && (
            <p className="text-gray-500">No hard skills found</p>
          )}
        </div>
        <div>
          <h3 className="font-medium mb-2">Soft Skills</h3>
          {employee.skills.filter(s => s.type === 'soft').map(skill => (
            <div key={skill.skill_id} className="mb-3">
              <div className="flex justify-between mb-1">
                <span>{skill.skill_name}</span>
                <span>{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
          {!employee.skills.length || employee.skills.filter(s => s.type === 'soft').length === 0 && (
            <p className="text-gray-500">No soft skills found</p>
          )}
        </div>
      </div>
    </div>
  );
}
