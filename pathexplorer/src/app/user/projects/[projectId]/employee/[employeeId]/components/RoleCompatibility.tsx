import { RoleMatch } from '../types/EmployeeProjectTypes';

export function RoleCompatibility({ roleMatches }: { roleMatches: RoleMatch[] }) {
  return (
    <div className="mt-6 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Project Role Compatibility</h2>
      <div className="space-y-4">
        {roleMatches.length > 0 ? (
          roleMatches.map((role) => (
            <div key={role.role_id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{role.name}</h3>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  role.matchPercentage >= 70 ? 'bg-green-100 text-green-800' :
                    role.matchPercentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                }`}>
                  {role.matchPercentage}% Match
                </span>
              </div>
              <p className="text-gray-700 mb-3">{role.description}</p>
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-2">Required Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {role.skills && role.skills.length > 0 ? (
                    role.skills.map((skill, idx) => (
                      <span key={idx} className={`px-2 py-1 text-xs rounded-full ${
                        role.matchedSkills.some(s => s.skill_name.toLowerCase() === (skill.skill_name || '').toLowerCase())
                          ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {skill.skill_name}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No skills defined for this role</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No roles found for this project</p>
            <p className="text-gray-400 mt-2">This project doesn't have any defined roles yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
