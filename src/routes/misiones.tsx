import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/QuestNav";
import { FOREST_ZONES } from "@/game/forest-adventure";
import { VALLEY_ZONES } from "@/game/valley-adventure";
import { TECHNOLOGY_ZONES } from "@/game/technology-adventure";
import { FORTRESS_ZONES } from "@/game/fortress-adventure";
import { useProgress } from "@/game/progress";

export const Route = createFileRoute("/misiones")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Misiones — Proyecto Quest" },
      {
        name: "description",
        content: "Revisa tus aventuras y el progreso de tus misiones.",
      },
      { property: "og:title", content: "Misiones — Proyecto Quest" },
      {
        property: "og:description",
        content: "Revisa tus aventuras y tu progreso.",
      },
    ],
  }),
  component: Missions,
});

function Missions() {
  const p = useProgress();

  const forestCompleted = p.forestAdventure.completed.length;
  const valleyCompleted = p.valleyAdventure.completed.length;
  const technologyCompleted = p.technologyAdventure.completed.length;
  const fortressCompleted = p.fortressAdventure.completed.length;

  const totalMissions = 24;

  const completedMissions =
    forestCompleted +
    valleyCompleted +
    technologyCompleted +
    fortressCompleted;

  const progressPercentage =
    (completedMissions / totalMissions) * 100;

  return (
    <PageShell
      title="⚔️ Diario de Misiones"
      subtitle="Revisa tus aventuras y descubre cuánto has avanzado."
    >
      <section className="mb-10 rounded-3xl border-2 border-border bg-card p-6 shadow-quest">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary">
              🏆 Progreso de misiones
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Has completado {completedMissions} de {totalMissions} misiones.
            </p>
          </div>

          <span className="rounded-full bg-muted px-4 py-2 text-sm font-bold text-secondary">
            {completedMissions}/{totalMissions}
          </span>
        </div>

        <div className="mt-5 h-4 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <p className="mt-2 text-right text-sm font-bold text-secondary">
          {Math.round(progressPercentage)}%
        </p>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary">
              🌲 Bosque del Conocimiento
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Tus descubrimientos en el bosque.
            </p>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-sm font-bold text-secondary">
            {forestCompleted}/6
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {FOREST_ZONES.map((zone) => {
            const completed =
              p.forestAdventure.completed.includes(zone.id);

            return (
              <div
                key={zone.id}
                className={`rounded-2xl border-2 bg-card p-5 shadow-quest ${
                  completed ? "border-gold" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-4xl">{zone.emoji}</span>

                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">
                    {completed ? "✅ Completada" : "🔒 Pendiente"}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold">
                  {zone.name}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {zone.intro}
                </p>

                {completed && (
                  <p className="mt-4 text-sm font-bold text-secondary">
                    +20 XP obtenidos
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary">
              🗺️ Valle de la Planificación
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Tus avances en la aventura de planificación.
            </p>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-sm font-bold text-secondary">
            {valleyCompleted}/6
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {VALLEY_ZONES.map((zone) => {
            const completed =
              p.valleyAdventure.completed.includes(zone.id);

            return (
              <div
                key={zone.id}
                className={`rounded-2xl border-2 bg-card p-5 shadow-quest ${
                  completed ? "border-gold" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-4xl">{zone.emoji}</span>

                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">
                    {completed ? "✅ Completada" : "🔒 Pendiente"}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold">
                  {zone.name}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {zone.intro}
                </p>

                {completed && (
                  <p className="mt-4 text-sm font-bold text-secondary">
                    +20 XP obtenidos
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary">
              🏙️ Ciudad Tecnológica
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Tus avances en la aventura tecnológica.
            </p>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-sm font-bold text-secondary">
            {technologyCompleted}/6
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {TECHNOLOGY_ZONES.map((zone) => {
            const completed =
              p.technologyAdventure.completed.includes(zone.id);

            return (
              <div
                key={zone.id}
                className={`rounded-2xl border-2 bg-card p-5 shadow-quest ${
                  completed ? "border-gold" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-4xl">{zone.emoji}</span>

                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">
                    {completed ? "✅ Completada" : "🔒 Pendiente"}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold">
                  {zone.name}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {zone.intro}
                </p>

                {completed && (
                  <p className="mt-4 text-sm font-bold text-secondary">
                    +20 XP obtenidos
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary">
              🏰 Fortaleza de la Evaluación
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Tus avances en la aventura de evaluación y control.
            </p>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-sm font-bold text-secondary">
            {fortressCompleted}/6
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {FORTRESS_ZONES.map((zone) => {
            const completed =
              p.fortressAdventure.completed.includes(zone.id);

            return (
              <div
                key={zone.id}
                className={`rounded-2xl border-2 bg-card p-5 shadow-quest ${
                  completed ? "border-gold" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-4xl">{zone.emoji}</span>

                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">
                    {completed ? "✅ Completada" : "🔒 Pendiente"}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold">
                  {zone.name}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {zone.intro}
                </p>

                {completed && (
                  <p className="mt-4 text-sm font-bold text-secondary">
                    +20 XP obtenidos
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <Link
        to="/mapa"
        className="mt-8 inline-block font-semibold text-secondary hover:underline"
      >
        ← Volver al mapa
      </Link>
    </PageShell>
  );
}