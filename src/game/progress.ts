import { useSyncExternalStore } from "react";
import { FOREST_QUESTIONS, VALLEY_QUESTIONS, XP_PER_CORRECT } from "./data";
import {
  EMPTY_ADVENTURE,
  VALLEY_ZONES,
  ZONE_XP,
  zoneSolved,
  zoneUnlocked,
  type ValleyAdventure,
  type ZoneDraft,
} from "./valley-adventure";
import {
  EMPTY_FOREST_ADVENTURE,
  FOREST_ZONES,
  FOREST_ZONE_XP,
  forestZoneUnlocked,
  forestZoneSolved,
  type ForestAdventure,
  type ForestZoneDraft,
} from "./forest-adventure";
import {
  EMPTY_TECHNOLOGY_ADVENTURE,
  TECHNOLOGY_ZONES,
  TECHNOLOGY_ZONE_XP,
  technologyZoneUnlocked,
  technologyZoneSolved,
  type TechnologyAdventure,
  type TechnologyZoneDraft,
} from "./technology-adventure";
import {
  EMPTY_FORTRESS_ADVENTURE,
  FORTRESS_ZONES,
  FORTRESS_ZONE_XP,
  fortressZoneUnlocked,
  fortressZoneSolved,
  type FortressAdventure,
  type FortressZoneDraft,
} from "./fortress-adventure";

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
  quizBest: number;
  quizCompleted: boolean;
  matchCompleted: boolean;
  badges: string[];
  valleyQuizBest: number;
  valleyQuizCompleted: boolean;
  sessions: Partial<Record<"bosque" | "valle", QuizSession>>;
  valleyAdventure: ValleyAdventure;
  forestAdventure: ForestAdventure;
  technologyAdventure: TechnologyAdventure;
  fortressAdventure: FortressAdventure;
}

export const EMPTY: Progress = {
  xp: 0,
  quizBest: 0,
  quizCompleted: false,
  matchCompleted: false,
  badges: [],
  valleyQuizBest: 0,
  valleyQuizCompleted: false,
  sessions: {},
  valleyAdventure: EMPTY_ADVENTURE,
  forestAdventure: EMPTY_FOREST_ADVENTURE,
  technologyAdventure: EMPTY_TECHNOLOGY_ADVENTURE,
  fortressAdventure: EMPTY_FORTRESS_ADVENTURE,
};

let cache: Progress | null = null;
const listeners = new Set<() => void>();

/* =========================================================
   RECUPERACIÓN Y VALIDACIÓN DEL PROGRESO
   ========================================================= */

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function safeNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, value)
    : fallback;
}

function safeBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function safeStringArray(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : fallback;
}

function safeAdventure<T extends {
  completed: string[];
  drafts: Record<string, unknown>;
}>(
  value: unknown,
  fallback: T,
): T {
  if (!isRecord(value)) return fallback;

  const drafts = isRecord(value["drafts"])
    ? Object.fromEntries(
        Object.entries(value["drafts"]).filter(([, draft]) =>
          isRecord(draft),
        ),
      )
    : {};

  return {
    ...fallback,
    ...value,
    completed: safeStringArray(
      value["completed"],
      fallback.completed,
    ),
    drafts: drafts as T["drafts"],
  };
}

function read(): Progress {
  if (cache) return cache;

  let raw: string | null = null;

  try {
    raw = localStorage.getItem(KEY);

    if (!raw) {
      cache = EMPTY;
      return cache;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!isRecord(parsed)) {
      throw new Error("Formato de progreso inválido");
    }

    const saved = parsed;

    cache = {
      ...EMPTY,

      xp: safeNumber(saved["xp"], EMPTY.xp),
      quizBest: safeNumber(saved["quizBest"], EMPTY.quizBest),

      quizCompleted: safeBoolean(
        saved["quizCompleted"],
        EMPTY.quizCompleted,
      ),

      matchCompleted: safeBoolean(
        saved["matchCompleted"],
        EMPTY.matchCompleted,
      ),

      badges: safeStringArray(
        saved["badges"],
        EMPTY.badges,
      ),

      valleyQuizBest: safeNumber(
        saved["valleyQuizBest"],
        EMPTY.valleyQuizBest,
      ),

      valleyQuizCompleted: safeBoolean(
        saved["valleyQuizCompleted"],
        EMPTY.valleyQuizCompleted,
      ),

      sessions: isRecord(saved["sessions"])
        ? saved["sessions"] as Progress["sessions"]
        : EMPTY.sessions,

      valleyAdventure: safeAdventure(
        saved["valleyAdventure"],
        EMPTY_ADVENTURE,
      ),

      forestAdventure: safeAdventure(
        saved["forestAdventure"],
        EMPTY_FOREST_ADVENTURE,
      ),

      technologyAdventure: safeAdventure(
        saved["technologyAdventure"],
        EMPTY_TECHNOLOGY_ADVENTURE,
      ),

      fortressAdventure: safeAdventure(
        saved["fortressAdventure"],
        EMPTY_FORTRESS_ADVENTURE,
      ),
    };
  } catch {
    if (raw) {
      try {
        const backupKey = `${KEY}-backup-corrupto`;

        if (!localStorage.getItem(backupKey)) {
          localStorage.setItem(backupKey, raw);
        }
      } catch {
        // El navegador puede tener el almacenamiento deshabilitado.
      }
    }

    cache = EMPTY;
  }

  return cache;
}

function write(next: Progress) {
  cache = next;

  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Continuar jugando si el almacenamiento del navegador no está disponible.
  }

  listeners.forEach((listener) => listener());
}

export function updateProgress(fn: (p: Progress) => Progress) {
  write(fn(read()));
}

export function addXp(amount: number) {
  updateProgress((p) => ({ ...p, xp: p.xp + amount }));
}

export function unlockBadge(id: string) {
  updateProgress((p) =>
    p.badges.includes(id)
      ? p
      : { ...p, badges: [...p.badges, id] },
  );
}

/* =========================================================
   INSIGNIAS
   ========================================================= */

function getAutomaticBadges(p: Progress): string[] {
  const badges = new Set(p.badges);

  const forestComplete =
    p.forestAdventure.completed.length === FOREST_ZONES.length;

  const valleyComplete =
    p.valleyAdventure.completed.length === VALLEY_ZONES.length;

  const technologyComplete =
    p.technologyAdventure.completed.length ===
    TECHNOLOGY_ZONES.length;

  const fortressComplete =
    p.fortressAdventure.completed.length ===
    FORTRESS_ZONES.length;

  const allMapsComplete =
    forestComplete &&
    valleyComplete &&
    technologyComplete &&
    fortressComplete;

  if (forestComplete) {
    badges.add("forest-explorer");
  }

  if (valleyComplete) {
    badges.add("valley-adventurer");
    badges.add("valley-explorer");
  }

  if (technologyComplete) {
    badges.add("technology-explorer");
  }

  if (fortressComplete) {
    badges.add("fortress-explorer");
  }

  if (
    p.quizCompleted ||
    p.matchCompleted ||
    forestComplete ||
    valleyComplete ||
    technologyComplete ||
    fortressComplete
  ) {
    badges.add("first-step");
  }

  if (p.matchCompleted || allMapsComplete) {
    badges.add("matcher");
  }

  if (
    p.quizBest === FOREST_QUESTIONS.length ||
    allMapsComplete
  ) {
    badges.add("perfect");
  }

  return [...badges];
}

function refreshAutomaticBadges(p: Progress): Progress {
  const badges = getAutomaticBadges(p);

  const changed =
    badges.length !== p.badges.length ||
    badges.some((badge) => !p.badges.includes(badge));

  if (!changed) {
    return p;
  }

  return {
    ...p,
    badges,
  };
}

/* =========================================================
   QUIZ
   ========================================================= */

export function finishQuiz(correct: number) {
  updateProgress((p) => {
    const badges = new Set(p.badges);

    badges.add("forest-explorer");

    if (correct === FOREST_QUESTIONS.length) {
      badges.add("perfect");
    }

    const next: Progress = {
      ...p,
      quizCompleted: true,
      quizBest: Math.max(p.quizBest, correct),
      badges: [...badges],
    };

    return refreshAutomaticBadges(next);
  });
}

export function finishMatch() {
  updateProgress((p) => {
    const next: Progress = {
      ...p,
      matchCompleted: true,
      badges: p.badges.includes("matcher")
        ? p.badges
        : [...p.badges, "matcher"],
    };

    return refreshAutomaticBadges(next);
  });
}

export function resetProgress() {
  write(EMPTY);
}

export function isForestComplete(p: Progress) {
  return (
    p.forestAdventure.completed.length === FOREST_ZONES.length ||
    (p.quizCompleted && p.matchCompleted)
  );
}

export function saveQuizSession(
  world: "bosque" | "valle",
  session: QuizSession,
) {
  updateProgress((p) => ({
    ...p,
    sessions: {
      ...p.sessions,
      [world]: session,
    },
  }));
}

export function recordQuizAnswer(
  world: "bosque" | "valle",
  session: QuizSession,
  right: boolean,
) {
  updateProgress((p) => {
    const first = right && !p.badges.includes("first-step");

    const nextSession = first
      ? {
          ...session,
          earnedBadges: [
            ...session.earnedBadges,
            "first-step",
          ],
        }
      : session;

    const next: Progress = {
      ...p,
      xp: p.xp + (right ? XP_PER_CORRECT : 0),
      badges: first
        ? [...p.badges, "first-step"]
        : p.badges,
      sessions: {
        ...p.sessions,
        [world]: nextSession,
      },
    };

    return refreshAutomaticBadges(next);
  });
}

export function completeQuizSession(
  world: "bosque" | "valle",
  session: QuizSession,
) {
  updateProgress((p) => {
    const rewards =
      world === "valle"
        ? ["valley-explorer"]
        : [
            "forest-explorer",
            ...(session.correct === FOREST_QUESTIONS.length
              ? ["perfect"]
              : []),
          ];

    const newlyEarned = rewards.filter(
      (id) => !p.badges.includes(id),
    );

    const next: Progress = {
      ...p,
      ...(world === "valle"
        ? {
            valleyQuizCompleted: true,
            valleyQuizBest: Math.max(
              p.valleyQuizBest,
              Math.min(
                session.correct,
                VALLEY_QUESTIONS.length,
              ),
            ),
          }
        : {
            quizCompleted: true,
            quizBest: Math.max(
              p.quizBest,
              session.correct,
            ),
          }),
      badges: [...p.badges, ...newlyEarned],
      sessions: {
        ...p.sessions,
        [world]: {
          ...session,
          finished: true,
          earnedBadges: [
            ...session.earnedBadges,
            ...newlyEarned,
          ],
        },
      },
    };

    return refreshAutomaticBadges(next);
  });
}

/* =========================================================
   PROGRESO GENERAL
   ========================================================= */

export function useProgress(): Progress {
  const progress = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => EMPTY,
  );

  return refreshAutomaticBadges(progress);
}

/* =========================================================
   VALLE
   ========================================================= */

export function saveZoneDraft(
  id: string,
  draft: ZoneDraft,
) {
  updateProgress((p) => {
    const index = VALLEY_ZONES.findIndex(
      (zone) => zone.id === id,
    );

    if (
      index < 0 ||
      !zoneUnlocked(p.valleyAdventure, index) ||
      p.valleyAdventure.completed.includes(id)
    ) {
      return p;
    }

    return {
      ...p,
      valleyAdventure: {
        ...p.valleyAdventure,
        drafts: {
          ...p.valleyAdventure.drafts,
          [id]: draft,
        },
      },
    };
  });
}

export function completeValleyZone(
  id: string,
  draft: ZoneDraft,
) {
  updateProgress((p) => {
    const index = VALLEY_ZONES.findIndex(
      (zone) => zone.id === id,
    );

    const zone = VALLEY_ZONES[index];

    if (
      !zone ||
      !zoneUnlocked(p.valleyAdventure, index) ||
      p.valleyAdventure.completed.includes(id) ||
      !zoneSolved(zone, draft)
    ) {
      return p;
    }

    const completed = [
      ...p.valleyAdventure.completed,
      id,
    ];

    const allDone =
      completed.length === VALLEY_ZONES.length;

    const next: Progress = {
      ...p,
      xp: p.xp + ZONE_XP,
      badges:
        allDone &&
        !p.badges.includes("valley-adventurer")
          ? [...p.badges, "valley-adventurer"]
          : p.badges,
      valleyAdventure: {
        completed,
        drafts: {
          ...p.valleyAdventure.drafts,
          [id]: {
            ...draft,
            stage: "reward",
          },
        },
      },
    };

    return refreshAutomaticBadges(next);
  });
}

export function isValleyComplete(p: Progress) {
  return (
    p.valleyAdventure.completed.length ===
    VALLEY_ZONES.length
  );
}

/* =========================================================
   BOSQUE
   ========================================================= */

export function saveForestZoneDraft(
  id: string,
  draft: ForestZoneDraft,
) {
  updateProgress((p) => {
    const index = FOREST_ZONES.findIndex(
      (zone) => zone.id === id,
    );

    if (
      index < 0 ||
      !forestZoneUnlocked(p.forestAdventure, index) ||
      p.forestAdventure.completed.includes(id)
    ) {
      return p;
    }

    return {
      ...p,
      forestAdventure: {
        ...p.forestAdventure,
        drafts: {
          ...p.forestAdventure.drafts,
          [id]: draft,
        },
      },
    };
  });
}

export function completeForestZone(
  id: string,
  draft: ForestZoneDraft,
) {
  updateProgress((p) => {
    const index = FOREST_ZONES.findIndex(
      (zone) => zone.id === id,
    );

    const zone = FOREST_ZONES[index];

    if (
      !zone ||
      !forestZoneUnlocked(p.forestAdventure, index) ||
      p.forestAdventure.completed.includes(id) ||
      !forestZoneSolved(zone, draft)
    ) {
      return p;
    }

    const completed = [
      ...p.forestAdventure.completed,
      id,
    ];

    const allDone =
      completed.length === FOREST_ZONES.length;

    const next: Progress = {
      ...p,
      xp: p.xp + FOREST_ZONE_XP,
      badges:
        allDone &&
        !p.badges.includes("forest-explorer")
          ? [...p.badges, "forest-explorer"]
          : p.badges,
      forestAdventure: {
        completed,
        drafts: {
          ...p.forestAdventure.drafts,
          [id]: {
            ...draft,
            stage: "reward",
          },
        },
      },
    };

    return refreshAutomaticBadges(next);
  });
}

/* =========================================================
   CIUDAD TECNOLÓGICA
   ========================================================= */

export function saveTechnologyZoneDraft(
  id: string,
  draft: TechnologyZoneDraft,
) {
  updateProgress((p) => {
    const index = TECHNOLOGY_ZONES.findIndex(
      (zone) => zone.id === id,
    );

    if (
      index < 0 ||
      !technologyZoneUnlocked(
        p.technologyAdventure,
        index,
      ) ||
      p.technologyAdventure.completed.includes(id)
    ) {
      return p;
    }

    return {
      ...p,
      technologyAdventure: {
        ...p.technologyAdventure,
        drafts: {
          ...p.technologyAdventure.drafts,
          [id]: draft,
        },
      },
    };
  });
}

export function completeTechnologyZone(
  id: string,
  draft: TechnologyZoneDraft,
) {
  updateProgress((p) => {
    const index = TECHNOLOGY_ZONES.findIndex(
      (zone) => zone.id === id,
    );

    const zone = TECHNOLOGY_ZONES[index];

    if (
      !zone ||
      !technologyZoneUnlocked(
        p.technologyAdventure,
        index,
      ) ||
      p.technologyAdventure.completed.includes(id) ||
      !technologyZoneSolved(zone, draft)
    ) {
      return p;
    }

    const completed = [
      ...p.technologyAdventure.completed,
      id,
    ];

    const allDone =
      completed.length === TECHNOLOGY_ZONES.length;

    const next: Progress = {
      ...p,
      xp: p.xp + TECHNOLOGY_ZONE_XP,
      badges:
        allDone &&
        !p.badges.includes("technology-explorer")
          ? [...p.badges, "technology-explorer"]
          : p.badges,
      technologyAdventure: {
        completed,
        drafts: {
          ...p.technologyAdventure.drafts,
          [id]: {
            ...draft,
            stage: "reward",
          },
        },
      },
    };

    return refreshAutomaticBadges(next);
  });
}

/* =========================================================
   FORTALEZA
   ========================================================= */

export function saveFortressZoneDraft(
  id: string,
  draft: FortressZoneDraft,
) {
  updateProgress((p) => {
    const index = FORTRESS_ZONES.findIndex(
      (zone) => zone.id === id,
    );

    if (
      index < 0 ||
      !fortressZoneUnlocked(
        p.fortressAdventure,
        index,
      ) ||
      p.fortressAdventure.completed.includes(id)
    ) {
      return p;
    }

    return {
      ...p,
      fortressAdventure: {
        ...p.fortressAdventure,
        drafts: {
          ...p.fortressAdventure.drafts,
          [id]: draft,
        },
      },
    };
  });
}

export function completeFortressZone(
  id: string,
  draft: FortressZoneDraft,
) {
  updateProgress((p) => {
    const index = FORTRESS_ZONES.findIndex(
      (zone) => zone.id === id,
    );

    const zone = FORTRESS_ZONES[index];

    if (
      !zone ||
      !fortressZoneUnlocked(
        p.fortressAdventure,
        index,
      ) ||
      p.fortressAdventure.completed.includes(id) ||
      !fortressZoneSolved(zone, draft)
    ) {
      return p;
    }

    const completed = [
      ...p.fortressAdventure.completed,
      id,
    ];

    const allDone =
      completed.length === FORTRESS_ZONES.length;

    const next: Progress = {
      ...p,
      xp: p.xp + FORTRESS_ZONE_XP,
      badges:
        allDone &&
        !p.badges.includes("fortress-explorer")
          ? [...p.badges, "fortress-explorer"]
          : p.badges,
      fortressAdventure: {
        completed,
        drafts: {
          ...p.fortressAdventure.drafts,
          [id]: {
            ...draft,
            stage: "reward",
          },
        },
      },
    };

    return refreshAutomaticBadges(next);
  });
}

/* =========================================================
   COMPLETADOS
   ========================================================= */

export function isTechnologyComplete(p: Progress) {
  return (
    p.technologyAdventure.completed.length ===
    TECHNOLOGY_ZONES.length
  );
}

export function isFortressComplete(p: Progress) {
  return (
    p.fortressAdventure.completed.length ===
    FORTRESS_ZONES.length
  );
}
