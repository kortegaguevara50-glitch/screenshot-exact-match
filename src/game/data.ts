// Contenido de ejemplo: reemplázalo por las definiciones exactas de tu glosario.

export type WorldId = "bosque" | "valle" | "ciudad" | "fortaleza";

export interface World {
  id: WorldId;
  name: string;
  emoji: string;
  description: string;
  available: boolean;
}

export const WORLDS: World[] = [
  { id: "bosque", name: "Bosque del Conocimiento", emoji: "🌲", description: "Descubre los conceptos básicos de proyectos e innovación.", available: true },
  { id: "valle", name: "Valle de la Planificación", emoji: "🗺️", description: "Objetivos, cronogramas y recursos.", available: false },
  { id: "ciudad", name: "Ciudad Tecnológica", emoji: "🏙️", description: "Innovación, tecnología y cambio.", available: false },
  { id: "fortaleza", name: "Fortaleza de la Evaluación", emoji: "🏰", description: "Indicadores, VAN, TIR y decisiones.", available: false },
];

export interface Term {
  term: string;
  definition: string;
}

export const GLOSSARY: Term[] = [
  { term: "Proyecto", definition: "Esfuerzo temporal que se realiza para crear un producto, servicio o resultado único." },
  { term: "Administración de proyectos", definition: "Aplicación de conocimientos, habilidades y técnicas para cumplir los requisitos de un proyecto." },
  { term: "Innovación tecnológica", definition: "Introducción de un producto o proceso nuevo o mejorado basado en tecnología." },
  { term: "Ciclo de vida del proyecto", definition: "Serie de fases que atraviesa un proyecto desde su inicio hasta su cierre." },
  { term: "Alcance", definition: "Trabajo que debe realizarse para entregar el producto con las características especificadas." },
  { term: "Stakeholder", definition: "Persona u organización que puede afectar o verse afectada por el proyecto." },
  { term: "Evaluación de proyectos", definition: "Análisis que determina la conveniencia de realizar un proyecto comparando costos y beneficios." },
  { term: "Riesgo", definition: "Evento incierto que, si ocurre, tiene un efecto positivo o negativo en los objetivos." },
];

export interface Question {
  question: string;
  options: [string, string, string, string];
  correct: number;
  explanation: string;
}

export const XP_PER_CORRECT = 10;
export const XP_PER_MATCH = 5;

export const FOREST_QUESTIONS: Question[] = [
  {
    question: "¿Qué característica distingue a un proyecto de una operación rutinaria?",
    options: ["Es repetitivo", "Es temporal y tiene un resultado único", "No tiene presupuesto", "Nunca termina"],
    correct: 1,
    explanation: "Un proyecto tiene inicio y fin definidos y genera un resultado único.",
  },
  {
    question: "¿Qué describe mejor la innovación tecnológica?",
    options: ["Copiar un producto existente", "Reducir el personal", "Introducir productos o procesos nuevos o mejorados con tecnología", "Comprar computadoras"],
    correct: 2,
    explanation: "Innovar implica crear o mejorar productos o procesos y llevarlos a la práctica.",
  },
  {
    question: "¿Qué es el alcance de un proyecto?",
    options: ["El trabajo necesario para entregar lo acordado", "La duración en días", "El número de empleados", "El logotipo del proyecto"],
    correct: 0,
    explanation: "El alcance define qué trabajo se incluye (y cuál no) para lograr los entregables.",
  },
  {
    question: "¿Quién es un stakeholder?",
    options: ["Solo el director", "Solo el cliente", "Un proveedor externo únicamente", "Cualquiera que afecta o es afectado por el proyecto"],
    correct: 3,
    explanation: "Los interesados incluyen clientes, equipo, patrocinadores, comunidad y más.",
  },
  {
    question: "¿Para qué sirve la evaluación de proyectos?",
    options: ["Para decorar el informe", "Para decidir si conviene realizar el proyecto", "Para contratar personal", "Para eliminar riesgos por completo"],
    correct: 1,
    explanation: "Compara costos y beneficios para apoyar la decisión de invertir.",
  },
];

export const MATCH_PAIRS: Term[] = GLOSSARY.slice(0, 4);

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export const BADGES: Badge[] = [
  { id: "first-step", name: "Primer Paso", emoji: "🥾", description: "Responde tu primera pregunta correctamente." },
  { id: "forest-explorer", name: "Explorador del Bosque", emoji: "🌲", description: "Completa la misión de preguntas del Bosque." },
  { id: "perfect", name: "Sabio Perfecto", emoji: "🦉", description: "Obtén todas las respuestas correctas en la misión." },
  { id: "matcher", name: "Maestro de Enlaces", emoji: "🔗", description: "Completa la actividad de relacionar conceptos." },
];
