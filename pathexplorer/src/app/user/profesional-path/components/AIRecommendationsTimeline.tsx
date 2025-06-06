'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Recommendation, RoleSkill } from '../types/profesionalPath';
import { CheckCircle } from 'lucide-react';

interface AIRecommendationsTimelineProps {
    data: Recommendation[];
}

export const AIRecommendationsTimeline: FC<AIRecommendationsTimelineProps> = ({ data }) => (
  <div className="relative space-y-16">
    {/* Línea vertical */}
    <div className="absolute top-0 bottom-0 left-8 w-1 bg-gradient-to-b from-purple-300 to-purple-100 rounded-full z-0" />

    {/* Recomendaciones AI */}
    {data.map((rec, idx) => (
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: idx * 0.05 }}
        className="relative flex items-start gap-6 pl-16"
      >
        {/* Punto */}
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="absolute left-6 top-1 w-5 h-5 bg-purple-500 rounded-full border-4 border-white shadow-md z-10"
        />

        {/* Contenido */}
        <div className="w-full">
          <div className="text-xs font-bold text-purple-600">
                        Recommendation #{idx + 1}
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {rec.role_name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{rec.role_description}</p>

          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-700 mb-2">Required Skills:</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-4">
              {rec.role_skills.map((skill: RoleSkill, i: number) => (
                <li key={i}>
                  <strong>{skill.skill_name}</strong> –{' '}
                  {skill.type === 'soft'
                    ? 'Soft skill'
                    : 'Technical skill'}
                </li>
              ))}
            </ul>
          </div>

          {/* Roadmap Section */}
          {rec.roadmap && rec.roadmap.length > 0 && (
            <div className="mt-4 bg-purple-50 rounded-md p-4">
              <h4 className="text-md font-medium text-purple-700 mb-3">Path to {rec.role_name}:</h4>
              <div className="space-y-3">
                {rec.roadmap.map((step, i) => (
                  <div key={i} className="flex items-start">
                    <div className="mt-0.5 mr-2 text-purple-500">
                      <CheckCircle size={16} />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-800">{step.step}</h5>
                      <p className="text-xs text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    ))}
  </div>
);
