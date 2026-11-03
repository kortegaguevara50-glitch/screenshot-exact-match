import { useSyncExternalStore } from "react";
import { FOREST_QUESTIONS } from "./data";

const KEY = "proyecto-quest-progress-v1";

export interface Progress {
  xp: number;
  quizBest: number; // mejores aciertos
  quizCompleted: boolean;
  matchCompleted: boolean;
  badges: string[];
}

export const EMPTY: Progress = { xp: 0, quizBest: 0, quizCompleted: false, matchCompleted: false, badges: [] };

let cache: Progress | null = null;
const listeners = new Set<() => void>();

function read(): Progress {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache!;
}

function write(next: Progress) {
  cache = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

export function updateProgress(fn: (p: Progress) => Progress) {
  write(fn(read()));
}

export function addXp(amount: number) {
  updateProgress((p) => ({ ...p, xp: p.xp + amount }));
}

export function unlockBadge(id: string) {
  updateProgress((p) => (p.badges.includes(id) ? p : { ...p, badges: [...p.badges, id] }));
}

export function finishQuiz(correct: number) {
  updateProgress((p) => {
    const badges = new Set(p.badges);
    badges.add("forest-explorer");
    if (correct === FOREST_QUESTIONS.length) badges.add("perfect");
    return { ...p, quizCompleted: true, quizBest: Math.max(p.quizBest, correct), badges: [...badges] };
  });
}

export function finishMatch() {
  updateProgress((p) => ({ ...p, matchCompleted: true, badges: p.badges.includes("matcher") ? p.badges : [...p.badges, "matcher"] }));
}

export function resetProgress() {
  write(EMPTY);
}

export function isForestComplete(p: Progress) {
  return p.quizCompleted && p.matchCompleted;
}

export function useProgress(): Progress {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => EMPTY,
  );
}
