import { Module } from "@/data/types";

export function moduleMastery(module: Module, correct: string[]): number {
  const ids = module.questions.map((q) => q.id);
  if (ids.length === 0) return 0;
  const correctCount = ids.filter((id) => correct.includes(id)).length;
  return Math.round((correctCount / ids.length) * 100);
}
