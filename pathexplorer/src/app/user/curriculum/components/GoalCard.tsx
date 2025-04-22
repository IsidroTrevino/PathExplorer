import React from "react";
import { Goal } from "../types/curriculum";

const termColors = {
  corto: "bg-purple-500",
  medio: "bg-yellow-500",
  largo: "bg-green-500",
};

export const GoalCard: React.FC<Goal> = ({ title, category, description, term }) => (
  <div className="min-w-[250px] rounded-lg border bg-white p-4 shadow-sm mr-4">
    <p className="text-xs font-medium flex items-center mb-1">
      <span className={`w-2 h-2 rounded-full mr-2 ${termColors[term]}`} />
      Goal term: {term}
    </p>
    <h4 className="font-semibold text-sm text-purple-700">{title}</h4>
    <p className="text-xs text-gray-500 italic">{category}</p>
    <p className="text-sm mt-2">{description}</p>
  </div>
);

