import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/QuestNav";
import { WORLDS } from "@/game/data";
import { isForestComplete, isValleyComplete, resetProgress, useProgress } from "@/game/progress";

export const Route = createFileRoute("/progreso")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Mi progreso — Proyecto Quest" },
      { name: "description", content: "Tus puntos de experiencia y mundos completados." },
      { property: "og:title", content: "Mi progreso — Proyecto Quest" },
      { property: "og:description", content: "Experiencia y mundos completados." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const p = useProgress();
  const worldsDone = Number(isForestComplete(p)) + Number(isValleyComplete(p));
  return (
    <PageShell title="⭐ Mi progreso" subtitle="Tu avance se guarda en este navegador.">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Experiencia" value={`${p.xp} XP`} />
        <Stat label="Mundos completados" value={`${worldsDone} / ${WORLDS.length}`} />
        <Stat label="Insignias" value={`${p.badges.length}`} />
      </div>
      <div className="mt-6 rounded-2xl border bg-card p-5 shadow-quest">
        <h2 className="font-bold">🌲 Bosque del Conocimiento</h2>
        <ul className="mt-2 space-y-1 text-sm">
          <li>{p.quizCompleted ? "✅" : "⬜"} El Sendero de las Preguntas</li>
          <li>{p.matchCompleted ? "✅" : "⬜"} El Puente de los Conceptos</li>
        </ul>
      </div>
      <div className="mt-6 rounded-2xl border bg-card p-5 shadow-quest">
        <h2 className="font-bold">🗺️ Valle de la Planificación</h2>
        <p className="mt-2 text-sm">{isValleyComplete(p) ? "✅" : "🧭"} Aventura: {p.valleyAdventure.completed.length}/6 zonas completadas</p>
        <progress aria-label="Progreso de las zonas" value={p.valleyAdventure.completed.length} max={6} className="quest-progress mt-3 h-3 w-full" />
        {p.valleyQuizCompleted && <p className="mt-2 text-sm font-bold text-primary">Práctica anterior · Mejor resultado: {p.valleyQuizBest}/16</p>}
      </div>
      <Button variant="outline"
        onClick={() => { if (confirm("¿Borrar todo tu progreso?")) resetProgress(); }}
        className="mt-6 rounded-full border-2 border-destructive px-5 py-2 text-sm font-bold text-destructive"
      >
        Reiniciar progreso
      </Button>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border-2 border-gold bg-card p-5 text-center shadow-quest">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold text-primary">{value}</p>
    </div>
  );
}
