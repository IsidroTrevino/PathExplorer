'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useCreateProjectModal } from '@/features/projects/useCreateProjectModal';
import { CreateProjectModal } from '@/features/projects/createProjectModal';

export default function ProjectsPage() {
  const { isOpen, onOpen, onClose } = useCreateProjectModal();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">
                Projects
            </h1>
            <p className="text-gray-600 mb-2">
                Create new projects for the company and review assigned employees.
            </p>
          </div>
          <Button
            onClick={onOpen}
            className="bg-[#7500C0] hover:bg-[#6200a0] text-white self-start sm:self-auto"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
                        Create Project
          </Button>
        </div>

        <hr className="mb-8 border-gray-200" />

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center py-10">
            <p className="text-gray-500">No projects found. Create your first project to get started.</p>
          </div>
        </div>
      </div>

      <CreateProjectModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
}
