'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface ProgressStepsProps {
    steps: Array<{
        id: string;
        name: string;
        icon: React.ComponentType<{ className?: string }>;
    }>;
    currentStep: number;
}

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="w-full mb-8 relative">
      {/* Background progress line */}
      <div className="absolute top-5 left-[25px] right-[25px] h-0.5 bg-gray-300" style={{ zIndex: 0 }}>
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep) * (100 / (steps.length - 1))}%` }}
          transition={{ duration: 0.4 }}
          className="h-full bg-purple-600"
        />
      </div>

      {/* Icons and labels */}
      <div className="flex justify-between relative z-10">
        {steps.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center">
            <motion.div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white ${
                i < currentStep
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : i === currentStep
                    ? 'border-purple-600 text-purple-600'
                    : 'border-gray-300 text-gray-400'
              }`}
              initial={false}
              animate={{
                backgroundColor: i < currentStep ? '#A855F7' : '#FFFFFF',
                borderColor: i <= currentStep ? '#A855F7' : '#D1D5DB',
                color: i < currentStep ? '#FFFFFF' : i === currentStep ? '#A855F7' : '#9CA3AF',
              }}
              transition={{ duration: 0.3 }}
            >
              {i < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </motion.div>
            <p className={`mt-2 text-xs font-medium ${
              i <= currentStep ? 'text-purple-600' : 'text-gray-500'
            }`}>
              {step.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
