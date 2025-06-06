'use client';

import React, { useState, useContext } from 'react';
import { usePostGoal } from '../hooks/usePostGoal';
import { GoalCard } from './GoalCard';
import { GoalSheet } from './GoalSheet';
import { EditGoalModal } from './EditGoalModal';
import EmptyView from '@/components/EmptyView';
import { AlertCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Goal } from '../types/curriculum';
import { CurriculumContext } from './CurriculumDataProvider';

export default function GoalsSection() {
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const { goals, loadingGoals, errorGoals, refetchGoals } = useContext(CurriculumContext);
  const { addGoal } = usePostGoal();

  const handleAddGoal = async (goal: Goal) => {
    await addGoal(goal);
    await refetchGoals();
    toast.success('Goal added');
  };

  if (errorGoals) return <p className="p-8 text-red-600">Error loading goals: {errorGoals}</p>;

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Goals</h2>
        <GoalSheet onAdd={handleAddGoal} />
      </div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] min-h-[120px]">
        {loadingGoals ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 shadow-sm bg-white">
              <p className="text-xs font-medium flex items-center mb-1">
                <span className="w-2 h-2 rounded-full mr-2 bg-gray-200 animate-pulse" />
                <span className="h-4 w-24 bg-gray-200 rounded animate-pulse"></span>
              </p>
              <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse italic mb-2"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mt-2"></div>
            </div>
          ))
        ) : goals.length > 0 ? (
          goals.map((goal, i) => (
            <div
              key={i}
              onClick={() => setEditingGoal(goal)}
              className="cursor-pointer"
            >
              <GoalCard {...goal} />
            </div>
          ))
        ) : (
          <EmptyView
            icon={<AlertCircleIcon className="w-12 h-12 text-purple-600" />}
            message="No goals added yet."
          />
        )}
      </div>

      {editingGoal && (
        <EditGoalModal
          isOpen={!!editingGoal}
          goal={editingGoal}
          onUpdated={() => {
            setEditingGoal(null);
            refetchGoals();
          }}
          onClose={() => setEditingGoal(null)}
        />
      )}
    </section>
  );
}
