import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, RotateCcw, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/QuestNav";
import { QuestGuide, RewardStars } from "@/components/QuestRewards";
import { BADGES, XP_PER_CORRECT, type Question } from "@/game/data";
import { completeQuizSession, recordQuizAnswer, saveQuizSession, useProgress, type QuizSession } from "@/game/progress";

const START: QuizSession = { index: 0, selected: null, correct: 0, finished: false, earnedBadges: [] };

export function QuizMission({ world, questions, title }: { world: "bosque" | "valle"; questions: Question[]; title: string }) {
  const p = useProgress();
  const session = p.sessions[world] ?? START;
  const { index, selected, correct, finished } = session;
  const lock = useRef(false);
  const total = questions.length;
  const q = questions[index];
  const back = world === "valle" ? "/valle" : "/misiones";

  function answer(option: number) {
    if (!q || selected !== null || lock.current) return;
    lock.current = true;
    const right = option === q.correct;
    recordQuizAnswer(world, { ...session, selected: option, correct: correct + (right ? 1 : 0) }, right);
  }
  function next() {
    if (selected === null) return;
    if (index + 1 >= total) completeQuizSession(world, session);
    else saveQuizSession(world, { ...session, index: index + 1, selected: null });
    lock.current = false;
  }
  function restart() { lock.current = false; saveQuizSession(world, { ...START }); }

  if (finished) return (
    <PageShell title="🏆 ¡Misión completada!">
      <section className="relative mx-auto max-w-2xl py-6 text-center">
        <RewardStars />
        <QuestGuide message="¡Una nueva etapa de tu aventura!" celebrate />
        <p className="mt-4 text-3xl font-extrabold">{correct} de {total} correctas</p>
        <p className="quest-reward mt-4 text-4xl font-extrabold text-primary">+{correct * XP_PER_CORRECT} XP</p>
        <p className="mt-2 text-sm text-muted-foreground">Experiencia total: {p.xp} XP</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {session.earnedBadges.map((id) => { const badge = BADGES.find((b) => b.id === id); return badge ? <p key={id} className="quest-reward rounded-xl border-2 border-gold bg-card px-4 py-3 font-bold">{badge.emoji} Insignia desbloqueada: {badge.name}</p> : null; })}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={restart} variant="outline" className="rounded-full"><RotateCcw /> Reintentar</Button>
          <Button asChild className="rounded-full"><Link to={back}>Volver a misiones <ArrowRight /></Link></Button>
          <Button asChild variant="secondary" className="rounded-full"><Link to="/mapa"><Map /> Volver al mapa</Link></Button>
        </div>
      </section>
    </PageShell>
  );

  if (!q) return null;
  const answered = selected !== null;
  const right = selected === q.correct;
  return (
    <PageShell title={title}>
      <div className="mx-auto max-w-2xl">
        <QuestGuide message={answered ? (right ? "¡BIEN! Sigamos explorando." : "¡CASI! Sigamos adelante.") : "¡Vamos por la siguiente recompensa!"} />
        <div className="mt-4 mb-2 flex justify-between text-sm font-bold text-muted-foreground"><span>Pregunta {index + 1} de {total}</span><span>Aciertos: {correct}</span></div>
        <progress aria-label="Progreso de la misión" className="quest-progress h-3 w-full" value={index + (answered ? 1 : 0)} max={total} />
        <section key={index} className="quest-enter mt-5">
          {world === "valle" && <p className="mb-2 text-sm font-bold text-secondary">¿A qué concepto corresponde esta definición?</p>}
          <h2 className="text-xl font-bold leading-relaxed">{q.question}</h2>
          <div className="mt-5 grid gap-3">
            {q.options.map((option, i) => (
              <Button key={i} variant="outline" disabled={answered} onClick={() => answer(i)} className={`h-auto min-h-14 justify-start whitespace-normal rounded-xl border-2 px-4 py-3 text-left text-base font-bold disabled:opacity-100 ${answered ? i === q.correct ? "quest-positive border-success bg-accent" : i === selected ? "quest-nudge border-secondary bg-muted" : "opacity-60" : "bg-card hover:border-secondary"}`}>
                <span className="shrink-0 text-secondary">{String.fromCharCode(65 + i)}.</span><span>{option}</span>{answered && i === q.correct && <span aria-hidden="true" className="ml-auto">✓</span>}
              </Button>
            ))}
          </div>
          {answered && <div role="status" className={`relative mt-5 rounded-xl p-4 ${right ? "bg-accent" : "bg-muted"}`}>
            {right && <RewardStars />}
            <div className="flex flex-wrap items-center gap-3"><p className="quest-reward text-2xl font-extrabold text-primary">{right ? "¡CORRECTO!" : "¡CASI!"}</p>{right && <span className="quest-xp font-extrabold text-secondary">+{XP_PER_CORRECT} XP</span>}</div>
            <p className="mt-2 text-sm leading-relaxed">{q.explanation}</p>
          </div>}
          {answered && <Button onClick={next} className="mt-5 h-12 w-full rounded-full text-base font-bold">{index + 1 >= total ? "Ver resultados" : "Continuar"}<ArrowRight /></Button>}
        </section>
        <Button asChild variant="link" className="mt-5"><Link to={back}>← Volver a misiones</Link></Button>
      </div>
    </PageShell>
  );
}