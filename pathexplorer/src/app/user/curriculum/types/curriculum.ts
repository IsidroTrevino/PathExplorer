export interface Skill {
    name: string;
    level: number;
  }
  
  export interface Goal {
    title: string;
    category: string;
    description: string;
    term: "corto" | "medio" | "largo";
  }
  