import { GLOSSARY, type GlossaryTerm } from "./data";

export type ForestChallengeKind =
  | "match"
  | "order"
  | "complete"
  | "memory"
  | "decisions"
  | "final";

export interface ForestZone {
  id: string;
  name: string;
  emoji: string;
  kind: ForestChallengeKind;
  intro: string;
  terms: number[];
}

export const FOREST_ZONE_XP = 20;

export const FOREST_ZONES: ForestZone[] = [
  {
    id: "arbol",
    name: "El Árbol de los Conceptos",
    emoji: "🌳",
    kind: "match",
    intro: "Las raíces del árbol guardan conocimientos. Une cada concepto con su definición.",
    terms: [1, 5, 6],
  },
  {
    id: "pergamino",
    name: "El Pergamino Perdido",
    emoji: "📜",
    kind: "order",
    intro: "Un antiguo pergamino perdió sus fragmentos. Ordénalos para recuperar su mensaje.",
    terms: [2, 8, 7],
  },
  {
    id: "enigmas",
    name: "El Claro de los Enigmas",
    emoji: "🔮",
    kind: "complete",
    intro: "Descubre las cartas ocultas y demuestra cuánto sabes sobre los proyectos.",
    terms: [4, 13, 20],
  },
  {
    id: "biblioteca",
    name: "La Biblioteca Encantada",
    emoji: "📚",
    kind: "memory",
    intro: "Los libros mágicos esconden parejas. Encuentra las cartas que se relacionan.",
    terms: [14, 15, 16],
  },
  {
    id: "sendero",
    name: "El Sendero de las Decisiones",
    emoji: "🍃",
    kind: "decisions",
    intro: "El bosque presenta situaciones. Utiliza tus conocimientos para elegir el camino adecuado.",
    terms: [17, 18, 22],
  },
  {
    id: "santuario",
    name: "El Santuario del Saber",
    emoji: "✨",
    kind: "final",
    intro: "Has llegado al último desafío. Reúne lo aprendido y demuestra tu dominio del conocimiento.",
    terms: [19, 33, 1],
  },
];

export function forestOfficialTerm(number: number): GlossaryTerm {
  const entry = GLOSSARY.find((term) => term.number === number);

  if (!entry || entry.world !== "bosque") {
    throw new Error(`Missing official forest glossary entry ${number}`);
  }

  return entry;
}
export interface ForestZoneDraft {
  stage: "intro" | "challenge" | "reward";
  matched: number[];
  step: number;
  order: number[];
  revealed?: string[];
  attempts?: number;
}

export interface ForestAdventure {
  completed: string[];
  drafts: Record<string, ForestZoneDraft>;
}

export const EMPTY_FOREST_ADVENTURE: ForestAdventure = {
  completed: [],
  drafts: {},
};

export const NEW_FOREST_DRAFT: ForestZoneDraft = {
  stage: "intro",
  matched: [],
  step: 0,
  order: [],
};

export function forestZoneUnlocked(
  adventure: ForestAdventure,
  index: number,
): boolean {
  return (
    index === 0 ||
    Boolean(
      FOREST_ZONES[index - 1] &&
      adventure.completed.includes(FOREST_ZONES[index - 1]!.id),
    )
  );
}

export function discoveredForestTerms(
  adventure: ForestAdventure,
): number[] {
  return [
    ...new Set(
      FOREST_ZONES.flatMap((zone) => {
        if (adventure.completed.includes(zone.id)) {
          return zone.terms;
        }

        const draft = adventure.drafts[zone.id];

        if (!draft) return [];

        return zone.terms.filter(
          (number, index) =>
            draft.revealed?.includes(`c${number}`) ||
            draft.matched.includes(number) ||
            index < draft.step,
        );
      }),
    ),
  ];
}
export function forestZoneSolved(
  zone: ForestZone,
  draft: ForestZoneDraft,
): boolean {
  return zone.terms.every((number) => draft.matched.includes(number));
}