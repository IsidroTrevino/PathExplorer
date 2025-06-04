// src/pages/CurriculumPage.tsx
'use client';

import React, { useState } from 'react';
import { useGetSkills } from './hooks/useGetSkills';
import { usePostSkill } from './hooks/usePostSkill';
import { useGetGoals } from './hooks/useGetGoals';
import { usePostGoal } from './hooks/usePostGoal';
import { Skill, Goal } from './types/curriculum';

import { SkillCard } from './components/SkillCard';
import { GoalCard } from './components/GoalCard';
import { SkillSheet } from './components/SkillSheet';
import { GoalSheet } from './components/GoalSheet';
import { EditSkillModal } from './components/EditSkillModal';
import { EditGoalModal } from './components/EditGoalModal';
import CurriculumUpload from './components/CurriculumUpload';
import { PageHeader } from '@/components/pageHeader';
import EmptyView from '@/components/EmptyView';
import { AlertCircleIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// Sólo el diccionario de Technical Skills
import { techSkillDictionary } from './types/techSkillDictionary';

export default function CurriculumPage() {
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const { data: skills = [], loading: loadingSkills, error: errorSkills, refetch: refetchSkills } = useGetSkills();
  const { addSkill } = usePostSkill();
  const { data: goals = [], loading: loadingGoals, error: errorGoals, refetch: refetchGoals } = useGetGoals();
  const { addGoal } = usePostGoal();

  const handleAddTechnicalSkill = async (skill: Skill) => {
    await addSkill({ ...skill, type: 'hard' });
    await refetchSkills();
    toast.success('Skill técnica agregada');
  };

  const handleAddSoftSkill = async (skill: Skill) => {
    await addSkill({ ...skill, type: 'soft' });
    await refetchSkills();
    toast.success('Skill blanda agregada');
  };

  const handleAddGoal = async (goal: Goal) => {
    await addGoal(goal);
    await refetchGoals();
    toast.success('Meta agregada');
  };

  if (errorSkills) return <p className="p-8 text-red-600">Error cargando skills: {errorSkills}</p>;
  if (errorGoals)  return <p className="p-8 text-red-600">Error cargando goals: {errorGoals}</p>;

  const tech = skills.filter(s => s.type === 'hard');
  const soft = skills.filter(s => s.type === 'soft');

  // Lista estática de soft skills
  const softOptions = [
    'Communication',
    'Teamwork',
    'Problem Solving',
    'Adaptability',
    'Time Management',
    'Leadership',
    'Creativity',
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <div className="space-y--8">
          <PageHeader
            title="Curriculum"
            subtitle="Add your curriculum, skills and goals to enhance your profile."
          />
        </div>
        {/* Technical Skills */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Technical skills</h2>
            <SkillSheet
              title="Add Technical Skill"
              skillDictionary={techSkillDictionary}
              onAdd={handleAddTechnicalSkill}
            />
          </div>
          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(260px,1fr))] min-h-[120px]">
            {loadingSkills ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse border rounded-lg p-4" />
              ))
            ) : tech.length > 0 ? (
              tech.map((skill, i) => (
                <div
                  key={i}
                  onClick={() => setEditingSkill(skill)}
                  className="cursor-pointer"
                >
                  <SkillCard {...skill} />
                </div>
              ))
            ) : (
              <EmptyView
                icon={<AlertCircleIcon className="w-12 h-12 text-purple-600" />}
                message="No technical skills added yet."
              />
            )}
          </div>
        </section>

        <Separator />

        {/* Soft Skills */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Soft skills</h2>
            <SkillSheet
              title="Add Soft Skill"
              skillOptions={softOptions}
              onAdd={handleAddSoftSkill}
            />
          </div>
          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(255px,1fr))] min-h-[120px]">
            {loadingSkills ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse border rounded-lg p-4" />
              ))
            ) : soft.length > 0 ? (
              soft.map((skill, i) => (
                <div
                  key={i}
                  onClick={() => setEditingSkill(skill)}
                  className="cursor-pointer"
                >
                  <SkillCard {...skill} />
                </div>
              ))
            ) : (
              <EmptyView
                icon={<AlertCircleIcon className="w-12 h-12 text-purple-600" />}
                message="No soft skills added yet."
              />
            )}
          </div>
        </section>

        <Separator />

        {/* Goals */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Goals</h2>
            <GoalSheet onAdd={handleAddGoal} />
          </div>
          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] min-h-[120px]">
            {loadingGoals ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse border rounded-lg p-4" />
              ))
            ) : goals.length > 0 ? (
              goals.map((goal, i) => (
                <div
                  key={i}
                  onClick={() => setEditingGoal(goal)}
                  className="cursor-pointer"
                >
                  <GoalCard {...goal} />
                </div>
              ))
            ) : (
              <EmptyView
                icon={<AlertCircleIcon className="w-12 h-12 text-purple-600" />}
                message="No goals added yet."
              />
            )}
          </div>
        </section>

        <Separator />

        {/* Curriculum Upload */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <CurriculumUpload />
          </div>
          <p className="text-sm text-gray-500 italic">
            Upload your CV in PDF format.
          </p>
        </section>
      </div>

      {/* Modales de edición */}
      {editingSkill && (
        <EditSkillModal
          isOpen={!!editingSkill}
          skill={editingSkill}
          onUpdated={() => {
            setEditingSkill(null);
            refetchSkills();
          }}
          onClose={() => setEditingSkill(null)}
          /** si es hard, pasamos el diccionario dinámico */
          {...(editingSkill.type === 'hard'
            ? { skillDictionary: techSkillDictionary }
            : /* si es soft, pasamos la lista estática */
            { skillOptions: softOptions })}
        />
      )}
      {editingGoal && (
        <EditGoalModal
          isOpen={!!editingGoal}
          goal={editingGoal}
          onUpdated={() => {
            setEditingGoal(null);
            refetchGoals();
          }}
          onClose={() => setEditingGoal(null)}
        />
      )}
    </div>
  );
}
