import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/QuestNav";
import { BADGES } from "@/game/data";
import { useProgress } from "@/game/progress";

export const Route = createFileRoute("/insignias")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Insignias — Proyecto Quest" },
      { name: "description", content: "Recompensas obtenidas en tu aventura." },
      { property: "og:title", content: "Insignias — Proyecto Quest" },
      { property: "og:description", content: "Colecciona insignias completando misiones." },
    ],
  }),
  component: Badges,
});

function Badges() {
  const p = useProgress();
  return (
    <PageShell title="🏅 Insignias" subtitle={`Has obtenido ${p.badges.length} de ${BADGES.length}.`}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {BADGES.map((b) => {
          const got = p.badges.includes(b.id);
          return (
            <div key={b.id} className={`rounded-2xl border-2 bg-card p-5 text-center shadow-quest ${got ? "border-gold" : "opacity-50 grayscale"}`}>
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl ${got ? "bg-gold-gradient" : "bg-muted"}`}>{got ? b.emoji : "🔒"}</div>
              <h2 className="mt-3 text-sm font-bold">{b.name}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{b.description}</p>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
