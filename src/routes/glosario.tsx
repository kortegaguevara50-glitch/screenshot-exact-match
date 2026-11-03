import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/QuestNav";
import { GLOSSARY } from "@/game/data";

export const Route = createFileRoute("/glosario")({
  head: () => ({
    meta: [
      { title: "Glosario — Proyecto Quest" },
      { name: "description", content: "Conceptos clave de proyectos e innovación tecnológica." },
      { property: "og:title", content: "Glosario — Proyecto Quest" },
      { property: "og:description", content: "Conceptos y definiciones del juego." },
    ],
  }),
  component: Glossary,
});

function Glossary() {
  return (
    <PageShell title="📜 Glosario" subtitle="Conceptos clave para tu aventura.">
      <div className="grid gap-4 sm:grid-cols-2">
        {GLOSSARY.map((t) => (
          <div key={t.term} className="rounded-2xl border bg-card p-5 shadow-quest">
            <h2 className="text-lg font-bold text-secondary">{t.term}</h2>
            <p className="mt-2 text-sm">{t.definition}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
