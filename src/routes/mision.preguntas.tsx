import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/QuestNav";
import { FOREST_QUESTIONS, XP_PER_CORRECT } from "@/game/data";
import { addXp, finishQuiz, unlockBadge } from "@/game/progress";

export const Route = createFileRoute("/mision/preguntas")({
  head: () => ({
    meta: [
      { title: "El Sendero de las Preguntas — Proyecto Quest" },
      { name: "description", content: "Responde preguntas de opción múltiple y gana XP." },
      { property: "og:title", content: "El Sendero de las Preguntas" },
      { property: "og:description", content: "Misión de preguntas del Bosque del Conocimiento." },
    ],
  }),
  component: Quiz,
});

function Quiz() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const total = FOREST_QUESTIONS.length;
  const q = FOREST_QUESTIONS[index]!;

  function answer(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) {
      setCorrect((c) => c + 1);
      addXp(XP_PER_CORRECT);
      unlockBadge("first-step");
    }
  }

  function next() {
    if (index + 1 >= total) {
      finishQuiz(correct);
      setFinished(true);
    } else {
      setIndex(index + 1);
      setSelected(null);
    }
  }

  function restart() {
    setIndex(0); setSelected(null); setCorrect(0); setFinished(false);
  }

  if (finished) {
    return (
      <PageShell title="🏆 ¡Misión completada!">
        <div className="mx-auto max-w-lg rounded-2xl border-2 border-gold bg-card p-8 text-center shadow-quest">
          <p className="text-6xl">{correct === total ? "🦉" : "🌲"}</p>
          <p className="mt-4 text-2xl font-bold">{correct} de {total} correctas</p>
          <p className="mt-2 text-muted-foreground">Ganaste <b className="text-primary">{correct * XP_PER_CORRECT} XP</b> en esta misión.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={restart} className="rounded-full border-2 border-primary px-5 py-2 font-bold text-primary">Reintentar</button>
            <Link to="/misiones" className="rounded-full bg-primary px-5 py-2 font-bold text-primary-foreground">Siguiente misión</Link>
            <Link to="/mapa" className="rounded-full bg-secondary px-5 py-2 font-bold text-secondary-foreground">Volver al mapa</Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const answered = selected !== null;
  const isRight = selected === q.correct;

  return (
    <PageShell title="❓ El Sendero de las Preguntas">
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 flex justify-between text-sm font-semibold text-muted-foreground">
          <span>Pregunta {index + 1} de {total}</span>
          <span>Aciertos: {correct}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-gold-gradient transition-all" style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }} />
        </div>

        <div className="mt-6 rounded-2xl border-2 border-gold bg-card p-6 shadow-quest">
          <h2 className="text-xl font-bold">{q.question}</h2>
          <div className="mt-5 grid gap-3">
            {q.options.map((opt, i) => {
              let cls = "border-border bg-background hover:border-secondary";
              if (answered) {
                if (i === q.correct) cls = "border-success bg-accent";
                else if (i === selected) cls = "border-destructive bg-destructive/10";
                else cls = "border-border bg-background opacity-60";
              }
              return (
                <button key={i} onClick={() => answer(i)} disabled={answered}
                  className={`rounded-xl border-2 px-4 py-3 text-left font-semibold transition ${cls}`}>
                  <span className="mr-2 text-secondary">{String.fromCharCode(65 + i)}.</span>{opt}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className={`mt-5 rounded-xl p-4 ${isRight ? "bg-accent text-accent-foreground" : "bg-destructive/10 text-destructive"}`}>
              <p className="font-bold">{isRight ? `✅ ¡Correcto! +${XP_PER_CORRECT} XP` : "❌ Incorrecto"}</p>
              <p className="mt-1 text-sm text-foreground">{q.explanation}</p>
            </div>
          )}

          {answered && (
            <button onClick={next} className="mt-5 w-full rounded-full bg-primary py-3 font-bold text-primary-foreground">
              {index + 1 >= total ? "Ver resultados" : "Continuar →"}
            </button>
          )}
        </div>
        <Link to="/mapa" className="mt-6 inline-block font-semibold text-secondary hover:underline">← Volver al mapa</Link>
      </div>
    </PageShell>
  );
}
