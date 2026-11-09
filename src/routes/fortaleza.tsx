import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/QuestNav";
import { QuestGuide } from "@/components/QuestRewards";
import { MagicCard } from "@/components/MagicCard";
import {
  discoveredFortressTerms,
  fortressOfficialTerm,
  FORTRESS_ZONES,
  FORTRESS_ZONE_XP,
  fortressZoneUnlocked,
} from "@/game/fortress-adventure";
import { useProgress } from "@/game/progress";
import fortress from "@/assets/fortaleza.jpg";
import explorer from "@/assets/explorer-guide.png";

export const Route = createFileRoute("/fortaleza")({
  head: () => ({
    meta: [
      {
        title: "Fortaleza de la Evaluación — Aventura de Proyecto Quest",
      },
      {
        name: "description",
        content:
          "Explora seis zonas de la Fortaleza de la Evaluación y descubre conceptos sobre evaluación, control, recursos y resultados.",
      },
      {
        property: "og:title",
        content: "Fortaleza de la Evaluación — Proyecto Quest",
      },
      {
        property: "og:description",
        content:
          "Una aventura con cartas mágicas y seis zonas de evaluación por descubrir.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Fortress,
});

function Fortress() {
  const p = useProgress();
  const adventure = p.fortressAdventure;
  const collection = discoveredFortressTerms(adventure);

  const [flipped, setFlipped] = useState<number[]>([]);

  const count = adventure.completed.length;

  const current = Math.min(
    count,
    FORTRESS_ZONES.length - 1,
  );

  return (
    <PageShell title="🏰 Fortaleza de la Evaluación">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-bold text-secondary">
          {count}/6 zonas exploradas ·{" "}
          {count * FORTRESS_ZONE_XP} XP recuperados
        </p>

        <progress
          aria-label="Zonas de la Fortaleza completadas"
          value={count}
          max={6}
          className="quest-progress h-3 w-48"
        />
      </div>

      <div className="fortress-world relative overflow-hidden">
        <img
          src={fortress}
          width={1536}
          height={1024}
          alt="Fortaleza ilustrada con seis zonas conectadas por un camino"
          className="h-full w-full object-cover"
        />

        {FORTRESS_ZONES.map((zone, i) => {
          const unlocked = fortressZoneUnlocked(
            adventure,
            i,
          );

          const done = adventure.completed.includes(zone.id);

          return (
            <div
              key={zone.id}
              className={`fortress-location fortress-location-${i}`}
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
                      ? "fortress-beacon border-gold bg-gold text-gold-foreground"
                      : "border-border bg-card text-muted-foreground disabled:opacity-90"
                }`}
              >
                {unlocked ? (
                  <Link
                    to="/aventura-fortaleza/$zona"
                    params={{ zona: zone.id }}
                    className="flex h-full w-full items-center justify-center rounded-full"
                  >
                    {done ? (
                      <Check />
                    ) : (
                      <span className="text-xl">
                        {zone.emoji}
                      </span>
                    )}
                  </Link>
                ) : (
                  <Lock />
                )}
              </Button>

              <span className="fortress-location-label mt-1 block rounded-md bg-card/95 px-2 py-1 text-center text-xs font-extrabold text-foreground">
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
          className={`fortress-explorer fortress-explorer-${current} quest-enter absolute h-20 w-16 object-contain`}
        />
      </div>

      <div className="mt-4">
        <QuestGuide
          message={
            count === 6
              ? "¡Conquistamos la Fortaleza! Ya dominamos la evaluación, el control y los resultados."
              : count
                ? `¡Camino abierto! Nos espera ${FORTRESS_ZONES[current]?.name}.`
                : "¡Bienvenido! Nuestra aventura comienza en la Sala de los Indicadores."
          }
        />
      </div>

      <ol className="mt-5 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {FORTRESS_ZONES.map((zone, i) => {
          const unlocked = fortressZoneUnlocked(
            adventure,
            i,
          );

          const done = adventure.completed.includes(zone.id);

          return (
            <li
              key={zone.id}
              className="flex items-center gap-3 border-b py-4"
            >
              <span className="text-2xl">
                {done
                  ? "✅"
                  : unlocked
                    ? zone.emoji
                    : "🔒"}
              </span>

              <div className="min-w-0 flex-1">
                <h2 className="font-sans text-base font-extrabold">
                  {zone.name}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {done
                    ? "Completada · 20 XP"
                    : unlocked
                      ? "Camino abierto · 20 XP"
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
                    to="/aventura-fortaleza/$zona"
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
            ✦ Cartas de la Fortaleza
          </h2>

          <span className="text-sm font-bold text-secondary">
            {collection.length}/20 descubiertas
          </span>
        </div>

        {collection.length ? (
          <div className="card-collection">
            {collection.map((number) => {
              const term = fortressOfficialTerm(number);

              return (
                <MagicCard
                  key={number}
                  compact
                  revealed={!flipped.includes(number)}
                  label={`Voltear carta de ${term.term}`}
                  title={term.term}
                  symbol={
                    FORTRESS_ZONES.find((zone) =>
                      zone.terms.includes(number),
                    )?.emoji ?? "🏰"
                  }
                  onClick={() =>
                    setFlipped((previous) =>
                      previous.includes(number)
                        ? previous.filter(
                            (n) => n !== number,
                          )
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
          <QuestGuide message="La primera carta nos espera en la Sala de los Indicadores." />
        )}
      </section>

      <div className="mt-6">
        <Button asChild variant="link">
          <Link to="/mapa">← Volver al mapa</Link>
        </Button>
      </div>
    </PageShell>
  );
}