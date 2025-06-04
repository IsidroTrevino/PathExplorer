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
      <div className="flex justify-between">
        {steps.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center relative z-10">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              i < currentStep
                ? 'bg-purple-600 border-purple-600 text-white'
                : i === currentStep
                  ? 'border-purple-600 text-purple-600'
                  : 'border-gray-300 text-gray-400'
            }`}>
              {i < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            <p className={`mt-2 text-xs font-medium ${
              i <= currentStep ? 'text-purple-600' : 'text-gray-500'
            }`}>
              {step.name}
            </p>
          </div>
        ))}
      </div>

      <div className="absolute top-5 left-0 right-0 mx-auto h-0.5 bg-gray-300" style={{ width: '80%', zIndex: 0 }}>
        <motion.div
          initial={{ width: `${(currentStep - 1) * 50}%` }}
          animate={{ width: `${currentStep * 50}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-purple-600"
        />
      </div>
    </div>
  );
}
