export type Skill = {
  name: string;
  level: number;
  type: "hard" | "soft";
};

  
export interface Goal {
  title: string;
  category: string;
  description: string;
  term: "Short" | "Medium" | "Large";
}
  
