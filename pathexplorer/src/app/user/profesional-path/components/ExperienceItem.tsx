"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export interface Experience {
  date: string;
  title: string;
  company: string;
  description: string;
}

interface ExperienceItemProps {
  exp: Experience;
  idx: number;
}

export const ExperienceItem: FC<ExperienceItemProps> = ({ exp, idx }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
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
        <div className="text-xs font-bold text-purple-600">{exp.date}</div>
        <h3 className="text-lg font-semibold text-gray-800">{exp.title}</h3>
        <h4 className="text-sm font-medium text-purple-500">{exp.company}</h4>
        <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
      </div>
    </motion.div>
  );
};
