'use client';

import React, { useState, useContext } from 'react';
import { usePostSkill } from '../hooks/usePostSkill';
import { SkillCard } from './SkillCard';
import { SkillSheet } from './SkillSheet';
import { EditSkillModal } from './EditSkillModal';
import EmptyView from '@/components/EmptyView';
import { AlertCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { techSkillDictionary } from '@/constants/constants';
import { Skill } from '../types/curriculum';
import { CurriculumContext } from './CurriculumDataProvider';

export default function TechnicalSkillsSection() {
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const { skills, loadingSkills, errorSkills, refetchSkills } = useContext(CurriculumContext);
  const { addSkill } = usePostSkill();

  const handleAddTechnicalSkill = async (skill: Skill) => {
    await addSkill({ ...skill, type: 'hard' });
    await refetchSkills();
    toast.success('Technical skill added');
  };

  const tech = skills.filter(s => s.type === 'hard');

  if (errorSkills) return <p className="p-8 text-red-600">Error loading skills: {errorSkills}</p>;

  return (
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
            <div key={i} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-full bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          ))
        ) : tech.length > 0 ? (
          tech.map((skill) => (
            <div
              key={skill.skill_id} // Using unique ID as key
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

      {editingSkill && (
        <EditSkillModal
          isOpen={!!editingSkill}
          skill={editingSkill}
          onUpdated={() => {
            setEditingSkill(null);
            refetchSkills();
          }}
          onClose={() => setEditingSkill(null)}
          skillDictionary={techSkillDictionary}
        />
      )}
    </section>
  );
}
