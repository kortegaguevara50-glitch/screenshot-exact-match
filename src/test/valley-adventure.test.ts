import { beforeEach, describe, expect, it, vi } from "vitest";
import { GLOSSARY, VALLEY_TERM_NUMBERS } from "@/game/data";
import { VALLEY_ZONES, definitionPieces, discoveredValleyTerms, NEW_DRAFT, zoneUnlocked, zoneSolved } from "@/game/valley-adventure";

describe("Adventure content", () => {
  it("covers the requested 16 concepts with three types and exact definition fragments", () => {
    expect(VALLEY_ZONES.flatMap((z) => z.terms).sort((a, b) => a - b)).toEqual([...VALLEY_TERM_NUMBERS].sort((a, b) => a - b));
    expect(new Set(VALLEY_ZONES.map((z) => z.kind))).toEqual(new Set(["match", "complete", "order"]));
    expect(definitionPieces(26).join(" ")).toBe(GLOSSARY.find((t) => t.number === 26)?.definition);
  });
  it("opens only the first zone until its predecessor is complete", () => {
    expect(VALLEY_ZONES.map((_, i) => zoneUnlocked({ completed: [], drafts: {} }, i))).toEqual([true, false, false, false, false, false]);
    expect(zoneUnlocked({ completed: ["aldea"], drafts: {} }, 1)).toBe(true);
    expect(zoneUnlocked({ completed: ["aldea"], drafts: {} }, 2)).toBe(false);
  });
  it("requires every matching pair or exact fragment order", () => {
    const match = VALLEY_ZONES[0]; const order = VALLEY_ZONES[1];
    if (!match || !order) throw new Error("Missing zones");
    expect(zoneSolved(match, { ...NEW_DRAFT, matched: [10, 23] })).toBe(false);
    expect(zoneSolved(match, { ...NEW_DRAFT, matched: match.terms })).toBe(true);
    expect(zoneSolved(order, { ...NEW_DRAFT, order: [2, 0, 3, 1] })).toBe(false);
    expect(zoneSolved(order, { ...NEW_DRAFT, order: [0, 1, 2, 3] })).toBe(true);
  });
});
describe("Adventure saving and rewards", () => {
  beforeEach(() => { vi.resetModules(); localStorage.clear(); });
  it("persists discovered card faces across reloads without awarding XP", async () => {
    const progress = await import("@/game/progress");
    progress.saveZoneDraft("aldea", { ...NEW_DRAFT, stage: "challenge", revealed: ["c10", "d10"] });
    vi.resetModules();
    const restored = await import("@/game/progress");
    restored.saveZoneDraft("puente", { ...NEW_DRAFT, revealed: ["c26"] });
    const p = JSON.parse(localStorage.getItem("proyecto-quest-progress-v1") ?? "{}");
    expect(p.valleyAdventure.drafts.aldea.revealed).toEqual(["c10", "d10"]);
    expect(p.valleyAdventure.drafts.puente).toBeUndefined();
    expect(p.xp).toBe(0);
    expect(discoveredValleyTerms(p.valleyAdventure)).toEqual([10]);
  });
  it("derives collected cards from pre-card completions and preserves partial drafts", () => {
    const adventure = { completed: ["aldea"], drafts: { campamento: { ...NEW_DRAFT, matched: [28] }, torre: { ...NEW_DRAFT, step: 1 } } };
    expect(discoveredValleyTerms(adventure)).toEqual([10, 23, 24, 25, 27, 28]);
  });
  it("keeps previous quiz XP and completion without pre-completing adventure zones", async () => {
    localStorage.setItem("proyecto-quest-progress-v1", JSON.stringify({ xp: 160, quizCompleted: true, quizBest: 5, matchCompleted: true, valleyQuizCompleted: true, valleyQuizBest: 16, badges: ["valley-explorer"] }));
    const progress = await import("@/game/progress");
    progress.saveZoneDraft("aldea", { ...NEW_DRAFT, stage: "challenge", matched: [10] });
    const p = JSON.parse(localStorage.getItem("proyecto-quest-progress-v1") ?? "{}");
    expect(p.xp).toBe(160); expect(p.valleyQuizBest).toBe(16); expect(p.quizBest).toBe(5);
    expect(p.valleyAdventure.completed).toEqual([]); expect(p.valleyAdventure.drafts.aldea.matched).toEqual([10]);
    expect(progress.isValleyComplete(p)).toBe(false);
  });
  it("rejects locked and unsolved zones; pays once, unlocks in sequence and grants the final badge", async () => {
    const progress = await import("@/game/progress");
    progress.completeValleyZone("puente", { ...NEW_DRAFT, order: [0, 1, 2, 3] });
    progress.completeValleyZone("aldea", { ...NEW_DRAFT, matched: [10] });
    let p = JSON.parse(localStorage.getItem("proyecto-quest-progress-v1") ?? "{}"); expect(p.xp).toBe(0);
    for (const zone of VALLEY_ZONES) {
      const solved = { ...NEW_DRAFT, matched: zone.terms, step: zone.terms.length, order: [0, 1, 2, 3] };
      progress.completeValleyZone(zone.id, solved); progress.completeValleyZone(zone.id, solved);
    }
    p = JSON.parse(localStorage.getItem("proyecto-quest-progress-v1") ?? "{}");
    expect(p.xp).toBe(120); expect(p.valleyAdventure.completed).toHaveLength(6);
    expect(p.badges).toEqual(["valley-adventurer"]); expect(p.quizCompleted).toBe(false);
    expect(p.valleyQuizCompleted).toBe(false); expect(progress.isValleyComplete(p)).toBe(true);
  });
});