import { createFileRoute } from "@tanstack/react-router";
import { QuizMission } from "@/components/QuizMission";
import { VALLEY_QUESTIONS } from "@/game/data";

export const Route = createFileRoute("/mision/valle")({
  head: () => ({ meta: [
    { title: "La Ruta de la Planificación — Proyecto Quest" },
    { name: "description", content: "Misión del Valle con 16 conceptos del glosario oficial, experiencia y recompensas." },
    { property: "og:title", content: "La Ruta de la Planificación — Proyecto Quest" },
    { property: "og:description", content: "Explora los conceptos de planificación en una misión del Valle." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <QuizMission world="valle" questions={VALLEY_QUESTIONS} title="🗺️ La Ruta de la Planificación" />,
});