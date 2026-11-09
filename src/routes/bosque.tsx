
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/QuestNav";
import { QuestGuide } from "@/components/QuestRewards";
import { MagicCard } from "@/components/MagicCard";
import {
  FOREST_ZONES,
  FOREST_ZONE_XP,
  discoveredForestTerms,
  forestZoneUnlocked,
  forestOfficialTerm,
} from "@/game/forest-adventure";
import { useProgress } from "@/game/progress";
import landscape from "@/assets/forest-adventure.jpg";
import explorer from "@/assets/explorer-guide.png";
import { useState } from "react";

export const Route = createFileRoute("/bosque")({
  head: () => ({
    meta: [
      { title: "Bosque del Conocimiento — Aventura de Proyecto Quest" },
      {
        name: "description",
        content:
          "Explora seis zonas del Bosque, descubre cartas mágicas y desbloquea nuevos caminos.",
      },
      {
        property: "og:title",
        content: "Bosque del Conocimiento — Proyecto Quest",
      },
      {
        property: "og:description",
        content:
          "Una aventura con cartas mágicas, una colección y seis zonas del Bosque.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Forest,
});

function Forest() {
  const p = useProgress();
  const adventure = p.forestAdventure;
  const collection = discoveredForestTerms(adventure);
  const [flipped, setFlipped] = useState<number[]>([]);

  const count = adventure.completed.length;
  const current = Math.min(count, FOREST_ZONES.length - 1);

  return (
    <PageShell title="🌲 Bosque del Conocimiento">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-bold text-secondary">
          {count}/6 zonas exploradas · {count * FOREST_ZONE_XP} XP recuperados
        </p>

        <progress
          aria-label="Zonas del Bosque completadas"
          value={count}
          max={6}
          className="quest-progress h-3 w-48"
        />
      </div>

      <div className="forest-world relative overflow-hidden">
        <img
          src={landscape}
          width={1536}
          height={1024}
          alt="Bosque ilustrado con seis zonas conectadas por un camino"
          className="h-full w-full object-cover"
        />

        {FOREST_ZONES.map((zone, i) => {
          const unlocked = forestZoneUnlocked(adventure, i);
          const done = adventure.completed.includes(zone.id);

          return (
            <div
              key={zone.id}
              className={`forest-location forest-location-${i + 1}`}
            >
              <Button
                asChild={unlocked}
                disabled={!unlocked}
                aria-label={`${zone.name}${
                  done
                    ? ", completada"
                    : !unlocked
                      ? ", bloqueada"
                      : ", disponible"
                }`}
                title={zone.name}
                className={`h-12 w-12 rounded-full border-2 p-0 shadow-quest ${
                  done
                    ? "border-success bg-primary"
                    : unlocked
                      ? "forest-beacon border-gold bg-gold text-gold-foreground"
                      : "border-border bg-card text-muted-foreground disabled:opacity-90"
                }`}
              >
                {unlocked ? (
                  <Link
                    to="/aventura/$zona"
                    params={{ zona: zone.id }}
                  >
                    {done ? (
                      <Check />
                    ) : (
                      <span className="text-xl">{zone.emoji}</span>
                    )}
                  </Link>
                ) : (
                  <Lock />
                )}
              </Button>

              <span className="forest-location-label mt-1 block rounded-md bg-card/95 px-2 py-1 text-center text-xs font-extrabold text-foreground">
                {i + 1}. {zone.name}
              </span>
            </div>
          );
        })}

        <img
          key={current}
          src={explorer}
          width={816}
          height={816}
          alt="Tu explorador en el camino"
          className={`forest-explorer forest-explorer-${current} quest-enter absolute h-20 w-16 object-contain`}
        />
      </div>

      <div className="mt-4">
        <QuestGuide
          message={
            count === 6
              ? "¡Conquistamos el Bosque! Cada zona nos dejó un nuevo conocimiento."
              : count
                ? `¡Camino abierto! Nos espera ${FOREST_ZONES[current]?.name}.`
                : "¡Bienvenido! Nuestra aventura comienza en el Árbol de los Conceptos."
          }
        />
      </div>

      <ol className="mt-5 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {FOREST_ZONES.map((zone, i) => {
          const unlocked = forestZoneUnlocked(adventure, i);
          const done = adventure.completed.includes(zone.id);

          return (
            <li
              key={zone.id}
              className="flex items-center gap-3 border-b py-4"
            >
              <span className="text-2xl">
                {done ? "✅" : unlocked ? zone.emoji : "🔒"}
              </span>

              <div className="min-w-0 flex-1">
                <h2 className="font-sans text-base font-extrabold">
                  {zone.name}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {done
                    ? `Completada · ${FOREST_ZONE_XP} XP`
                    : unlocked
                      ? `Camino abierto · ${FOREST_ZONE_XP} XP`
                      : "Camino por descubrir"}
                </p>
              </div>

              {unlocked && (
                <Button
                  asChild
                  size="icon"
                  variant="ghost"
                  aria-label={`Entrar a ${zone.name}`}
                  title={`Entrar a ${zone.name}`}
                >
                  <Link
                    to="/aventura/$zona"
                    params={{ zona: zone.id }}
                  >
                    <ArrowRight />
                  </Link>
                </Button>
              )}
            </li>
          );
        })}
      </ol>

      <section className="mt-8 border-t pt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold text-primary">
            ✦ Cartas del Bosque
          </h2>

          <span className="text-sm font-bold text-secondary">
            {collection.length} descubiertas
          </span>
        </div>

        {collection.length ? (
          <div className="card-collection">
            {collection.map((number) => {
              const term = forestOfficialTerm(number);

              return (
                <MagicCard
                  key={number}
                  compact
                  revealed={!flipped.includes(number)}
                  label={`Voltear carta de ${term.term}`}
                  title={term.term}
                  symbol={
                    FOREST_ZONES.find((zone) =>
                      zone.terms.includes(number),
                    )?.emoji ?? "🌿"
                  }
                  world="bosque"
                  onClick={() =>
                    setFlipped((previous) =>
                      previous.includes(number)
                        ? previous.filter((n) => n !== number)
                        : [...previous, number],
                    )
                  }
                >
                  {term.definition}
                </MagicCard>
              );
            })}
          </div>
        ) : (
          <QuestGuide message="La primera carta nos espera en el Árbol de los Conceptos." />
        )}
      </section>

      <div className="mt-6 flex flex-wrap gap-4">
        <Button asChild variant="link">
          <Link to="/mapa">← Volver al mapa</Link>
        </Button>
      </div>
    </PageShell>
  );
}
