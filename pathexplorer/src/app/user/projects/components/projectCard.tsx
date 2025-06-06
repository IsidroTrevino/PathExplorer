'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Users, User, Plus, X } from 'lucide-react';
import { useUser } from '@/features/context/userContext';
import { Project, Role } from '../types/ProjectTypes';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useCreateRoleModal } from '../hooks/useCreateRoleModal';
import { CreateRoleModal } from './createRoleModal';
import { useDeleteProjectRole } from '../hooks/useDeleteProjectRole';
import { toast } from 'sonner';
import { useConfirm } from '@/features/hooks/useConfirm';
import { useAddRoleSkillModal } from '../hooks/useAddRoleSkillModal';

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

      const [year, month, day] = dateString.split('-').map(Number);
      if (!year || !month || !day) {
        return 'Invalid date';
      }

      const date = new Date(year, month - 1, day);
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

  // Determine role badge style based on assignment status
  const getRoleBadgeStyle = (role: Role) => {
    if (role.assignment_status && role.assignment_status.trim() !== 'Unassigned') {
      // Assigned role - using vibrant purple with white text
      return 'bg-[#7500C0] text-white hover:bg-[#6200a0]';
    }
    // Unassigned role - using light gray
    return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
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
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-[#7500C0] border-[#7500C0]"
                        onClick={onOpen}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                          Add Role
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black text-white border-gray-800" sideOffset={5}>
                      <p>Add a new role</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {project.roles && project.roles.length > 0 ? (
                project.roles.map((role) => (
                  <div key={role.role_id} className="flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            className={`cursor-pointer ${getRoleBadgeStyle(role)}`}
                            onClick={() => handleRoleClick(role.role_id)}
                          >
                            {role.role_name}
                            {role.assignment_status && role.assignment_status.trim() !== '' && (
                              <span className="ml-1 inline-block w-2 h-2 rounded-full bg-white"></span>
                            )}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent
                          className="bg-black text-white border border-gray-700 shadow-lg rounded-md p-0 overflow-hidden"
                          sideOffset={5}
                          style={{ '--tooltip-arrow-color': 'white' } as React.CSSProperties}
                        >
                          <div className="p-3">
                            <h4 className="font-semibold text-white">{role.role_name}</h4>
                            <p className="text-gray-300 text-sm mb-2">{role.role_description}</p>
                          </div>
                          {role.assignment_status && role.assignment_status.trim() !== 'Unassigned' ? (
                            <div className="p-3 border-t border-gray-700 bg-gray-900">
                              <p className="font-medium text-purple-300">Assigned to:</p>
                              <p className="text-white">{role.developer_short_name || 'Unknown'}</p>
                              <p className="text-gray-300 text-sm mt-1">Status: {role.assignment_status}</p>
                            </div>
                          ) : (
                            <div className="p-3 border-t border-gray-700 bg-gray-900">
                              <p className="text-gray-300 italic">This role is currently unassigned</p>
                            </div>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {isCreator && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1 text-gray-400 hover:text-red-500"
                        onClick={() => handleDeleteRole(role.role_id)}
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
                    onClick={handleEditProject}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                          Edit Project
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
