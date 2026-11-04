import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUp, ArrowDown, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/MagicCard";
import { QuestGuide, RewardStars } from "@/components/QuestRewards";
import { completeValleyZone, saveZoneDraft, useProgress } from "@/game/progress";
import { definitionPieces, NEW_DRAFT, officialTerm, VALLEY_ZONES, ZONE_XP, zoneUnlocked, type ZoneDraft, type ValleyZone } from "@/game/valley-adventure";

export function ValleyChallenge({ zone }: { zone: ValleyZone }) {
  const p = useProgress();
  const draft = p.valleyAdventure.drafts[zone.id] ?? NEW_DRAFT;
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [wrong, setWrong] = useState<string | null>(null);
  const [missionOpen, setMissionOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const index = VALLEY_ZONES.findIndex((entry) => entry.id === zone.id);
  const done = p.valleyAdventure.completed.includes(zone.id);
  const next = VALLEY_ZONES[index + 1];
  const revealed = draft.revealed ?? [];
  function save(nextDraft: ZoneDraft) { saveZoneDraft(zone.id, nextDraft); }
  function discover(id: string) { save({ ...draft, revealed: [...new Set([...revealed, id])] }); setFeedback(""); setWrong(null); }
  function miss(id: string, explanation: string) { setWrong(id); setSuccess(false); setFeedback(`¡CASI! ${explanation}`); }
  function submit(nextDraft: ZoneDraft, solved: boolean) {
    setSelected(null); setWrong(null); setSuccess(true);
    if (solved) { completeValleyZone(zone.id, nextDraft); setFeedback(""); }
    else { save(nextDraft); setFeedback("¡CORRECTO! Cartas enlazadas. Una pieza más de nuestra aventura."); }
  }
  if (!zoneUnlocked(p.valleyAdventure, index)) return <div className="py-8 text-center"><QuestGuide message="Primero debemos abrir el camino anterior." /><Button asChild className="mt-6"><Link to="/valle">Volver al Valle</Link></Button></div>;
  if (done) return <section className="relative py-6 text-center">
    <RewardStars /><QuestGuide celebrate message={next ? "¡Misión completada! Una nueva zona nos espera." : "¡Valle conquistado! Lo logramos."} />
    <h2 className="mt-4 text-2xl font-bold">¡MISIÓN COMPLETADA!</h2><p className="quest-xp mt-3 text-4xl font-extrabold text-primary">+{ZONE_XP} XP</p>
    <p className="mt-2 text-sm text-muted-foreground">Recompensa de esta zona · {p.xp} XP en tu aventura</p>
    <p className="mt-5 font-bold text-primary">✦ Cartas descubiertas</p>
    <div className="card-collection mt-4">{zone.terms.map((number) => <MagicCard key={number} compact revealed label={officialTerm(number).term} title={officialTerm(number).term} symbol={zone.emoji} matched />)}</div>
    <p className="mt-5 font-bold text-secondary">{next ? `🔓 ${next.name} desbloqueada` : "🧭 Insignia desbloqueada: Aventurero del Valle"}</p>
    <div className="mt-6 flex flex-wrap justify-center gap-3"><Button asChild variant="outline"><Link to="/valle">Ver mi colección</Link></Button>{next && <Button asChild><Link to="/aventura/$zona" params={{ zona: next.id }}>Siguiente zona<ArrowRight /></Link></Button>}</div>
  </section>;
  if (draft.stage === "intro") return <section className="py-4 text-center">
    <QuestGuide message="¡Una carta de misión nos espera!" />
    <div className="mx-auto mt-4 max-w-xs"><MagicCard kind="mission" revealed={missionOpen} onClick={() => setMissionOpen(!missionOpen)} label={missionOpen ? "Voltear carta de misión" : "Abrir carta de misión"} title={zone.name} symbol={zone.emoji}>{zone.intro}</MagicCard></div>
    <p className="mt-4 font-bold text-secondary">Recompensa: {ZONE_XP} XP · nuevas cartas</p>
    {missionOpen && <Button className="quest-enter mt-4 h-12 rounded-full px-8" onClick={() => save({ ...draft, stage: "challenge" })}>Aceptar misión<ArrowRight /></Button>}
  </section>;

  const entry = officialTerm(zone.terms[draft.step] ?? zone.terms[0] ?? 10);
  const pieces = definitionPieces(zone.terms[0] ?? 26);
  const order = draft.order.length ? draft.order : [2, 0, 3, 1];
  const choices = [entry.number, ...zone.terms.filter((number) => number !== entry.number), ...[10, 25, 28, 67].filter((number) => number !== entry.number && !zone.terms.includes(number))].slice(0, 4).sort((a, b) => a - b);
  const activeRevealed = revealed.includes(`c${entry.number}`);
  return <section className="quest-enter py-4">
    <QuestGuide celebrate={success} message={feedback ? success ? "¡Bien! La magia está en tus manos." : "¡Casi! El pergamino puede ayudarnos." : zone.kind === "match" ? "Descubramos las cartas y recuperemos sus enlaces." : zone.kind === "order" ? "Las cartas guardan una inscripción por reconstruir." : "Descubramos el concepto y su carta compañera."} />
    {zone.kind === "match" && <>
      <p className="mt-4 mb-4 font-bold text-secondary">Cartas enlazadas: {draft.matched.length}/{zone.terms.length}</p>
      <div className="card-table grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{zone.terms.map((number) => {
        const open = revealed.includes(`c${number}`) || draft.matched.includes(number);
        return <MagicCard key={number} compact revealed={open} label={open ? `Elegir concepto ${officialTerm(number).term}` : `Descubrir concepto ${zone.terms.indexOf(number) + 1}`} title={officialTerm(number).term} symbol={zone.emoji} selected={selected === number} matched={draft.matched.includes(number)} disabled={draft.matched.includes(number)} onClick={() => { if (!open) discover(`c${number}`); else { setSelected(number); setFeedback(""); setWrong(null); } }} />;
      })}</div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">{[...zone.terms].reverse().map((number, i) => {
        const open = revealed.includes(`d${number}`) || draft.matched.includes(number);
        return <MagicCard key={number} kind="answer" revealed={open} label={open ? `Enlazar definición ${i + 1}` : `Descubrir definición ${i + 1}`} symbol="✧" matched={draft.matched.includes(number)} wrong={wrong === `d${number}`} disabled={draft.matched.includes(number)} onClick={() => {
          if (!open) { discover(`d${number}`); return; }
          if (selected === null) { setFeedback("Una carta de concepto espera su compañera."); setSuccess(false); return; }
          if (selected !== number) { miss(`d${number}`, officialTerm(selected).definition); return; }
          const matched = [...draft.matched, number]; submit({ ...draft, matched }, matched.length === zone.terms.length);
        }}>{officialTerm(number).definition}</MagicCard>;
      })}</div>
    </>}
    {zone.kind === "order" && <>
      <div className="mx-auto mt-4 max-w-xs"><MagicCard compact revealed={activeRevealed} label={activeRevealed ? `Voltear ${entry.term}` : "Descubrir concepto"} title={entry.term} symbol={zone.emoji} onClick={() => discover(`c${entry.number}`)} /></div>
      {activeRevealed && <>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2">{order.map((piece, position) => <li key={piece}>
          <MagicCard kind="answer" revealed={revealed.includes(`p${piece}`)} label={`Descubrir fragmento ${piece + 1}`} title={`✦ ${position + 1} ✦`} symbol="◇" onClick={() => discover(`p${piece}`)}>{pieces[piece]}</MagicCard>
          <div className="mt-2 flex justify-center gap-2">{[-1, 1].map((direction) => <Button key={direction} variant="outline" size="icon" aria-label={`${direction === -1 ? "Subir" : "Bajar"} fragmento ${position + 1}`} title={direction === -1 ? "Subir" : "Bajar"} disabled={!revealed.includes(`p${piece}`) || position + direction < 0 || position + direction >= order.length} onClick={() => { const moved = [...order]; const swap = moved[position + direction]; if (swap === undefined) return; moved[position + direction] = piece; moved[position] = swap; save({ ...draft, order: moved }); setFeedback(""); }}>{direction === -1 ? <ArrowUp /> : <ArrowDown />}</Button>)}</div>
        </li>)}</ol>
        <div className="mt-5 flex flex-wrap gap-3"><Button disabled={!pieces.every((_, i) => revealed.includes(`p${i}`))} onClick={() => {
          if (order.every((value, i) => value === i)) submit({ ...draft, order }, true);
          else miss("order", "La inscripción aún no encaja. El pergamino conserva el texto original.");
        }}>Unir las cartas<Check /></Button><Button variant="outline" size="icon" aria-label="Reordenar desde el inicio" title="Reordenar desde el inicio" onClick={() => save({ ...draft, order: [2, 0, 3, 1] })}><RotateCcw /></Button></div>
        <details className="mt-4 text-sm"><summary className="cursor-pointer font-bold text-secondary">Pergamino de referencia</summary><p className="mt-2 leading-relaxed">{entry.definition}</p></details>
      </>}
    </>}
    {zone.kind === "complete" && <>
      <p className="mt-4 font-bold text-secondary">Carta {draft.step + 1} de {zone.terms.length}</p>
      <div className="mx-auto mt-4 max-w-xs"><MagicCard revealed={activeRevealed} label={activeRevealed ? `Concepto ${entry.term}` : "Descubrir concepto"} title={entry.term} symbol={zone.emoji} onClick={() => discover(`c${entry.number}`)} /></div>
      {activeRevealed && <div className="mt-5 grid gap-4 sm:grid-cols-2">{choices.map((number, i) => {
        const id = `a${entry.number}-${number}`; const open = revealed.includes(id);
        return <MagicCard key={id} kind="answer" revealed={open} label={open ? `Elegir definición ${i + 1}` : `Descubrir respuesta ${i + 1}`} wrong={wrong === id} symbol="✧" onClick={() => {
          if (!open) { discover(id); return; }
          if (number !== entry.number) { miss(id, entry.definition); return; }
          const step = draft.step + 1; submit({ ...draft, step }, step === zone.terms.length);
        }}>{officialTerm(number).definition}</MagicCard>;
      })}</div>}
    </>}
    {feedback && <div key={`${feedback}-${draft.step}-${draft.matched.length}`} role="status" className="quest-reward relative mt-5 rounded-lg bg-accent p-4 font-bold leading-relaxed text-accent-foreground">{success && <RewardStars />}{feedback}</div>}
  </section>;
}
