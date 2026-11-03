import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/QuestNav";
import { GLOSSARY, WORLDS, type WorldId } from "@/game/data";

export const Route = createFileRoute("/glosario")({
  head: () => ({
    meta: [
      { title: "Glosario — Proyecto Quest" },
      { name: "description", content: "Los 68 conceptos de Administración y Evaluación de Proyectos e Innovación Tecnológica." },
      { property: "og:title", content: "Glosario — Proyecto Quest" },
      { property: "og:description", content: "Conceptos y definiciones organizados por mundo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Glossary,
});

function Glossary() {
  const [query, setQuery] = useState("");
  const [world, setWorld] = useState<WorldId | "all">("all");
  const q = query.trim().toLowerCase();
  const filtered = GLOSSARY.filter(
    (t) =>
      (world === "all" || t.world === world) &&
      (!q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)),
  );

  return (
    <PageShell title="📜 Glosario" subtitle={`${GLOSSARY.length} conceptos clave para tu aventura.`}>
      <div className="mb-6 flex flex-col gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar concepto…"
          className="w-full rounded-xl border bg-card px-4 py-2 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          {[{ id: "all" as const, name: "Todos", emoji: "📚" }, ...WORLDS].map((w) => (
            <button
              key={w.id}
              onClick={() => setWorld(w.id)}
              className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                world === w.id ? "bg-primary text-primary-foreground" : "bg-card"
              }`}
            >
              {w.emoji} {w.name} ({w.id === "all" ? GLOSSARY.length : GLOSSARY.filter((t) => t.world === w.id).length})
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">Mostrando {filtered.length} conceptos</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((t) => {
          const w = WORLDS.find((x) => x.id === t.world)!;
          return (
            <div key={t.number} className="rounded-2xl border bg-card p-5 shadow-quest">
              <div className="text-xs font-semibold text-muted-foreground">
                #{t.number} · {w.emoji} {w.name}
              </div>
              <h2 className="mt-1 text-lg font-bold text-secondary">{t.term}</h2>
              <p className="mt-2 text-sm">{t.definition}</p>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
