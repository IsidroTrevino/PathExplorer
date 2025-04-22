export type Skill = {
  name: string;
  level: number;
  type: "technical" | "soft";
};

  
export interface Goal {
  title: string;
  category: string;
  description: string;
  term: "corto" | "medio" | "largo";
}
  