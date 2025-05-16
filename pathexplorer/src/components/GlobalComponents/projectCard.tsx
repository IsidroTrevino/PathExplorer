'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Users, User, Plus, X } from 'lucide-react';
import { useUser } from '@/features/context/userContext';
import { Project } from '@/features/projects/useGetProjects';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useCreateRoleModal } from '@/features/projects/useCreateRoleModal';
import { CreateRoleModal } from '@/features/projects/createRoleModal';
import { useDeleteProjectRole } from '@/features/projects/useDeleteProjectRole';
import { toast } from 'sonner';
import { useConfirm } from '@/features/hooks/useConfirm';
import { useAddRoleSkillModal } from '@/features/projects/useAddRoleSkillModal';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onRefresh?: () => void;
}

export function ProjectCard({ project, onEdit, onRefresh }: ProjectCardProps) {
  const { userDetails } = useUser();
  const isCreator = userDetails?.employee_id === project.manager_id;
  const { isOpen, onOpen, onClose } = useCreateRoleModal();
  const { deleteProjectRole } = useDeleteProjectRole();
  const addRoleSkillModal = useAddRoleSkillModal();
  const [ConfirmDialog, confirm] = useConfirm(
    'Delete Role',
    'Are you sure you want to delete this role? This action cannot be undone.',
  );

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

  const handleDeleteRole = async (roleId: number) => {
    const confirmed = await confirm();

    if (confirmed) {
      const success = await deleteProjectRole(roleId);
      if (success) {
        toast.success('Role deleted successfully');
        if (onRefresh) {
          onRefresh();
        }
      }
    }
  };

  // Handler for role badge clicks
  const handleRoleClick = (roleId: number) => {
    if (isCreator) {
      addRoleSkillModal.onOpen(roleId);
    }
  };

  return (
    <>
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
              <p className="font-medium">{formatDate(project.start_date)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-500 text-sm">End Date</p>
              <p className="font-medium">{formatDate(project.end_date)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-500 text-sm">Required Employees</p>
              <p className="font-medium">{project.employees_req}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-700">Project Roles</h3>
              {isCreator && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpen()}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                          Add a new role
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {project.roles && project.roles.length > 0 ? (
                project.roles.map((role) => (
                  <div key={role.role_id} className="flex items-center">
                    <Badge
                      variant="secondary"
                      className={isCreator ? 'cursor-pointer hover:bg-gray-200' : ''}
                      onClick={isCreator ? () => handleRoleClick(role.role_id) : undefined}
                    >
                      {role.role_name}
                    </Badge>
                    {isCreator && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 ml-1 text-gray-500 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRole(role.role_id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
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

      <ConfirmDialog />
    </>
  );
}
