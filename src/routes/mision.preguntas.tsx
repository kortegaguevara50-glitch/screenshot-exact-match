import { createFileRoute } from "@tanstack/react-router";
import { QuizMission } from "@/components/QuizMission";
import { FOREST_QUESTIONS } from "@/game/data";

export const Route = createFileRoute("/mision/preguntas")({
  head: () => ({ meta: [
    { title: "El Sendero de las Preguntas — Proyecto Quest" },
    { name: "description", content: "Responde preguntas del Bosque y gana experiencia." },
    { property: "og:title", content: "El Sendero de las Preguntas — Proyecto Quest" },
    { property: "og:description", content: "Misión de preguntas del Bosque del Conocimiento." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <QuizMission world="bosque" questions={FOREST_QUESTIONS} title="❓ El Sendero de las Preguntas" />,
});
