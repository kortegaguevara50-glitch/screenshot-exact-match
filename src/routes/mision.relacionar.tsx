import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/QuestNav";
import { MATCH_PAIRS, XP_PER_MATCH } from "@/game/data";
import { addXp, finishMatch } from "@/game/progress";

export const Route = createFileRoute("/mision/relacionar")({
  head: () => ({
    meta: [
      { title: "El Puente de los Conceptos — Proyecto Quest" },
      { name: "description", content: "Relaciona conceptos con sus definiciones." },
      { property: "og:title", content: "El Puente de los Conceptos" },
      { property: "og:description", content: "Actividad de relacionar del Bosque del Conocimiento." },
    ],
  }),
  component: Match,
});

// Orden fijo de definiciones (evita aleatoriedad que rompa el renderizado del servidor)
const DEF_ORDER = [2, 0, 3, 1];

function Match() {
  const [term, setTerm] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const done = matched.length === MATCH_PAIRS.length;

  function pickDef(d: number) {
    if (term === null || matched.includes(d)) return;
    if (d === term) {
      const next = [...matched, d];
      setMatched(next);
      addXp(XP_PER_MATCH);
      if (next.length === MATCH_PAIRS.length) finishMatch();
    } else {
      setWrong(d);
      setTimeout(() => setWrong(null), 600);
    }
    setTerm(null);
  }

  function restart() { setMatched([]); setTerm(null); }

  return (
    <PageShell title="🔗 El Puente de los Conceptos" subtitle="Elige un concepto y luego su definición.">
      <p className="mb-4 text-sm font-semibold text-muted-foreground">Relacionados: {matched.length} de {MATCH_PAIRS.length}</p>
      {done ? (
        <div className="mx-auto max-w-lg rounded-2xl border-2 border-gold bg-card p-8 text-center shadow-quest">
          <p className="text-6xl">🔗</p>
          <p className="mt-4 text-2xl font-bold">¡Puente cruzado!</p>
          <p className="mt-2 text-muted-foreground">Ganaste <b className="text-primary">{MATCH_PAIRS.length * XP_PER_MATCH} XP</b> y la insignia Maestro de Enlaces.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={restart} className="rounded-full border-2 border-primary px-5 py-2 font-bold text-primary">Repetir</button>
            <Link to="/mapa" className="rounded-full bg-secondary px-5 py-2 font-bold text-secondary-foreground">Volver al mapa</Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-3">
            {MATCH_PAIRS.map((p, i) => (
              <button key={p.term} disabled={matched.includes(i)} onClick={() => setTerm(i)}
                className={`rounded-xl border-2 px-4 py-3 text-left font-bold transition ${matched.includes(i) ? "border-success bg-accent opacity-70" : term === i ? "border-gold bg-gold/20" : "border-border bg-card hover:border-secondary"}`}>
                {matched.includes(i) ? "✅ " : ""}{p.term}
              </button>
            ))}
          </div>
          <div className="grid gap-3">
            {DEF_ORDER.map((d) => (
              <button key={d} disabled={matched.includes(d)} onClick={() => pickDef(d)}
                className={`rounded-xl border-2 px-4 py-3 text-left text-sm transition ${matched.includes(d) ? "border-success bg-accent opacity-70" : wrong === d ? "border-destructive bg-destructive/10" : "border-border bg-card hover:border-secondary"}`}>
                {MATCH_PAIRS[d].definition}
              </button>
            ))}
          </div>
        </div>
      )}
      <Link to="/misiones" className="mt-8 inline-block font-semibold text-secondary hover:underline">← Volver a misiones</Link>
    </PageShell>
  );
}
