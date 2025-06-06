// src/app/user/projects/[projectId]/employee/[employeeId]/components/EmployeeInfoProvider.tsx
'use client';

import React from 'react';
import { useGetEmployeeProfile } from '../hooks/useGetEmployeeProfile';
import { useGetProject } from '@/app/user/projects/hooks/useGetProject';
import { useGetRoles } from '@/app/user/projects/hooks/useGetRoles';
import { Loader } from 'lucide-react';
import { EmployeeProfile } from './EmployeeProfile';
import { ProjectInfo } from './ProjectInfo';
import { EmployeeSkills } from './EmployeeSkills';
import { RoleCompatibility } from './RoleCompatibility';
import { BackButton } from './BackButton';
import { PageHeader } from '@/components/pageHeader';
import { Employee, Project, RoleMatch } from '../types/EmployeeProjectTypes';

interface EmployeeInfoProviderProps {
    projectId: string;
    employeeId: string;
}

export function EmployeeInfoProvider({ projectId, employeeId }: EmployeeInfoProviderProps) {
  const { data: employee, loading: employeeLoading, error: employeeError } =
        useGetEmployeeProfile(employeeId);
  const { project, loading: projectLoading, error: projectError } =
        useGetProject(projectId);
  const { roles, loading: rolesLoading } =
        useGetRoles(projectId);

  const isLoading = employeeLoading || projectLoading || rolesLoading;
  const criticalError = employeeError || projectError;

  const roleMatches = React.useMemo(() => {
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      return [];
    }

    if (!employee) {
      return [];
    }

    return roles.map((role) => {
      const roleSkills = role.skills || [];

      const matchedSkills = employee.skills.filter((empSkill) =>
        roleSkills.some((roleSkill) =>
          (roleSkill.skill_name || '').toLowerCase() === empSkill.skill_name.toLowerCase(),
        ),
      );

      const matchPercentage = roleSkills.length > 0
        ? (matchedSkills.length / roleSkills.length) * 100
        : 0;

      return {
        role_id: role.role_id,
        name: role.name || role.role_name || 'Unnamed Role',
        description: role.description || role.role_description || '',
        skills: roleSkills,
        matchPercentage: Math.round(matchPercentage),
        matchedSkills,
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [roles, employee]);

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[70vh]">
        <Loader className="size-5 text-primary animate-spin" />
      </div>
    );
  }

  if (criticalError) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="p-8 text-red-500">{criticalError}</div>
      </div>
    );
  }

  if (!employee || !project) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="p-8 text-red-500">Failed to load required data</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />

        <PageHeader
          title="Employee-Role Comparison"
          subtitle={`Comparing ${employee.name} ${employee.last_name_1} with project roles`}
        />

        <ProjectInfo project={project as Project} />
        <EmployeeProfile employee={employee as Employee} />
        <EmployeeSkills employee={employee as Employee} />
        <RoleCompatibility roleMatches={roleMatches as RoleMatch[]} />
      </div>
    </div>
  );
}
