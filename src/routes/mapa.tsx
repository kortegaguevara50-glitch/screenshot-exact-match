import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/QuestNav";
import { WORLDS } from "@/game/data";
import {
  isForestComplete,
  isValleyComplete,
  isFortressComplete,
  useProgress,
} from "@/game/progress";

import forestImage from "@/assets/forest-adventure.jpg";
import valleyImage from "@/assets/valley-adventure.jpg";
import cityImage from "@/assets/technology-city.jpg";
import fortressImage from "@/assets/fortaleza.jpg";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Mapa de mundos — Proyecto Quest" },
      {
        name: "description",
        content: "Elige tu próximo mundo en Proyecto Quest.",
      },
      {
        property: "og:title",
        content: "Mapa de mundos — Proyecto Quest",
      },
      {
        property: "og:description",
        content: "Cuatro mundos por explorar.",
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const p = useProgress();

  return (
    <PageShell
      title="Mapa del reino"
      subtitle="Explora los cuatro mundos y completa sus zonas."
    >
      <div className="relative overflow-hidden rounded-3xl border-4 border-indigo-300/40 bg-gradient-to-br from-indigo-300 via-purple-300 to-blue-300 p-4 shadow-2xl sm:p-6 md:p-8">
        {/* Decoración del mapa */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute left-10 top-10 h-20 w-20 rounded-full border-4 border-indigo-900" />
          <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full border-4 border-purple-900" />
        </div>

        {/* Caminos del mapa */}
        <div className="pointer-events-none absolute left-1/2 top-[27%] hidden h-[45%] w-1 -translate-x-1/2 bg-indigo-900/25 md:block" />

        <div className="pointer-events-none absolute left-[25%] top-1/2 hidden h-1 w-[50%] -translate-y-1/2 bg-indigo-900/25 md:block" />

        <div className="relative z-10 grid gap-5 md:grid-cols-2">
          {WORLDS.map((w, i) => {
            const done =
              w.id === "bosque"
                ? isForestComplete(p)
                : w.id === "valle"
                  ? isValleyComplete(p)
                  : w.id === "ciudad"
                    ? p.technologyAdventure.completed.length === 6
                    : w.id === "fortaleza"
                      ? isFortressComplete(p)
                      : false;

            const completedZones =
              w.id === "bosque"
                ? p.forestAdventure.completed.length
                : w.id === "valle"
                  ? p.valleyAdventure.completed.length
                  : w.id === "ciudad"
                    ? p.technologyAdventure.completed.length
                    : w.id === "fortaleza"
                      ? p.fortressAdventure.completed.length
                      : 0;

            const image =
              w.id === "bosque"
                ? forestImage
                : w.id === "valle"
                  ? valleyImage
                  : w.id === "ciudad"
                    ? cityImage
                    : fortressImage;

            const content = (
              <div
                className={`group overflow-hidden rounded-3xl border-4 bg-card shadow-xl transition-all duration-300 ${
                  w.available
                    ? "border-amber-600 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl"
                    : "border-gray-400 opacity-60"
                }`}
              >
                {/* Imagen del mundo */}
                <div className="relative h-48 overflow-hidden sm:h-56">
                  <img
                    src={image}
                    alt={w.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Capa sobre la imagen */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Número del mundo */}
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-amber-900 shadow">
                    Mundo {i + 1}
                  </div>

                  {/* Estado */}
                  <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-700 shadow">
                    {done
                      ? "✅ Completado"
                      : w.available
                        ? "Disponible"
                        : "🔒 Próximamente"}
                  </div>

                  {/* Nombre */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{w.emoji}</span>
                      <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                        {w.name}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Información */}
                <div className="bg-card p-5">
                  <p className="text-sm text-muted-foreground">
                    {w.description}
                  </p>

                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-secondary">
                        Zonas exploradas
                      </p>

                      <p className="text-sm font-bold text-secondary">
                        {completedZones}/6
                      </p>
                    </div>

                    <progress
                      aria-label={`Avance de ${w.name}`}
                      value={completedZones}
                      max={6}
                      className="quest-progress mt-2 h-2 w-full"
                    />
                  </div>

                  {w.available && (
                    <div className="mt-4 text-center text-sm font-bold text-primary">
                      🧭 Entrar al mundo →
                    </div>
                  )}
                </div>
              </div>
            );

            return w.available ? (
              <Link
                key={w.id}
                to={
                  w.id === "bosque"
                    ? "/bosque"
                    : w.id === "valle"
                      ? "/valle"
                      : w.id === "ciudad"
                        ? "/ciudad"
                        : "/fortaleza"
                }
              >
                {content}
              </Link>
            ) : (
              <div key={w.id}>{content}</div>
            );
          })}
        </div>

        {/* Leyenda */}
        <div className="relative z-10 mt-6 rounded-2xl border-2 border-indigo-900/20 bg-white/45 p-4 text-center backdrop-blur-sm">
          <p className="text-sm font-semibold text-indigo-950">
            🗺️ Explora cada territorio, completa sus zonas y desbloquea todo el
            reino.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
