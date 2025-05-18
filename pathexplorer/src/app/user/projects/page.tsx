'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useCreateProjectModal } from '@/features/projects/useCreateProjectModal';
import { CreateProjectModal } from '@/features/projects/createProjectModal';
import { ProjectCard } from '@/components/GlobalComponents/projectCard';
import { ProjectFilters } from '@/components/GlobalComponents/projectFilters';
import { Project, useGetProjects } from '@/features/projects/useGetProjects';
import { PageHeader } from '@/components/GlobalComponents/pageHeader';
import { EditProjectModal } from '@/features/projects/editProjectModal';
import { AddRoleSkillModal } from '@/features/projects/AddRoleSkillModal';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useUser } from '@/features/context/userContext';

export default function ProjectsPage() {
  const { isOpen, onOpen, onClose } = useCreateProjectModal();
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { userAuth } = useUser();
  const [currentProject] = useState<Project | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [alphabetical, setAlphabetical] = useState<boolean | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const isProjectCreator = userAuth?.userId === currentProject?.manager_id;

  const {
    data: projects,
    totalPages,
    loading,
    error,
    refetch,
  } = useGetProjects({
    page: currentPage,
    size: pageSize,
    search: searchTerm,
    alphabetical,
    start_date: startDate,
    end_date: endDate,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (search: string | null) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleSort = (isAlphabetical: boolean | null) => {
    setAlphabetical(isAlphabetical);
    setCurrentPage(1);
  };

  const handleStartDateFilter = (date: string | null) => {
    setStartDate(date);
    setCurrentPage(1);
  };

  const handleEndDateFilter = (date: string | null) => {
    setEndDate(date);
    setCurrentPage(1);
  };

  const handleEdit = (project: Project) => {
    setProjectToEdit(project);
    setIsEditModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchTerm(null);
    setAlphabetical(null);
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <PageHeader
          title="Projects"
          subtitle="Create new projects for the company and review assigned employees."
        />

        <div className="flex justify-end mt-4 mb-6">
          <Button
            onClick={onOpen}
            className="bg-[#7500C0] hover:bg-[#6200a0] text-white"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
              Create Project
          </Button>
        </div>

        <div className="mb-6">
          <ProjectFilters
            onSearch={handleSearch}
            onSort={handleSort}
            onStartDate={handleStartDateFilter}
            onEndDate={handleEndDateFilter}
            onClearFilters={handleClearFilters}
          />
        </div>

        <hr className="mb-8 border-gray-200" />

        {error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700">
            {error}
          </div>
        ) : loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-48 rounded-lg"></div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="space-y-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onRefresh={refetch}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center py-10">
              <p className="text-gray-500">No projects found. Create your first project to get started.</p>
            </div>
          </div>
        )}

        {!loading && (totalPages ?? 1) > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  {currentPage > 1 ? (
                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                  ) : (
                    <PaginationPrevious className="pointer-events-none opacity-50" />
                  )}
                </PaginationItem>
                <PaginationItem className="flex items-center">
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  {currentPage < (totalPages ?? 1) ? (
                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                  ) : (
                    <PaginationNext className="pointer-events-none opacity-50" />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          refetch();
        }}
      />

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={projectToEdit}
        onSuccess={refetch}
      />

      <AddRoleSkillModal
        isProjectCreator={isProjectCreator}
        onSuccess={refetch}
      />
    </div>
  );
}
