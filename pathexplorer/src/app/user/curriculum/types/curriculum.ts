export interface Skill {
  skill_name: string;
  type: 'hard' | 'soft';
  level: number;
  skill_id?: number;
}

export interface Goal {
  title: string;
  category: string;
  description: string;
  term: 'Short' | 'Medium' | 'Large';
  goal_id?: number;
}
