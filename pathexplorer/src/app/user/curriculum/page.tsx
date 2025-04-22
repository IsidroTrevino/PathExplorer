"use client";

import React, { useState } from 'react';
import { Skill, Goal } from '../curriculum/types/curriculum';
import { SkillCard } from './components/SkillCard';
import { GoalCard } from './components/GoalCard';
import { SkillSheet } from './components/SkillSheet';
import { GoalSheet } from './components/GoalSheet';
import { Separator } from '@/components/ui/separator';

export default function CurriculumPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const handleAddSkill = (skill: Skill) => setSkills([...skills, skill]);
  const handleAddGoal = (goal: Goal) => setGoals([...goals, goal]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex-1 p-8 max-w-5xl mx-16">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-2">Curriculum</h1>
        <p className="text-gray-600 mb-4">
          Here, you will see your skills, experience, and goals for your career.
        </p>
        <Separator className="mb-8" />

        {/* Technical skills */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Technical skills</h2>
            <SkillSheet onAdd={handleAddSkill} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[120px]">
            {skills.length > 0 ? (
              skills.map((skill, i) => <SkillCard key={i} {...skill} />)
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
            <SkillSheet onAdd={handleAddSkill} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[120px]">
            {skills.length > 0 ? (
              skills.map((skill, i) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[120px]">
            {goals.length > 0 ? (
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
