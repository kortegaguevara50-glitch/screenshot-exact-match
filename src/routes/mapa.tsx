import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/QuestNav";
import { WORLDS } from "@/game/data";
import { isForestComplete, isValleyComplete, useProgress } from "@/game/progress";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Mapa de mundos — Proyecto Quest" },
      { name: "description", content: "Elige tu próximo mundo en Proyecto Quest." },
      { property: "og:title", content: "Mapa de mundos — Proyecto Quest" },
      { property: "og:description", content: "Cuatro mundos por explorar." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const p = useProgress();
  return (
    <PageShell title="Mapa del reino" subtitle="Elige un mundo para comenzar tu misión.">
      <div className="grid gap-5 sm:grid-cols-2">
        {WORLDS.map((w, i) => {
          const done = w.id === "bosque" ? isForestComplete(p) : w.id === "valle" && isValleyComplete(p);
          const card = (
            <div className={`h-full rounded-2xl border-2 bg-card p-6 shadow-quest transition ${w.available ? "border-gold hover:-translate-y-1" : "opacity-60"}`}>
              <div className="flex items-center justify-between">
                <span className="text-5xl">{w.emoji}</span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                  {done ? "✅ Completado" : w.available ? "Disponible" : "🔒 Próximamente"}
                </span>
              </div>
              <p className="mt-4 text-xs font-bold uppercase text-secondary">Mundo {i + 1}</p>
              <h2 className="text-xl font-bold">{w.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{w.description}</p>
              {w.id === "valle" && <><p className="mt-4 text-sm font-bold text-secondary">{p.valleyAdventure.completed.length}/6 zonas exploradas</p><progress aria-label="Avance del Valle" value={p.valleyAdventure.completed.length} max={6} className="quest-progress mt-2 h-2 w-full" /></>}
            </div>
          );
          return w.available ? <Link key={w.id} to={w.id === "valle" ? "/valle" : "/misiones"}>{card}</Link> : <div key={w.id}>{card}</div>;
        })}
      </div>
    </PageShell>
  );
}
