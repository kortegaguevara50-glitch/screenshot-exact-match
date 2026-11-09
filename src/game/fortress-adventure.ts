import { GLOSSARY } from "./data";

export type FortressChallengeKind =
  | "match"
  | "order"
  | "complete"
  | "memory"
  | "decisions"
  | "final";

export interface FortressZone {
  id: string;
  name: string;
  emoji: string;
  kind: FortressChallengeKind;
  intro: string;
  terms: number[];
}

export interface FortressZoneDraft {
  kind: FortressChallengeKind;
  stage: "intro" | "playing" | "reward";
  matched: number[];
  selected: number[];
  order: number[];
  revealed: number[];
  decisions: number[];
  completed: boolean;
}

export interface FortressAdventure {
  completed: string[];
  drafts: Record<string, FortressZoneDraft>;
}

export const FORTRESS_ZONES: FortressZone[] = [
  {
    id: "indicadores",
    name: "Sala de los Indicadores",
    emoji: "📊",
    kind: "match",
    intro:
      "La sala necesita recuperar sus indicadores. Une cada concepto con su significado correcto.",
    terms: [31, 54, 61],
  },
  {
    id: "recursos",
    name: "Cámara de los Recursos",
    emoji: "💰",
    kind: "order",
    intro:
      "Los recursos de la fortaleza están desordenados. Organiza los conceptos para continuar la evaluación.",
    terms: [64, 65, 68],
  },
  {
    id: "evaluacion",
    name: "Tribunal de la Evaluación",
    emoji: "⚖️",
    kind: "complete",
    intro:
      "El tribunal necesita información para tomar una decisión. Descubre los conceptos ocultos y completa la evaluación.",
    terms: [3, 11, 59],
  },
  {
    id: "verificacion",
    name: "Cámara de Verificación",
    emoji: "🔍",
    kind: "memory",
    intro:
      "La cámara perdió sus conexiones. Encuentra las parejas relacionadas para verificar que todo esté en orden.",
    terms: [57, 58, 48],
  },
  {
    id: "desempeno",
    name: "Torre del Desempeño",
    emoji: "📈",
    kind: "decisions",
    intro:
      "La torre necesita decisiones correctas. Analiza cada situación y elige la mejor opción.",
    terms: [32, 62, 63],
  },
  {
    id: "trono",
    name: "Trono de la Evaluación",
    emoji: "👑",
    kind: "final",
    intro:
      "Has llegado al trono. Reúne todo lo aprendido sobre evaluación y demuestra que estás listo para tomar decisiones.",
    terms: [9, 21, 30, 55, 56],
  },
];

export const FORTRESS_ZONE_XP = 20;

export const EMPTY_FORTRESS_ADVENTURE: FortressAdventure = {
  completed: [],
  drafts: {},
};

export function fortressZoneUnlocked(
  adventure: FortressAdventure,
  index: number,
) {
  if (index === 0) return true;

  return adventure.completed.includes(
    FORTRESS_ZONES[index - 1]?.id ?? "",
  );
}

export function fortressZoneSolved(
  zone: FortressZone,
  draft: FortressZoneDraft,
) {
  return draft.completed && draft.kind === zone.kind;
}

export function fortressOfficialTerm(number: number) {
  return (
    GLOSSARY.find((entry) => entry.number === number) ?? {
      number,
      term: "Concepto",
      definition: "Concepto de evaluación.",
      world: "fortaleza" as const,
    }
  );
}

export function discoveredFortressTerms(
  adventure: FortressAdventure,
) {
  const numbers = FORTRESS_ZONES.flatMap((zone) =>
    adventure.completed.includes(zone.id) ? zone.terms : [],
  );

  return [...new Set(numbers)];
}