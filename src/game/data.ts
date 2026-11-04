// Glosario definitivo: 68 conceptos únicos.

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
  { id: "valle", name: "Valle de la Planificación", emoji: "🗺️", description: "Objetivos, cronogramas y recursos.", available: true },
  { id: "ciudad", name: "Ciudad Tecnológica", emoji: "🏙️", description: "Innovación, tecnología y cambio.", available: false },
  { id: "fortaleza", name: "Fortaleza de la Evaluación", emoji: "🏰", description: "Indicadores, VAN, TIR y decisiones.", available: false },
];

export interface Term {
  term: string;
  definition: string;
}

export interface GlossaryTerm extends Term {
  number: number;
  world: WorldId;
}

export const GLOSSARY: GlossaryTerm[] = [
  { number: 1, term: "Contexto", definition: "Conjunto de circunstancias y condiciones que rodean una situación, proyecto o problema y ayudan a comprenderlo mejor.", world: "bosque" },
  { number: 2, term: "Gestión", definition: "Acción de organizar y administrar recursos, actividades y personas para alcanzar un objetivo.", world: "bosque" },
  { number: 3, term: "Evaluación", definition: "Proceso de analizar algo para conocer sus resultados, calidad, avances o cumplimiento.", world: "fortaleza" },
  { number: 4, term: "Proyectos", definition: "Conjunto de actividades organizadas que se realizan para alcanzar un objetivo específico dentro de un tiempo determinado.", world: "bosque" },
  { number: 5, term: "Concepto", definition: "Idea o representación que permite comprender o explicar algo.", world: "bosque" },
  { number: 6, term: "Característica", definition: "Cualidad o aspecto que permite identificar y diferenciar una persona, objeto, proceso o proyecto.", world: "bosque" },
  { number: 7, term: "Fundamento", definition: "Principio, razón o base en la que se apoya una idea, decisión o proyecto.", world: "bosque" },
  { number: 8, term: "Administración", definition: "Proceso de planear, organizar, dirigir y controlar recursos para alcanzar determinados objetivos.", world: "bosque" },
  { number: 9, term: "Control", definition: "Acción de supervisar y comprobar que las actividades se realicen de acuerdo con lo planeado.", world: "fortaleza" },
  { number: 10, term: "Planificación", definition: "Proceso de establecer objetivos, actividades, recursos y tiempos antes de comenzar un proyecto.", world: "valle" },
  { number: 11, term: "Evaluación de proyectos", definition: "Análisis que permite determinar si un proyecto puede cumplir sus objetivos y si sus resultados son adecuados.", world: "fortaleza" },
  { number: 12, term: "Fase", definition: "Cada una de las etapas que forman parte de un proyecto o proceso.", world: "bosque" },
  { number: 13, term: "Ciclo de vida", definition: "Conjunto de etapas por las que pasa un proyecto desde su inicio hasta su conclusión.", world: "bosque" },
  { number: 14, term: "Beneficio", definition: "Resultado positivo que se obtiene al realizar una actividad, proyecto o inversión.", world: "bosque" },
  { number: 15, term: "Importancia", definition: "Valor o relevancia que tiene algo para alcanzar un objetivo o solucionar una necesidad.", world: "bosque" },
  { number: 16, term: "Metodología", definition: "Conjunto de métodos, pasos y procedimientos utilizados para desarrollar una actividad o proyecto de manera ordenada.", world: "bosque" },
  { number: 17, term: "Determinación", definition: "Acción de establecer o decidir algo después de analizar diferentes aspectos.", world: "bosque" },
  { number: 18, term: "Situación", definition: "Estado o condición en la que se encuentra una persona, problema, organización o proyecto en un momento determinado.", world: "bosque" },
  { number: 19, term: "Definición", definition: "Explicación clara y precisa del significado de una palabra, idea o concepto.", world: "bosque" },
  { number: 20, term: "Alcance", definition: "Límites y objetivos que establecen hasta dónde llegará un proyecto y qué actividades incluirá.", world: "bosque" },
  { number: 21, term: "Modelación", definition: "Representación simplificada de un sistema, proceso o situación para comprender cómo funciona.", world: "fortaleza" },
  { number: 22, term: "Proceso", definition: "Conjunto de pasos o actividades relacionadas que se realizan para obtener un resultado.", world: "bosque" },
  { number: 23, term: "Organización", definition: "Forma de distribuir y coordinar personas, recursos y actividades para lograr un objetivo.", world: "valle" },
  { number: 24, term: "Actividades", definition: "Acciones o tareas que se realizan para cumplir los objetivos de un proyecto.", world: "valle" },
  { number: 25, term: "Matriz de actividades", definition: "Tabla que permite organizar las actividades de un proyecto, indicando responsables, tiempos, recursos y avances.", world: "valle" },
  { number: 26, term: "Ruta crítica", definition: "Secuencia de actividades que determina el tiempo mínimo necesario para terminar un proyecto. Si una actividad de esta ruta se retrasa, puede retrasarse todo el proyecto.", world: "valle" },
  { number: 27, term: "Gráfica de Gantt", definition: "Herramienta visual que muestra las actividades de un proyecto y el tiempo en que deben realizarse.", world: "valle" },
  { number: 28, term: "Equipo de trabajo", definition: "Grupo de personas que colaboran y aportan sus conocimientos y habilidades para alcanzar un objetivo común.", world: "valle" },
  { number: 29, term: "Integrar", definition: "Unir diferentes elementos, recursos o personas para formar un conjunto y trabajar hacia un objetivo.", world: "valle" },
  { number: 30, term: "Reporte", definition: "Documento que presenta información, resultados, avances o conclusiones sobre una actividad o proyecto.", world: "fortaleza" },
  { number: 31, term: "Medición", definition: "Proceso de obtener datos para conocer el tamaño, cantidad, rendimiento o resultado de algo.", world: "fortaleza" },
  { number: 32, term: "Evaluación de desempeño", definition: "Análisis del trabajo realizado por una persona, equipo o proyecto para conocer su rendimiento y resultados.", world: "fortaleza" },
  { number: 33, term: "Estudiar", definition: "Analizar y aprender información sobre un tema para comprenderlo mejor.", world: "bosque" },
  { number: 34, term: "Estudio técnico", definition: "Análisis de los recursos, herramientas, procesos y condiciones técnicas necesarios para realizar un proyecto.", world: "ciudad" },
  { number: 35, term: "Factibilidad", definition: "Posibilidad de realizar un proyecto considerando los recursos, conocimientos, tiempo y condiciones disponibles.", world: "valle" },
  { number: 36, term: "Viabilidad", definition: "Probabilidad de que un proyecto pueda realizarse y mantenerse funcionando de manera adecuada.", world: "valle" },
  { number: 37, term: "Sistema Computacional", definition: "Conjunto de elementos de hardware, software, datos y usuarios que trabajan juntos para procesar información.", world: "ciudad" },
  { number: 38, term: "Análisis", definition: "Proceso de examinar información o una situación para identificar sus partes, causas, características y posibles soluciones.", world: "ciudad" },
  { number: 39, term: "Requerimiento", definition: "Necesidad o condición que debe cumplirse para que un proyecto, sistema o producto funcione correctamente.", world: "ciudad" },
  { number: 40, term: "Instalación", definition: "Proceso de colocar y configurar un programa, sistema, equipo o herramienta para que pueda utilizarse.", world: "ciudad" },
  { number: 41, term: "Implementación", definition: "Puesta en práctica de una idea, sistema, proyecto o solución previamente planeada.", world: "ciudad" },
  { number: 42, term: "Higiene", definition: "Conjunto de medidas y hábitos destinados a mantener condiciones adecuadas de limpieza y salud.", world: "ciudad" },
  { number: 43, term: "Seguridad", definition: "Medidas utilizadas para prevenir riesgos, accidentes, daños o pérdidas.", world: "ciudad" },
  { number: 44, term: "Informática", definition: "Área de la tecnología dedicada al tratamiento y manejo automático de la información mediante sistemas computacionales.", world: "ciudad" },
  { number: 45, term: "Seguridad informática", definition: "Conjunto de medidas utilizadas para proteger sistemas, equipos, redes y datos frente a accesos no autorizados, daños o pérdidas.", world: "ciudad" },
  { number: 46, term: "Marco legal", definition: "Conjunto de leyes, normas y reglamentos que deben respetarse al realizar una actividad o proyecto.", world: "ciudad" },
  { number: 47, term: "Capital humano", definition: "Conjunto de conocimientos, habilidades, experiencia y capacidades que poseen las personas que participan en una organización.", world: "ciudad" },
  { number: 48, term: "Control de calidad", definition: "Proceso de revisar y comprobar que un producto, servicio o proyecto cumpla con los requisitos establecidos.", world: "fortaleza" },
  { number: 49, term: "Selección", definition: "Proceso de elegir la opción, persona, recurso o alternativa que mejor se adapta a una necesidad.", world: "valle" },
  { number: 50, term: "Tecnología de información", definition: "Conjunto de herramientas, sistemas y recursos tecnológicos utilizados para crear, almacenar, procesar y transmitir información.", world: "ciudad" },
  { number: 51, term: "Aplicación", definition: "Programa o software diseñado para realizar una función específica y ayudar al usuario en una determinada actividad.", world: "ciudad" },
  { number: 52, term: "Modelo", definition: "Representación de un sistema, proceso o idea que permite comprenderlo, analizarlo o utilizarlo como referencia.", world: "ciudad" },
  { number: 53, term: "Establecer", definition: "Determinar, fijar o definir algo de manera clara.", world: "valle" },
  { number: 54, term: "Métricas", definition: "Medidas utilizadas para evaluar el rendimiento, avance o resultados de un proyecto o sistema.", world: "fortaleza" },
  { number: 55, term: "Método", definition: "Forma ordenada de realizar una actividad siguiendo determinados pasos para alcanzar un resultado.", world: "fortaleza" },
  { number: 56, term: "Técnica", definition: "Procedimiento o conjunto de acciones utilizadas para realizar correctamente una actividad.", world: "fortaleza" },
  { number: 57, term: "Verificar", definition: "Comprobar que algo sea correcto, verdadero o que cumpla con determinados requisitos.", world: "fortaleza" },
  { number: 58, term: "Cumplimiento", definition: "Acción de realizar o respetar aquello que fue establecido, solicitado o acordado.", world: "fortaleza" },
  { number: 59, term: "Instrumento de evaluación", definition: "Herramienta utilizada para recopilar información y valorar conocimientos, resultados, desempeño o avances.", world: "fortaleza" },
  { number: 60, term: "Estrategia", definition: "Plan de acción diseñado para alcanzar un objetivo de manera organizada.", world: "valle" },
  { number: 61, term: "Eficacia", definition: "Capacidad de alcanzar los objetivos o resultados que se habían establecido.", world: "fortaleza" },
  { number: 62, term: "Eficiencia", definition: "Capacidad de alcanzar un resultado utilizando adecuadamente el tiempo, dinero y recursos disponibles.", world: "fortaleza" },
  { number: 63, term: "Economía", definition: "Administración adecuada de los recursos para evitar gastos innecesarios y aprovecharlos de la mejor manera.", world: "fortaleza" },
  { number: 64, term: "Recurso", definition: "Elemento disponible que puede utilizarse para realizar una actividad o alcanzar un objetivo, como dinero, tiempo, personas, materiales o tecnología.", world: "fortaleza" },
  { number: 65, term: "Costo", definition: "Cantidad de dinero o recursos necesarios para realizar una actividad, adquirir un producto o desarrollar un proyecto.", world: "fortaleza" },
  { number: 66, term: "Global", definition: "Que considera un conjunto completo o que abarca diferentes aspectos de una situación.", world: "valle" },
  { number: 67, term: "Cronograma", definition: "Herramienta que organiza las actividades de un proyecto de acuerdo con las fechas y tiempos en que deben realizarse.", world: "valle" },
  { number: 68, term: "Inversión", definition: "Cantidad de dinero, tiempo o recursos que se destinan a un proyecto con la expectativa de obtener un beneficio o resultado en el futuro.", world: "fortaleza" },
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

// Practice includes the requested related concepts without changing glossary assignments.
export const VALLEY_TERM_NUMBERS = [10, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 67];
export const VALLEY_TERMS = VALLEY_TERM_NUMBERS.flatMap((number) => {
  const term = GLOSSARY.find((entry) => entry.number === number);
  return term ? [term] : [];
});
export const VALLEY_QUESTIONS: Question[] = VALLEY_TERMS.map((entry, index) => {
  const correct = index % 4;
  const distractors = [1, 5, 9].flatMap((offset) => {
    const other = VALLEY_TERMS[(index + offset) % VALLEY_TERMS.length];
    return other ? [other.term] : [];
  });
  const options = [...distractors];
  options.splice(correct, 0, entry.term);
  return {
    question: entry.definition,
    options: [options[0] ?? "", options[1] ?? "", options[2] ?? "", options[3] ?? ""],
    correct,
    explanation: `${entry.term}: ${entry.definition}`,
  };
});

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export const BADGES: Badge[] = [
  { id: "valley-explorer", name: "Explorador del Valle", emoji: "🗺️", description: "Completa la misión del Valle de la Planificación." },
  { id: "first-step", name: "Primer Paso", emoji: "🥾", description: "Responde tu primera pregunta correctamente." },
  { id: "forest-explorer", name: "Explorador del Bosque", emoji: "🌲", description: "Completa la misión de preguntas del Bosque." },
  { id: "perfect", name: "Sabio Perfecto", emoji: "🦉", description: "Obtén todas las respuestas correctas en la misión." },
  { id: "matcher", name: "Maestro de Enlaces", emoji: "🔗", description: "Completa la actividad de relacionar conceptos." },
];
