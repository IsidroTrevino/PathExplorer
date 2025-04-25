'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGetSkills } from './hooks/useGetSkills';
import { usePostSkill } from './hooks/usePostSkill';
import { useGetGoals } from './hooks/useGetGoals';
import { usePostGoal } from './hooks/usePostGoal';
import { Skill, Goal } from './types/curriculum';

import { SkillCard } from './components/SkillCard';
import { GoalCard } from './components/GoalCard';
import { SkillSheet } from './components/SkillSheet';
import { GoalSheet } from './components/GoalSheet';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CurriculumPage() {
  const [isAddingTechnicalSkill, setIsAddingTechnicalSkill] = useState(false);
  const [isAddingSoftSkill, setIsAddingSoftSkill] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  const [cvPdf, setCvPdf] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const storedPdf = localStorage.getItem('curriculumPDF');
    const storedName = localStorage.getItem('curriculumPDFName');
    if (storedPdf) setCvPdf(storedPdf);
    if (storedName) setFileName(storedName);
  }, []);

  const {
    data: skills,
    loading: loadingSkills,
    error: errorSkills,
    refetch: refetchSkills,
  } = useGetSkills();

  const { addSkill } = usePostSkill();

  const {
    data: goals,
    loading: loadingGoals,
    error: errorGoals,
    refetch: refetchGoals,
  } = useGetGoals();

  const { addGoal } = usePostGoal();

  if (errorSkills) {
    return (
      <p className="p-8 text-red-600">
        Error loading skills: {errorSkills}
      </p>
    );
  }
  if (errorGoals) {
    return (
      <p className="p-8 text-red-600">
        Error loading goals: {errorGoals}
      </p>
    );
  }

  const technicalSkillsList = skills ? skills.filter((s) => s.type === 'hard') : [];
  const softSkillsList = skills ? skills.filter((s) => s.type === 'soft') : [];

  const handleAddTechnicalSkill = async (skill: Skill) => {
    setIsAddingTechnicalSkill(true);
    await addSkill({ name: skill.name, type: 'hard', level: skill.level });
    await refetchSkills();
    toast.success('New skill added successfully to your profile.');
    setIsAddingTechnicalSkill(false);
  };

  const handleAddSoftSkill = async (skill: Skill) => {
    setIsAddingSoftSkill(true);
    await addSkill({ name: skill.name, type: 'soft', level: skill.level });
    await refetchSkills();
    toast.success('New skill added successfully to your profile.');
    setIsAddingSoftSkill(false);
  };

  const handleAddGoal = async (goal: Goal) => {
    setIsAddingGoal(true);
    await addGoal({
      title: goal.title,
      category: goal.category,
      description: goal.description,
      term: goal.term,
    });
    await refetchGoals();
    toast.success('New goal added successfully to your profile.');
    setIsAddingGoal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex-1 p-8 max-w-5xl mx-16">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-2">Curriculum</h1>
        <p className="text-gray-600 mb-4">
          Here, you will see your skills, experience, and goals for your career.
        </p>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Load Curriculum (PDF)</h2>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="application/pdf"
              ref={inputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64 = reader.result as string;
                    localStorage.setItem('curriculumPDF', base64);
                    localStorage.setItem('curriculumPDFName', file.name);
                    setCvPdf(base64);
                    setFileName(file.name);
                    toast.success('Curriculum uploaded successfully.');
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
            <Button
              className="bg-purple-600 text-white"
              onClick={() => inputRef.current?.click()}
            >
              Upload
            </Button>
            {cvPdf && (
              <Button
                variant="ghost"
                onClick={() => {
                  localStorage.removeItem('curriculumPDF');
                  localStorage.removeItem('curriculumPDFName');
                  setCvPdf(null);
                  setFileName(null);
                }}
                className="text-red-600 hover:text-red-800"
              >
                Remove Curriculum
              </Button>
            )}
          </div>

          {fileName && (
            <p className="text-sm text-gray-500 mt-2">
              Selected file: <strong>{fileName}</strong>
            </p>
          )}

          {cvPdf && (
            <div className="border rounded p-4 bg-gray-50 mt-4">
              <h3 className="text-md font-medium mb-2">Preview:</h3>
              <iframe
                src={cvPdf}
                title="Curriculum PDF"
                width="100%"
                height="500px"
                className="border rounded"
              />
            </div>
          )}
        </div>

        <Separator className="mb-8" />

        {/* Technical skills */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Technical skills</h2>
            <SkillSheet
              onAdd={handleAddTechnicalSkill}
              skillOptions={[
                'Frontend Developer',
                'Backend Developer',
                'Fullstack Developer',
                'DevOps Engineer',
                'UI/UX Designer',
                'Data Scientist',
                'Mobile Developer',
                'QA Engineer',
              ]}
              title="Add Technical Skill"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 min-h-[120px]">
            {loadingSkills || isAddingTechnicalSkill ? (
              Array.from({ length: isAddingTechnicalSkill ? (technicalSkillsList.length + 1) : 3 }).map((_, i) => (
                <div key={`tech-skeleton-${i}`} className="border rounded-lg p-4 animate-pulse">
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-gray-200 h-5 rounded-md w-3/4"></div>
                    <div className="bg-gray-200 h-5 rounded-md w-10"></div>
                  </div>
                  <div className="bg-gray-200 h-4 rounded-md w-1/3 mt-2"></div>
                </div>
              ))
            ) : technicalSkillsList.length > 0 ? (
              technicalSkillsList.map((skill, i) => (
                <SkillCard key={`tech-${i}`} {...skill} />
              ))
            ) : (
              <p className="col-span-full text-gray-400 italic">
                No technical skills added yet.
              </p>
            )}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Soft skills */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Soft skills</h2>
            <SkillSheet
              onAdd={handleAddSoftSkill}
              skillOptions={[
                'Communication',
                'Teamwork',
                'Problem Solving',
                'Adaptability',
                'Time Management',
                'Leadership',
                'Creativity',
              ]}
              title="Add Soft Skill"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 min-h-[120px]">
            {loadingSkills || isAddingSoftSkill ? (
              Array.from({ length: isAddingSoftSkill ? (softSkillsList.length + 1) : 3 }).map((_, i) => (
                <div key={`soft-skeleton-${i}`} className="border rounded-lg p-4 animate-pulse">
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-gray-200 h-5 rounded-md w-3/4"></div>
                    <div className="bg-gray-200 h-5 rounded-md w-10"></div>
                  </div>
                  <div className="bg-gray-200 h-4 rounded-md w-1/3 mt-2"></div>
                </div>
              ))
            ) : softSkillsList.length > 0 ? (
              softSkillsList.map((skill, i) => (
                <SkillCard key={`soft-${i}`} {...skill} />
              ))
            ) : (
              <p className="col-span-full text-gray-400 italic">
                No soft skills added yet.
              </p>
            )}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Goals */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Goals</h2>
            <GoalSheet onAdd={handleAddGoal} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 min-h-[120px]">
            {loadingGoals || isAddingGoal ? (
              Array.from({ length: isAddingGoal ? (goals?.length + 1 || 1) : 3 }).map((_, i) => (
                <div key={`goal-skeleton-${i}`} className="border rounded-lg p-4 animate-pulse">
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-gray-200 h-5 rounded-md w-3/4"></div>
                    <div className="bg-gray-200 h-5 rounded-md w-16"></div>
                  </div>
                  <div className="bg-gray-200 h-4 rounded-md w-1/2 mt-1"></div>
                  <div className="bg-gray-200 h-4 rounded-md w-full mt-3"></div>
                  <div className="bg-gray-200 h-4 rounded-md w-3/4 mt-1"></div>
                </div>
              ))
            ) : goals && goals.length > 0 ? (
              goals.map((goal, i) => <GoalCard key={i} {...goal} />)
            ) : (
              <p className="col-span-full text-gray-400 italic">
                No goals added yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
