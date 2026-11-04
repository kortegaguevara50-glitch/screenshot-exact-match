import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/QuestNav";
import { ValleyChallenge } from "@/components/ValleyChallenge";
import { VALLEY_ZONES } from "@/game/valley-adventure";

export const Route = createFileRoute("/aventura/$zona")({
  head: ({ params }) => { const zone = VALLEY_ZONES.find((entry) => entry.id === params.zona); const title = `${zone?.name ?? "Zona del Valle"} — Proyecto Quest`; return { meta: [
    { title }, { name: "description", content: "Una zona de aventura del Valle de la Planificación con retos del glosario oficial." },
    { property: "og:title", content: title }, { property: "og:description", content: "Recupera las piezas del Valle y desbloquea un nuevo camino." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }; },
  component: Zone,
});
function Zone() {
  const { zona } = Route.useParams(); const zone = VALLEY_ZONES.find((entry) => entry.id === zona);
  return <PageShell title={zone ? `${zone.emoji} ${zone.name}` : "Zona no encontrada"}><div className="mx-auto max-w-3xl">{zone && <ValleyChallenge key={zone.id} zone={zone} />}<Link to="/valle" className="mt-6 inline-block font-bold text-secondary">← Volver al Valle</Link></div></PageShell>;
}