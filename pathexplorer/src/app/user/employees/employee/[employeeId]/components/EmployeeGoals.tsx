import { Target } from 'lucide-react';
import { GoalCard } from '@/app/user/curriculum/components/GoalCard';
import type { EmployeeGoal } from '../types/EmployeeTypes';

interface EmployeeGoalsProps {
  goals: EmployeeGoal[];
}

export function EmployeeGoals({ goals }: EmployeeGoalsProps) {
  if (!goals || goals.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-indigo-600" />
        <h2 className="text-xl font-semibold">Career Goals</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <GoalCard
            key={goal.goal_id}
            title={goal.title}
            category={goal.category}
            description={goal.description}
            term={goal.term}
          />
        ))}
      </div>
    </div>
  );
}
