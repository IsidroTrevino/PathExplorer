'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Recommendation, RoleSkill } from '../types/profesionalPath';

interface AIRecommendationsTimelineProps {
  data: Recommendation[];
}

export const AIRecommendationsTimeline: FC<AIRecommendationsTimelineProps> = ({ data }) => (
  <div className="relative space-y-16">
    {/* Línea vertical */}
    <div className="absolute top-0 bottom-0 left-8 w-1 bg-gradient-to-b from-purple-300 to-purple-100 rounded-full z-0" />
    
    {/* Recomendaciones AI */}
    {data.map((rec, idx) => {
      const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

      return (
        <motion.div
          key={idx}
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: idx * 0.05 }}
          className="relative flex items-start gap-6 pl-16"
        >
          {/* Punto */}
          <motion.span
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute left-6 top-1 w-5 h-5 bg-purple-500 rounded-full border-4 border-white shadow-md z-10"
          />

          {/* Contenido */}
          <div>
            <div className="text-xs font-bold text-purple-600">
              Recomendación #{idx + 1}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {rec.role_name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{rec.role_description}</p>
            <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
              {rec.role_skills.map((skill: RoleSkill, i: number) => (
                <li key={i}>
                  <strong>{skill.skill_name}</strong> –{" "}
                  {skill.type === "soft"
                    ? "Habilidad blanda"
                    : "Habilidad técnica"}{" "}
                  ({skill.level}%)
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      );
    })}
  </div>
);
