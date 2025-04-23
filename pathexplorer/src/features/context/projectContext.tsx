// src/features/projects/projectContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Project {
    id: string;
    projectName: string;
    client: string;
    description: string;
    startDate: string;
    endDate: string;
    employees_req: number;
    createdBy?: string;
}

interface ProjectContextType {
    projects: Project[];
    addProject: (project: Project) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
