// src/app/user/projects/[projectId]/employee/[employeeId]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/GlobalComponents/pageHeader';
import { useGetEmployeeProfile } from '@/features/user/useGetEmployeeProfile';
import { useGetProject } from '@/features/projects/useGetProject';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader } from 'lucide-react';

interface RoleSkill {
  skill_name: string;
  type: string;
  level: number;
}

interface EmployeeSkill {
  skill_id: number;
  skill_name: string;
  level: number;
  type: string;
}

interface Role {
  role_id: number;
  name: string;
  description: string;
  skills: RoleSkill[];
}

interface RoleMatch extends Role {
  matchPercentage: number;
  matchedSkills: EmployeeSkill[];
}

interface ProjectRole {
  role_id: number;
  name?: string;
  role_name?: string;
  description?: string;
  role_description?: string;
  skills?: RoleSkill[];
}

export default function EmployeeRoleComparisonPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const employeeId = params.employeeId as string;

  const { data: employee, loading: employeeLoading, error: employeeError } =
      useGetEmployeeProfile(employeeId);
  const { project, loading: projectLoading, error: projectError } =
      useGetProject(projectId);

  const isLoading = employeeLoading || projectLoading;
  const error = employeeError || projectError;

  const handleGoBack = () => {
    router.back();
  };

  const roleMatches = project?.roles?.map((role: ProjectRole) => {

    const typedRole = role;
    if (!employee || !typedRole.skills) return { ...typedRole, matchPercentage: 0, matchedSkills: [] };

    const matchedSkills = employee.skills.filter((empSkill: EmployeeSkill) =>
      typedRole.skills?.some((roleSkill: RoleSkill) =>
        (roleSkill.skill_name || '').toLowerCase() === empSkill.skill_name.toLowerCase(),
      ),
    );

    const matchPercentage = typedRole.skills.length > 0
      ? (matchedSkills.length / typedRole.skills.length) * 100
      : 0;

    return {
      ...typedRole,
      matchPercentage: Math.round(matchPercentage),
      matchedSkills,
    };
  })?.sort((a, b) => b.matchPercentage - a.matchPercentage);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <Loader className="size-5 text-primary animate-spin w-screen" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="p-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="outline"
          onClick={handleGoBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <PageHeader
          title="Employee-Role Comparison"
          subtitle={`Comparing ${employee?.name || ''} ${employee?.last_name_1 || ''} with project roles`}
        />

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Project Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Project Name</p>
              <p>{project?.project_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Client</p>
              <p>{project?.client}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Start Date</p>
              <p>{project?.start_date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">End Date</p>
              <p>{project?.end_date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Manager</p>
              <p>{project?.manager}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p>{project?.description}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Employee Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p>{employee?.name} {employee?.last_name_1} {employee?.last_name_2}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p>{employee?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Role</p>
              <p>{employee?.role}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p>{employee?.location}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Capability</p>
              <p>{employee?.capability}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Seniority</p>
              <p>{employee?.seniority}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Hard Skills</h3>
              {employee?.skills.filter(s => s.type === 'hard').map(skill => (
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
              {!employee?.skills?.length || employee?.skills.filter(s => s.type === 'hard').length === 0 && (
                <p className="text-gray-500">No hard skills found</p>
              )}
            </div>
            <div>
              <h3 className="font-medium mb-2">Soft Skills</h3>
              {employee?.skills.filter(s => s.type === 'soft').map(skill => (
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
              {!employee?.skills?.length || employee?.skills.filter(s => s.type === 'soft').length === 0 && (
                <p className="text-gray-500">No soft skills found</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Project Role Compatibility</h2>
          <div className="space-y-4">
            {roleMatches && roleMatches.length > 0 ? (
              roleMatches.map((role: RoleMatch) => (
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
                        role.skills.map((skill: RoleSkill, idx: number) => (
                          <span key={idx} className={`px-2 py-1 text-xs rounded-full ${
                            employee?.skills.some(s => s.skill_name.toLowerCase() === (skill.skill_name || '').toLowerCase())
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
              <p className="text-gray-500">No roles found for this project</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
