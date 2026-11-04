import { beforeEach, describe, expect, it, vi } from "vitest";
import { GLOSSARY, VALLEY_QUESTIONS, VALLEY_TERMS, WORLDS } from "@/game/data";

describe("Valley official content", () => {
  it("includes all 16 requested concepts using exact glossary definitions", () => {
    expect(VALLEY_TERMS.map((t) => t.term)).toEqual(["Planificación", "Organización", "Actividades", "Matriz de actividades", "Ruta crítica", "Gráfica de Gantt", "Equipo de trabajo", "Integrar", "Reporte", "Medición", "Evaluación de desempeño", "Estudiar", "Estudio técnico", "Factibilidad", "Viabilidad", "Cronograma"]);
    VALLEY_QUESTIONS.forEach((q, i) => {
      const term = VALLEY_TERMS[i];
      expect(q.question).toBe(term?.definition);
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correct]).toBe(term?.term);
      expect(q.options.every((option) => GLOSSARY.some((entry) => entry.term === option))).toBe(true);
    });
  });
  it("opens Forest and Valley only", () => {
    expect(WORLDS.filter((w) => w.available).map((w) => w.id)).toEqual(["bosque", "valle"]);
  });
});

describe("Saved Valley progress", () => {
  beforeEach(() => { localStorage.clear(); vi.resetModules(); });
  it("preserves old Forest progress and adds 10 XP only for a correct answer", async () => {
    localStorage.setItem("proyecto-quest-progress-v1", JSON.stringify({ xp: 70, quizBest: 5, quizCompleted: true, matchCompleted: true, badges: ["perfect"] }));
    const progress = await import("@/game/progress");
    const session = { index: 0, selected: 0, correct: 1, finished: false, earnedBadges: [] };
    progress.recordQuizAnswer("valle", session, true);
    progress.recordQuizAnswer("valle", { ...session, index: 1, selected: 2 }, false);
    const saved = JSON.parse(localStorage.getItem("proyecto-quest-progress-v1") ?? "{}");
    expect(saved.xp).toBe(80);
    expect(saved.quizBest).toBe(5);
    expect(saved.quizCompleted).toBe(true);
    expect(saved.matchCompleted).toBe(true);
    expect(saved.sessions.valle.index).toBe(1);
    expect(saved.sessions.valle.selected).toBe(2);
  });
  it("completes Valley independently, keeps best score and grants its badge once", async () => {
    const progress = await import("@/game/progress");
    const session = { index: 15, selected: 0, correct: 16, finished: false, earnedBadges: [] };
    progress.completeQuizSession("valle", session);
    progress.completeQuizSession("valle", { ...session, correct: 3 });
    const saved = JSON.parse(localStorage.getItem("proyecto-quest-progress-v1") ?? "{}");
    expect(saved.valleyQuizCompleted).toBe(true);
    expect(saved.valleyQuizBest).toBe(16);
    expect(saved.quizCompleted).toBe(false);
    expect(saved.badges.filter((id: string) => id === "valley-explorer")).toHaveLength(1);
    expect(saved.sessions.valle.finished).toBe(true);
  });
});