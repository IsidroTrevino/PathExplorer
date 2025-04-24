"use client";

import React from "react";
import { useGetSkills } from "./hooks/useGetSkills";
import { usePostSkill } from "./hooks/usePostSkill";
import { useGetGoals } from "./hooks/useGetGoals";
import { usePostGoal } from "./hooks/usePostGoal";
import { Skill, Goal } from "./types/curriculum";

import { SkillCard } from "./components/SkillCard";
import { GoalCard } from "./components/GoalCard";
import { SkillSheet } from "./components/SkillSheet";
import { GoalSheet } from "./components/GoalSheet";
import { Separator } from "@/components/ui/separator";

export default function CurriculumPage() {
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

  if (loadingSkills || loadingGoals) {
    return <p className="p-8">Loading...</p>;
  }
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

  const technicalSkillsList = skills.filter((s: Skill) => s.type === "hard");
  const softSkillsList = skills.filter((s: Skill) => s.type === "soft");

  const handleAddTechnicalSkill = async (skill: Skill) => {
    await addSkill({ name: skill.name, type: "hard", level: skill.level });
    refetchSkills();
  };

  const handleAddSoftSkill = async (skill: Skill) => {
    await addSkill({ name: skill.name, type: "soft", level: skill.level });
    refetchSkills();
  };

  const handleAddGoal = async (goal: Goal) => {
    await addGoal({
      title: goal.title,
      category: goal.category,
      description: goal.description,
      term: goal.term,
    });
    refetchGoals();
  };

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
              skillOptions={[
                "Frontend Developer",
                "Backend Developer",
                "Fullstack Developer",
                "DevOps Engineer",
                "UI/UX Designer",
                "Data Scientist",
                "Mobile Developer",
                "QA Engineer",
              ]}
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
              skillOptions={[
                "Communication",
                "Teamwork",
                "Problem Solving",
                "Adaptability",
                "Time Management",
                "Leadership",
                "Creativity",
              ]}
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
