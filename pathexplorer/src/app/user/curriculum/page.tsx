"use client";

import React, { useState } from "react";
import { Skill, Goal } from "../curriculum/types/curriculum";
import { SkillCard } from "./components/SkillCard";
import { GoalCard } from "./components/GoalCard";
import { SkillSheet } from "./components/SkillSheet";
import { GoalSheet } from "./components/GoalSheet";
import { Separator } from "@/components/ui/separator";

export default function CurriculumPage() {
  const [technicalSkillsList, setTechnicalSkillsList] = useState<Skill[]>([]);
  const [softSkillsList, setSoftSkillsList] = useState<Skill[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const handleAddTechnicalSkill = (skill: Skill) =>
    setTechnicalSkillsList((prev) => [...prev, { ...skill, type: "hard" }]);

  const handleAddSoftSkill = (skill: Skill) =>
    setSoftSkillsList((prev) => [...prev, { ...skill, type: "soft" }]);

  const handleAddGoal = (goal: Goal) => setGoals([...goals, goal]);

  const technicalSkills = [
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer",
    "DevOps Engineer",
    "UI/UX Designer",
    "Data Scientist",
    "Mobile Developer",
    "QA Engineer",
  ];

  const softSkills = [
    "Communication",
    "Teamwork",
    "Problem Solving",
    "Adaptability",
    "Time Management",
    "Leadership",
    "Creativity",
  ];

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
            <SkillSheet
              onAdd={handleAddTechnicalSkill}
              skillOptions={technicalSkills}
              title="Add Technical Skill"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[120px]">
            {technicalSkillsList.length > 0 ? (
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
              skillOptions={softSkills}
              title="Add Soft Skill"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[120px]">
            {softSkillsList.length > 0 ? (
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
