import { useSyncExternalStore } from "react";
import { FOREST_QUESTIONS, VALLEY_QUESTIONS, XP_PER_CORRECT } from "./data";
import { EMPTY_ADVENTURE, VALLEY_ZONES, ZONE_XP, zoneSolved, zoneUnlocked, type ValleyAdventure, type ZoneDraft } from "./valley-adventure";

export interface QuizSession {
  index: number;
  selected: number | null;
  correct: number;
  finished: boolean;
  earnedBadges: string[];
}

const KEY = "proyecto-quest-progress-v1";

export interface Progress {
  xp: number;
  quizBest: number; // mejores aciertos
  quizCompleted: boolean;
  matchCompleted: boolean;
  badges: string[];
  valleyQuizBest: number;
  valleyQuizCompleted: boolean;
  sessions: Partial<Record<"bosque" | "valle", QuizSession>>;
  valleyAdventure: ValleyAdventure;
}

export const EMPTY: Progress = { xp: 0, quizBest: 0, quizCompleted: false, matchCompleted: false, badges: [], valleyQuizBest: 0, valleyQuizCompleted: false, sessions: {}, valleyAdventure: EMPTY_ADVENTURE };

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
  return cache ?? EMPTY;
}

function write(next: Progress) {
  cache = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* Continue playing if browser storage is unavailable. */ }
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

export function saveQuizSession(world: "bosque" | "valle", session: QuizSession) {
  updateProgress((p) => ({ ...p, sessions: { ...p.sessions, [world]: session } }));
}

export function recordQuizAnswer(world: "bosque" | "valle", session: QuizSession, right: boolean) {
  updateProgress((p) => {
    const first = right && !p.badges.includes("first-step");
    const nextSession = first ? { ...session, earnedBadges: [...session.earnedBadges, "first-step"] } : session;
    return { ...p, xp: p.xp + (right ? XP_PER_CORRECT : 0), badges: first ? [...p.badges, "first-step"] : p.badges, sessions: { ...p.sessions, [world]: nextSession } };
  });
}

export function completeQuizSession(world: "bosque" | "valle", session: QuizSession) {
  updateProgress((p) => {
    const rewards = world === "valle" ? ["valley-explorer"] : ["forest-explorer", ...(session.correct === FOREST_QUESTIONS.length ? ["perfect"] : [])];
    const newlyEarned = rewards.filter((id) => !p.badges.includes(id));
    return {
      ...p,
      ...(world === "valle" ? { valleyQuizCompleted: true, valleyQuizBest: Math.max(p.valleyQuizBest, Math.min(session.correct, VALLEY_QUESTIONS.length)) } : { quizCompleted: true, quizBest: Math.max(p.quizBest, session.correct) }),
      badges: [...p.badges, ...newlyEarned],
      sessions: { ...p.sessions, [world]: { ...session, finished: true, earnedBadges: [...session.earnedBadges, ...newlyEarned] } },
    };
  });
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

export function saveZoneDraft(id: string, draft: ZoneDraft) {
  updateProgress((p) => {
    const index = VALLEY_ZONES.findIndex((zone) => zone.id === id);
    if (index < 0 || !zoneUnlocked(p.valleyAdventure, index) || p.valleyAdventure.completed.includes(id)) return p;
    return { ...p, valleyAdventure: { ...p.valleyAdventure, drafts: { ...p.valleyAdventure.drafts, [id]: draft } } };
  });
}

export function completeValleyZone(id: string, draft: ZoneDraft) {
  updateProgress((p) => {
    const index = VALLEY_ZONES.findIndex((zone) => zone.id === id);
    const zone = VALLEY_ZONES[index];
    if (!zone || !zoneUnlocked(p.valleyAdventure, index) || p.valleyAdventure.completed.includes(id) || !zoneSolved(zone, draft)) return p;
    const completed = [...p.valleyAdventure.completed, id];
    const allDone = completed.length === VALLEY_ZONES.length;
    return { ...p, xp: p.xp + ZONE_XP, badges: allDone && !p.badges.includes("valley-adventurer") ? [...p.badges, "valley-adventurer"] : p.badges,
      valleyAdventure: { completed, drafts: { ...p.valleyAdventure.drafts, [id]: { ...draft, stage: "reward" } } } };
  });
}

export function isValleyComplete(p: Progress) { return p.valleyAdventure.completed.length === VALLEY_ZONES.length; }
