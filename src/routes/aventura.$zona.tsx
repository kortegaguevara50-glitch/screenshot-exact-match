
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/QuestNav";
import { ValleyChallenge } from "@/components/ValleyChallenge";
import { ForestChallenge } from "@/components/ForestChallenge";
import { VALLEY_ZONES } from "@/game/valley-adventure";
import { FOREST_ZONES } from "@/game/forest-adventure";

export const Route = createFileRoute("/aventura/$zona")({
  head: ({ params }) => {
    const zone =
      FOREST_ZONES.find((entry) => entry.id === params.zona) ??
      VALLEY_ZONES.find((entry) => entry.id === params.zona);

    const title = `${zone?.name ?? "Zona de aventura"} — Proyecto Quest`;

    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Descubre cartas mágicas y completa la misión ${zone?.name ?? "de Proyecto Quest"}.`,
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: "Completa misiones y desbloquea nuevos caminos.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: Zone,
});

function Zone() {
  const { zona } = Route.useParams();

  const forestZone = FOREST_ZONES.find((entry) => entry.id === zona);
  const valleyZone = VALLEY_ZONES.find((entry) => entry.id === zona);

  const zone = forestZone ?? valleyZone;

  return (
    <PageShell
      title={zone ? `${zone.emoji} ${zone.name}` : "Zona no encontrada"}
    >
      <div className="mx-auto max-w-3xl">
        {forestZone && (
          <ForestChallenge key={forestZone.id} zone={forestZone} />
        )}

        {valleyZone && (
          <ValleyChallenge key={valleyZone.id} zone={valleyZone} />
        )}

        {forestZone && (
          <Link
            to="/bosque"
            className="mt-6 inline-block font-bold text-secondary"
          >
            ← Volver al Bosque
          </Link>
        )}

        {valleyZone && (
          <Link
            to="/valle"
            className="mt-6 inline-block font-bold text-secondary"
          >
            ← Volver al Valle
          </Link>
        )}

        {!zone && (
          <div className="mt-6 space-y-4">
            <p>
              La zona que buscas no existe o no está disponible.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/bosque"
                className="font-bold text-secondary"
              >
                ← Ir al Bosque
              </Link>

              <Link
                to="/valle"
                className="font-bold text-secondary"
              >
                ← Ir al Valle
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
