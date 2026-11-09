import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/QuestNav";
import { WORLDS } from "@/game/data";
import {
  isForestComplete,
  isValleyComplete,
  isTechnologyComplete,
  isFortressComplete,
  resetProgress,
  useProgress,
} from "@/game/progress";
import { FOREST_ZONES } from "@/game/forest-adventure";
import { VALLEY_ZONES } from "@/game/valley-adventure";
import { TECHNOLOGY_ZONES } from "@/game/technology-adventure";
import { FORTRESS_ZONES } from "@/game/fortress-adventure";

export const Route = createFileRoute("/progreso")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Mi progreso — Proyecto Quest" },
      {
        name: "description",
        content: "Tus puntos de experiencia y mundos completados.",
      },
      { property: "og:title", content: "Mi progreso — Proyecto Quest" },
      {
        name: "description",
        content: "Experiencia y mundos completados.",
      },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const p = useProgress();

  const worldsDone =
    Number(isForestComplete(p)) +
    Number(isValleyComplete(p)) +
    Number(isTechnologyComplete(p)) +
    Number(isFortressComplete(p));

  const availableWorlds = WORLDS.filter(
    (world) => world.available,
  ).length;

  const forestCompleted = p.forestAdventure.completed.length;
  const valleyCompleted = p.valleyAdventure.completed.length;
  const technologyCompleted =
    p.technologyAdventure.completed.length;
  const fortressCompleted =
    p.fortressAdventure.completed.length;

  return (
    <PageShell
      title="⭐ Mi progreso"
      subtitle="Tu avance se guarda en este navegador."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Experiencia" value={`${p.xp} XP`} />

        <Stat
          label="Mundos completados"
          value={`${worldsDone} / ${availableWorlds}`}
        />

        <Stat
          label="Insignias"
          value={`${p.badges.length}`}
        />
      </div>

      <div className="mt-6 rounded-2xl border bg-card p-5 shadow-quest">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold">
              🌲 Bosque del Conocimiento
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {forestCompleted}/6 zonas completadas
            </p>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-sm font-bold">
            {isForestComplete(p)
              ? "✅ Completo"
              : "🌲 En progreso"}
          </span>
        </div>

        <progress
          aria-label="Progreso del Bosque del Conocimiento"
          value={forestCompleted}
          max={6}
          className="quest-progress mt-3 h-3 w-full"
        />

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {FOREST_ZONES.map((zone) => {
            const completed =
              p.forestAdventure.completed.includes(zone.id);

            return (
              <div
                key={zone.id}
                className={`rounded-xl border-2 p-3 ${
                  completed
                    ? "border-gold bg-card"
                    : "border-border"
                }`}
              >
                <p className="font-semibold">
                  {completed ? "✅" : "⬜"} {zone.emoji}{" "}
                  {zone.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-card p-5 shadow-quest">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold">
              🗺️ Valle de la Planificación
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {valleyCompleted}/6 zonas completadas
            </p>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-sm font-bold">
            {isValleyComplete(p)
              ? "✅ Completo"
              : "🧭 En progreso"}
          </span>
        </div>

        <progress
          aria-label="Progreso del Valle de la Planificación"
          value={valleyCompleted}
          max={6}
          className="quest-progress mt-3 h-3 w-full"
        />

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {VALLEY_ZONES.map((zone) => {
            const completed =
              p.valleyAdventure.completed.includes(zone.id);

            return (
              <div
                key={zone.id}
                className={`rounded-xl border-2 p-3 ${
                  completed
                    ? "border-gold bg-card"
                    : "border-border"
                }`}
              >
                <p className="font-semibold">
                  {completed ? "✅" : "⬜"} {zone.emoji}{" "}
                  {zone.name}
                </p>
              </div>
            );
          })}
        </div>

        {p.valleyQuizCompleted && (
          <p className="mt-4 text-sm font-bold text-primary">
            Práctica anterior · Mejor resultado:{" "}
            {p.valleyQuizBest}/16
          </p>
        )}
      </div>

      <div className="mt-6 rounded-2xl border bg-card p-5 shadow-quest">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold">
              🏙️ Ciudad Tecnológica
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {technologyCompleted}/6 zonas completadas
            </p>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-sm font-bold">
            {isTechnologyComplete(p)
              ? "✅ Completo"
              : "🏙️ En progreso"}
          </span>
        </div>

        <progress
          aria-label="Progreso de Ciudad Tecnológica"
          value={technologyCompleted}
          max={6}
          className="quest-progress mt-3 h-3 w-full"
        />

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {TECHNOLOGY_ZONES.map((zone) => {
            const completed =
              p.technologyAdventure.completed.includes(zone.id);

            return (
              <div
                key={zone.id}
                className={`rounded-xl border-2 p-3 ${
                  completed
                    ? "border-gold bg-card"
                    : "border-border"
                }`}
              >
                <p className="font-semibold">
                  {completed ? "✅" : "⬜"} {zone.emoji}{" "}
                  {zone.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-card p-5 shadow-quest">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold">
              🏰 Fortaleza de la Evaluación
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {fortressCompleted}/6 zonas completadas
            </p>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-sm font-bold">
            {isFortressComplete(p)
              ? "✅ Completo"
              : "🏰 En progreso"}
          </span>
        </div>

        <progress
          aria-label="Progreso de la Fortaleza de la Evaluación"
          value={fortressCompleted}
          max={6}
          className="quest-progress mt-3 h-3 w-full"
        />

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {FORTRESS_ZONES.map((zone) => {
            const completed =
              p.fortressAdventure.completed.includes(zone.id);

            return (
              <div
                key={zone.id}
                className={`rounded-xl border-2 p-3 ${
                  completed
                    ? "border-gold bg-card"
                    : "border-border"
                }`}
              >
                <p className="font-semibold">
                  {completed ? "✅" : "⬜"} {zone.emoji}{" "}
                  {zone.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => {
          if (confirm("¿Borrar todo tu progreso?")) {
            resetProgress();
          }
        }}
        className="mt-6 rounded-full border-2 border-destructive px-5 py-2 text-sm font-bold text-destructive"
      >
        Reiniciar progreso
      </Button>
    </PageShell>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border-2 border-gold bg-card p-5 text-center shadow-quest">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-display text-3xl font-bold text-primary">
        {value}
      </p>
    </div>
  );
}
