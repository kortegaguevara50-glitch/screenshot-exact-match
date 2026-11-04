import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/QuestNav";
import { QuestGuide } from "@/components/QuestRewards";
import { VALLEY_ZONES, ZONE_XP, zoneUnlocked } from "@/game/valley-adventure";
import { useProgress } from "@/game/progress";
import landscape from "@/assets/valley-adventure.jpg";
import explorer from "@/assets/explorer-guide.png";

export const Route = createFileRoute("/valle")({
  head: () => ({ meta: [
    { title: "Valle de la Planificación — Aventura de Proyecto Quest" },
    { name: "description", content: "Explora seis zonas del Valle, recupera piezas, resuelve retos y desbloquea nuevos caminos." },
    { property: "og:title", content: "Valle de la Planificación — Proyecto Quest" },
    { property: "og:description", content: "Una aventura por seis zonas con retos del glosario oficial." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }), component: Valley,
});
function Valley() {
  const p = useProgress(); const adventure = p.valleyAdventure;
  const count = adventure.completed.length; const current = Math.min(count, VALLEY_ZONES.length - 1);
  return <PageShell title="🗺️ Valle de la Planificación">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="font-bold text-secondary">{count}/6 zonas exploradas · {count * ZONE_XP} XP recuperados</p><progress aria-label="Zonas del Valle completadas" value={count} max={6} className="quest-progress h-3 w-48" /></div>
    <div className="valley-world relative overflow-hidden">
      <img src={landscape} width={1536} height={1024} alt="Valle ilustrado con aldea, puente, torre, campamento, mirador y cumbre conectados por un camino" className="h-full w-full object-cover" />
      {VALLEY_ZONES.map((zone, i) => { const unlocked = zoneUnlocked(adventure, i); const done = adventure.completed.includes(zone.id);
        return <div key={zone.id} className={`valley-location valley-location-${i}`}><Button asChild={unlocked} disabled={!unlocked} aria-label={`${zone.name}${done ? ", completada" : !unlocked ? ", bloqueada" : ", disponible"}`} title={zone.name} className={`h-12 w-12 rounded-full border-2 p-0 shadow-quest ${done ? "border-success bg-primary" : unlocked ? "valley-beacon border-gold bg-gold text-gold-foreground" : "border-border bg-card text-muted-foreground disabled:opacity-90"}`}>
          {unlocked ? <Link to="/aventura/$zona" params={{ zona: zone.id }}>{done ? <Check /> : <span className="text-xl">{zone.emoji}</span>}</Link> : <Lock />}
        </Button><span className="valley-location-label mt-1 block rounded-md bg-card/95 px-2 py-1 text-center text-xs font-extrabold text-foreground">{i + 1}. {zone.name}</span></div>;
      })}
      <img key={current} src={explorer} width={816} height={816} alt="Tu explorador en el camino" className={`valley-explorer valley-explorer-${current} quest-enter absolute h-20 w-16 object-contain`} />
    </div>
    <div className="mt-4"><QuestGuide message={count === 6 ? "¡Conquistamos el Valle! Cada camino cuenta una historia." : count ? `¡Camino abierto! Nos espera ${VALLEY_ZONES[current]?.name}.` : "¡Bienvenido! Nuestra aventura comienza en la aldea."} /></div>
    <ol className="mt-5 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">{VALLEY_ZONES.map((zone, i) => { const unlocked = zoneUnlocked(adventure, i); const done = adventure.completed.includes(zone.id); return <li key={zone.id} className="flex items-center gap-3 border-b py-4"><span className="text-2xl">{done ? "✅" : unlocked ? zone.emoji : "🔒"}</span><div className="min-w-0 flex-1"><h2 className="font-sans text-base font-extrabold">{zone.name}</h2><p className="mt-1 text-xs text-muted-foreground">{done ? "Completada · 20 XP" : unlocked ? "Camino abierto · 20 XP" : "Camino por descubrir"}</p></div>{unlocked && <Button asChild size="icon" variant="ghost" aria-label={`Entrar a ${zone.name}`} title={`Entrar a ${zone.name}`}><Link to="/aventura/$zona" params={{ zona: zone.id }}><ArrowRight /></Link></Button>}</li>; })}</ol>
    <div className="mt-6 flex flex-wrap gap-4"><Button asChild variant="link"><Link to="/mapa">← Volver al mapa</Link></Button><Button asChild variant="link"><Link to="/mision/valle">Práctica de conceptos</Link></Button></div>
  </PageShell>;
}
