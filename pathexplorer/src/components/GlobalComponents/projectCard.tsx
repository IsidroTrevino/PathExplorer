'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Users, User } from 'lucide-react';
import { useUser } from '@/features/context/userContext';

interface ProjectCardProps {
    project: {
        id: string;
        projectName: string;
        client: string;
        description: string;
        startDate: string;
        endDate: string;
        employees_req: number;
        createdBy?: string;
        manager_id?: number;
    };
    onEdit?: (project: ProjectCardProps['project']) => void;
    onDelete?: (projectId: string) => void;
}

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const { userDetails } = useUser();
  const isCreator = userDetails?.id === project.manager_id;

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

  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-2 border-b">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-3xl font-bold text-[#7500C0]">
            {project.projectName}
          </CardTitle>
          <div className="flex items-center justify-between">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
              {project.client}
            </Badge>
            {project.createdBy && (
              <div className="flex items-center text-sm text-gray-500">
                <User className="h-4 w-4 mr-1" />
                                Manager: {project.createdBy}
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
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <div className="text-xs text-gray-500">
                    Project ID: {project.id}
        </div>
        <div className="flex gap-2">
          {isCreator && onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(project)}
            >
              <Edit className="h-4 w-4 mr-1" />
                            Edit
            </Button>
          )}
          <Button
            size="sm"
            className="bg-[#7500C0] hover:bg-[#6200a0] text-white"
          >
            <Users className="h-4 w-4 mr-1" />
                        Assign Employees
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
