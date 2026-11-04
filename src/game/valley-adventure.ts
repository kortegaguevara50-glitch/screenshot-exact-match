import { GLOSSARY, type GlossaryTerm } from "./data";

export type ChallengeKind = "match" | "order" | "complete";
export interface ValleyZone { id: string; name: string; emoji: string; kind: ChallengeKind; intro: string; terms: number[]; }
export const ZONE_XP = 20;
export const VALLEY_ZONES: ValleyZone[] = [
  { id: "aldea", name: "Aldea de las Actividades", emoji: "🌱", kind: "match", intro: "La aldea prepara una nueva expedición. Recupera los enlaces del tablón para abrir el camino al puente.", terms: [10, 23, 24, 25] },
  { id: "puente", name: "Puente de la Ruta Crítica", emoji: "🌉", kind: "order", intro: "El viento desordenó la inscripción del puente. Reconstrúyela para cruzar al otro lado.", terms: [26] },
  { id: "torre", name: "Torre de Gantt", emoji: "📊", kind: "complete", intro: "El archivo de la torre perdió sus etiquetas. Recupera cada concepto y enciende la señal del campamento.", terms: [27, 67] },
  { id: "campamento", name: "Campamento del Equipo", emoji: "⛺", kind: "match", intro: "El campamento espera al grupo. Une las piezas del tablón y prepara la siguiente etapa de la aventura.", terms: [28, 29, 33] },
  { id: "mirador", name: "Mirador de Factibilidad", emoji: "🔎", kind: "complete", intro: "Desde el mirador se ve el destino. Recupera las etiquetas de los registros antes de continuar.", terms: [34, 35, 36] },
  { id: "centro", name: "Cumbre del Cronograma", emoji: "🏆", kind: "match", intro: "¡Llegamos a la cumbre! Completa el último tablón para dejar constancia de nuestra aventura.", terms: [30, 31, 32] },
];
export function officialTerm(number: number): GlossaryTerm {
  const entry = GLOSSARY.find((term) => term.number === number);
  if (!entry) throw new Error(`Missing official glossary entry ${number}`);
  return entry;
}
// The ordering puzzle reconstructs the exact official text; it does not invent a project sequence.
export function definitionPieces(number: number): string[] {
  const words = officialTerm(number).definition.split(" ");
  const size = Math.ceil(words.length / 4);
  return Array.from({ length: 4 }, (_, i) => words.slice(i * size, (i + 1) * size).join(" ")).filter(Boolean);
}
export interface ZoneDraft { stage: "intro" | "challenge" | "reward"; matched: number[]; step: number; order: number[]; }
export interface ValleyAdventure { completed: string[]; drafts: Record<string, ZoneDraft>; }
export const EMPTY_ADVENTURE: ValleyAdventure = { completed: [], drafts: {} };
export const NEW_DRAFT: ZoneDraft = { stage: "intro", matched: [], step: 0, order: [] };
export function zoneUnlocked(adventure: ValleyAdventure, index: number): boolean {
  return index === 0 || Boolean(VALLEY_ZONES[index - 1] && adventure.completed.includes(VALLEY_ZONES[index - 1]?.id ?? ""));
}
export function zoneSolved(zone: ValleyZone, draft: ZoneDraft): boolean {
  if (zone.kind === "match") return zone.terms.every((number) => draft.matched.includes(number));
  if (zone.kind === "complete") return draft.step >= zone.terms.length;
  const pieces = definitionPieces(zone.terms[0] ?? 26);
  return draft.order.length === pieces.length && draft.order.every((value, index) => value === index);
}