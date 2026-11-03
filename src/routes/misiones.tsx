import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/QuestNav";
import { FOREST_QUESTIONS } from "@/game/data";
import { useProgress } from "@/game/progress";

export const Route = createFileRoute("/misiones")({
  head: () => ({
    meta: [
      { title: "Misiones del Bosque — Proyecto Quest" },
      { name: "description", content: "Misiones interactivas del Bosque del Conocimiento." },
      { property: "og:title", content: "Misiones — Proyecto Quest" },
      { property: "og:description", content: "Preguntas y retos para ganar experiencia." },
    ],
  }),
  component: Missions,
});

function Missions() {
  const p = useProgress();
  return (
    <PageShell title="🌲 Bosque del Conocimiento" subtitle="Completa ambas misiones para conquistar el bosque.">
      <div className="grid gap-5 md:grid-cols-2">
        <MissionCard to="/mision/preguntas" emoji="❓" title="El Sendero de las Preguntas" desc={`${FOREST_QUESTIONS.length} preguntas de opción múltiple.`} status={p.quizCompleted ? `✅ Mejor: ${p.quizBest}/${FOREST_QUESTIONS.length}` : "Pendiente"} />
        <MissionCard to="/mision/relacionar" emoji="🔗" title="El Puente de los Conceptos" desc="Relaciona cada concepto con su definición." status={p.matchCompleted ? "✅ Completada" : "Pendiente"} />
      </div>
      <Link to="/mapa" className="mt-8 inline-block font-semibold text-secondary hover:underline">← Volver al mapa</Link>
    </PageShell>
  );
}

function MissionCard({ to, emoji, title, desc, status }: { to: "/mision/preguntas" | "/mision/relacionar"; emoji: string; title: string; desc: string; status: string }) {
  return (
    <Link to={to} className="block rounded-2xl border-2 border-gold bg-card p-6 shadow-quest transition hover:-translate-y-1">
      <span className="text-4xl">{emoji}</span>
      <h2 className="mt-3 text-xl font-bold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <p className="mt-4 text-sm font-bold text-primary">{status}</p>
    </Link>
  );
}
