import React from 'react';
import { Skill } from '../types/curriculum';
import { Code, Users } from 'lucide-react';

export const SkillCard: React.FC<Skill & { iconType?: 'hard' | 'soft' }> = ({
  skill_name,
  level,
  iconType = 'hard',
}) => (
  <div className="rounded-lg border bg-white p-4 shadow-sm w-full">
    <div className="flex items-center mb-2">
      <div className="p-2 bg-purple-600 rounded-full">
        {iconType === 'soft' ?
          <Users className="w-2 h-2 text-white" /> :
          <Code className="w-2 h-2 text-white" />
        }
      </div>
      <h4 className="font-semibold text-sm ml-2">{skill_name}</h4>
    </div>

    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-purple-600 h-2 rounded-full"
        style={{ width: `${level}%` }}
      />
    </div>
  </div>
);
