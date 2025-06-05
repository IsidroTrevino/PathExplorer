'use client';

import React, { ReactNode } from 'react';
import { useGetSkills } from '../hooks/useGetSkills';
import { useGetGoals } from '../hooks/useGetGoals';
import { Skill, Goal } from '../types/curriculum';

export const CurriculumContext = React.createContext<{
    skills: Skill[];
    goals: Goal[];
    loadingSkills: boolean;
    loadingGoals: boolean;
    errorSkills: string | null;
    errorGoals: string | null;
    refetchSkills: () => Promise<void>;
    refetchGoals: () => Promise<void>;
      }>({
        skills: [],
        goals: [],
        loadingSkills: false,
        loadingGoals: false,
        errorSkills: null,
        errorGoals: null,
        refetchSkills: async () => {},
        refetchGoals: async () => {},
      });

interface CurriculumDataProviderProps {
    children: ReactNode;
}

export function CurriculumDataProvider({ children }: CurriculumDataProviderProps) {
  const {
    data: skills = [],
    loading: loadingSkills,
    error: errorSkills,
    refetch: refetchSkills,
  } = useGetSkills();

  const {
    data: goals = [],
    loading: loadingGoals,
    error: errorGoals,
    refetch: refetchGoals,
  } = useGetGoals();

  const refetchSkillsAsync = async () => {
    refetchSkills();
    return Promise.resolve();
  };

  const refetchGoalsAsync = async () => {
    refetchGoals();
    return Promise.resolve();
  };

  return (
    <CurriculumContext.Provider
      value={{
        skills,
        goals,
        loadingSkills,
        loadingGoals,
        errorSkills,
        errorGoals,
        refetchSkills: refetchSkillsAsync,
        refetchGoals: refetchGoalsAsync,
      }}
    >
      {children}
    </CurriculumContext.Provider>
  );
}
