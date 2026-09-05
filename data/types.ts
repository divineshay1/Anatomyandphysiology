export type Question = {
  id: string; week: number; module: string; topic: string; difficulty: "easy" | "medium" | "hard";
  questionType: "multiple-choice"; question: string; options: string[]; answer: number;
  explanation: string; hint?: string; xp: number; tags: string[];
};
export type Module = { id: string; title: string; subtitle: string; icon: string; color: string; questions: Question[] };
