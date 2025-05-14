'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Users, User, Plus } from 'lucide-react';
import { useUser } from '@/features/context/userContext';
import { Project } from '@/features/projects/useGetProjects';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useCreateRoleModal } from '@/features/projects/useCreateRoleModal';
import { CreateRoleModal } from '@/features/projects/createRoleModal';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onRefresh?: () => void;
}

export function ProjectCard({ project, onEdit, onRefresh }: ProjectCardProps) {
  const { userDetails } = useUser();
  const isCreator = userDetails?.employee_id === project.manager_id;
  const { isOpen, onOpen, onClose } = useCreateRoleModal();

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) {
        return 'Date not specified';
      }

      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const handleViewProject = () => {
    window.location.href = `/user/projects/${project.id}`;
  };

  const handleEditProject = () => {
    if (onEdit) {
      onEdit(project);
    }
  };

  const handleRoleCreated = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleModalClose = () => {
    onClose();
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-2 border-b">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-3xl font-bold text-[#7500C0]">
            {project.project_name}
          </CardTitle>
          <div className="flex items-center justify-between">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
              {project.client}
            </Badge>
            {project.manager && (
              <div className="flex items-center text-sm text-gray-500">
                <User className="h-4 w-4 mr-1" />
                    Manager: {project.manager}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-4">
        <p className="text-gray-700 mb-4">{project.description}</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-gray-500 text-sm">Start Date</p>
            <p className="font-medium">{formatDate(project.startDate)}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-gray-500 text-sm">End Date</p>
            <p className="font-medium">{formatDate(project.endDate)}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-gray-500 text-sm">Required Employees</p>
            <p className="font-medium">{project.employees_req}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-700">Project Roles</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="cursor-pointer bg-purple-300 size-6 px-2 hover:bg-purple-400 rounded-full w-fit"
                    onClick={onOpen}
                  >
                    <Plus className="size-4 text-black"/>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add roles to the project</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.roles && project.roles.length > 0 ? (
              project.roles.map((role) => (
                <Badge
                  key={role.role_id}
                  className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                  variant="secondary"
                >
                  {role.role_name}
                  {role.developer_short_name && ` - ${role.developer_short_name}`}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No roles defined yet</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <div className="text-xs text-gray-500">
            Project ID: {project.id}
        </div>
        <div className="flex gap-2">
          {isCreator && (
            <>
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditProject}
                >
                  <Edit className="h-4 w-4 mr-1" />
                        Edit
                </Button>
              )}
            </>
          )}
          <Button
            className="bg-[#7500C0] hover:bg-[#6200a0] text-white"
            onClick={handleViewProject}
          >
            <Users className="h-4 w-4 mr-1" />
              Available employees
          </Button>
        </div>
      </CardFooter>

      <CreateRoleModal
        isOpen={isOpen}
        onClose={handleModalClose}
        projectId={project.project_id || parseInt(project.id)}
        onSuccess={handleRoleCreated}
      />
    </Card>
  );
}
