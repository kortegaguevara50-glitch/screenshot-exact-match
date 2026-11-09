import { GLOSSARY } from "./data";

export type TechnologyChallengeKind =
  | "match"
  | "order"
  | "complete"
  | "memory"
  | "decisions"
  | "final";

export interface TechnologyZone {
  id: string;
  name: string;
  emoji: string;
  kind: TechnologyChallengeKind;
  intro: string;
  terms: number[];
}

export interface TechnologyZoneDraft {
  kind: TechnologyChallengeKind;
  stage: "playing" | "reward";
  matched: number[];
  selected: number[];
  order: number[];
  revealed: number[];
  decisions: number[];
  completed: boolean;
}

export interface TechnologyAdventure {
  completed: string[];
  drafts: Record<string, TechnologyZoneDraft>;
}

export const TECHNOLOGY_ZONES: TechnologyZone[] = [
  {
    id: "plaza",
    name: "Plaza de la Innovación",
    emoji: "💡",
    kind: "match",
    intro:
      "La plaza necesita activar sus conexiones. Une cada concepto tecnológico con su significado correcto.",
    terms: [34, 38, 39],
  },
  {
    id: "laboratorio",
    name: "Laboratorio de Tecnología",
    emoji: "🤖",
    kind: "order",
    intro:
      "El laboratorio perdió el orden de sus procesos. Organiza las piezas para poner la tecnología en funcionamiento.",
    terms: [40, 41, 50],
  },
  {
    id: "prototipos",
    name: "Centro de Prototipos",
    emoji: "🚀",
    kind: "complete",
    intro:
      "Los prototipos están incompletos. Descubre las cartas ocultas y recupera los conceptos necesarios para continuar.",
    terms: [51, 52, 37],
  },
  {
    id: "red-digital",
    name: "Red Digital",
    emoji: "🌐",
    kind: "memory",
    intro:
      "La red perdió sus conexiones. Encuentra las parejas relacionadas para restablecer el sistema.",
    terms: [43, 45, 44],
  },
  {
    id: "taller",
    name: "Taller del Cambio",
    emoji: "⚙️",
    kind: "decisions",
    intro:
      "Las máquinas necesitan decisiones correctas. Analiza cada situación y elige la mejor opción.",
    terms: [42, 46, 47],
  },
  {
    id: "torre",
    name: "Torre del Futuro",
    emoji: "🏆",
    kind: "final",
    intro:
      "Has llegado a la torre. Reúne todo lo aprendido sobre tecnología y demuestra que estás listo para el futuro.",
    terms: [50, 51, 52],
  },
];

export const TECHNOLOGY_ZONE_XP = 20;

export const EMPTY_TECHNOLOGY_ADVENTURE: TechnologyAdventure = {
  completed: [],
  drafts: {},
};

export function technologyZoneUnlocked(
  adventure: TechnologyAdventure,
  index: number,
) {
  if (index === 0) return true;

  return adventure.completed.includes(
    TECHNOLOGY_ZONES[index - 1]?.id ?? "",
  );
}

export function technologyZoneSolved(
  zone: TechnologyZone,
  draft: TechnologyZoneDraft,
) {
  return draft.completed && draft.kind === zone.kind;
}

export function technologyOfficialTerm(number: number) {
  return (
    GLOSSARY.find((entry) => entry.number === number) ?? {
      number,
      term: "Concepto",
      definition: "Concepto tecnológico.",
      world: "ciudad" as const,
    }
  );
}

export function discoveredTechnologyTerms(adventure: TechnologyAdventure) {
  const numbers = TECHNOLOGY_ZONES.flatMap((zone) =>
    adventure.completed.includes(zone.id) ? zone.terms : [],
  );

  return [...new Set(numbers)];
}