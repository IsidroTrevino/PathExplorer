'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AvailableEmployeesTab } from './AvailableEmployeesTab';
import { EmployeeRecommendations } from '@/app/user/projects/[projectId]/components/EmployeeRecommendations';

interface ProjectEmployeeTabsProps {
    projectId: string;
}

export function ProjectEmployeeTabs({ projectId }: ProjectEmployeeTabsProps) {
  return (
    <Tabs defaultValue="employees" className="mt-8">
      <TabsList className="mb-6">
        <TabsTrigger value="employees" className="cursor-pointer">Available Employees</TabsTrigger>
        <TabsTrigger value="recommendations" className="cursor-pointer">Recommendations</TabsTrigger>
      </TabsList>

      <TabsContent value="employees">
        <AvailableEmployeesTab projectId={projectId} />
      </TabsContent>

      <TabsContent value="recommendations">
        <div className="h-[calc(100vh-320px)] overflow-auto">
          <EmployeeRecommendations projectId={projectId} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
