import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/QuestNav";
import { QuestGuide } from "@/components/QuestRewards";
import { VALLEY_QUESTIONS } from "@/game/data";
import { useProgress } from "@/game/progress";

export const Route = createFileRoute("/valle")({
  head: () => ({ meta: [
    { title: "Valle de la Planificación — Proyecto Quest" },
    { name: "description", content: "Explora el Valle de la Planificación con una misión basada en el glosario oficial." },
    { property: "og:title", content: "Valle de la Planificación — Proyecto Quest" },
    { property: "og:description", content: "La Ruta de la Planificación: conceptos, experiencia y recompensas." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Valley,
});

function Valley() {
  const p = useProgress();
  const session = p.sessions.valle;
  return <PageShell title="🗺️ Valle de la Planificación">
    <div className="mx-auto max-w-2xl">
      <QuestGuide message="¡El Valle nos espera!" />
      <Link to="/mision/valle" className="mt-6 block rounded-2xl border-2 border-gold bg-card p-6 shadow-quest transition hover:-translate-y-1">
        <span className="text-4xl">🧭</span><h2 className="mt-3 text-xl font-bold">La Ruta de la Planificación</h2>
        <p className="mt-2 text-sm text-muted-foreground">{VALLEY_QUESTIONS.length} preguntas · +10 XP por acierto</p>
        <p className="mt-4 font-bold text-primary">{p.valleyQuizCompleted ? `✅ Mejor: ${p.valleyQuizBest}/${VALLEY_QUESTIONS.length}` : session ? `En curso: ${session.index + 1}/${VALLEY_QUESTIONS.length}` : "Pendiente"}</p>
        <p className="mt-4 flex items-center gap-2 font-bold text-secondary">{session && !session.finished ? "Continuar aventura" : "Comenzar misión"}<ArrowRight className="size-4" /></p>
      </Link>
      <Button asChild variant="link" className="mt-6"><Link to="/mapa">← Volver al mapa</Link></Button>
    </div>
  </PageShell>;
}