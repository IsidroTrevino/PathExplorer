import { useState } from 'react';
import { Project } from '../types/ProjectTypes';

export function useProjectModal() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const onOpenCreate = () => setIsCreateOpen(true);
  const onCloseCreate = () => setIsCreateOpen(false);

  const onOpenEdit = (project: Project) => {
    setProjectToEdit(project);
    setIsEditOpen(true);
  };

  const onCloseEdit = () => {
    setIsEditOpen(false);
    setProjectToEdit(null);
  };

  return {
    isCreateOpen,
    isEditOpen,
    projectToEdit,
    onOpenCreate,
    onCloseCreate,
    onOpenEdit,
    onCloseEdit,
  };
}
