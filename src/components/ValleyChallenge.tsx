import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUp, ArrowDown, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestGuide, RewardStars } from "@/components/QuestRewards";
import { completeValleyZone, saveZoneDraft, useProgress } from "@/game/progress";
import { definitionPieces, NEW_DRAFT, officialTerm, VALLEY_ZONES, ZONE_XP, zoneUnlocked, type ZoneDraft, type ValleyZone } from "@/game/valley-adventure";

export function ValleyChallenge({ zone }: { zone: ValleyZone }) {
  const p = useProgress();
  const draft = p.valleyAdventure.drafts[zone.id] ?? NEW_DRAFT;
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const index = VALLEY_ZONES.findIndex((entry) => entry.id === zone.id);
  const done = p.valleyAdventure.completed.includes(zone.id);
  const next = VALLEY_ZONES[index + 1];
  function save(nextDraft: ZoneDraft) { saveZoneDraft(zone.id, nextDraft); }
  function submit(nextDraft: ZoneDraft, solved: boolean) {
    setSelected(null);
    if (solved) { completeValleyZone(zone.id, nextDraft); setFeedback(""); }
    else { save(nextDraft); setFeedback("¡BIEN! Una pieza más recuperada."); }
  }
  if (!zoneUnlocked(p.valleyAdventure, index)) return <div className="py-8 text-center"><QuestGuide message="Primero debemos abrir el camino anterior." /><Button asChild className="mt-6"><Link to="/valle">Volver al Valle</Link></Button></div>;
  if (done) return <section className="relative py-8 text-center">
    <RewardStars /><QuestGuide celebrate message={next ? "¡Zona completada! El camino está abierto." : "¡Valle conquistado! Lo logramos."} />
    <h2 className="mt-4 text-2xl font-bold">{zone.emoji} Zona completada</h2><p className="quest-xp mt-4 text-4xl font-extrabold text-primary">+{ZONE_XP} XP</p>
    <p className="mt-3 text-muted-foreground">{p.valleyAdventure.completed.length} de {VALLEY_ZONES.length} zonas · {p.xp} XP en tu aventura</p>
    <p className="mt-4 font-bold text-secondary">{next ? `🔓 ${next.name} desbloqueada` : "🧭 Insignia: Aventurero del Valle"}</p>
    <div className="mt-6 flex flex-wrap justify-center gap-3"><Button asChild variant="outline"><Link to="/valle">Ver el camino</Link></Button>{next && <Button asChild><Link to="/aventura/$zona" params={{ zona: next.id }}>Siguiente zona<ArrowRight /></Link></Button>}</div>
  </section>;
  if (draft.stage === "intro") return <section className="py-6 text-center">
    <QuestGuide message={zone.intro} /><p className="mt-6 text-5xl" aria-hidden="true">{zone.emoji}</p>
    <h2 className="mt-4 text-xl font-bold">{zone.name}</h2><p className="mt-2 font-bold text-secondary">Recompensa: {ZONE_XP} XP · un nuevo camino</p>
    <Button className="mt-6 h-12 rounded-full px-8" onClick={() => save({ ...draft, stage: "challenge" })}>Aceptar misión<ArrowRight /></Button>
  </section>;

  const entry = officialTerm(zone.terms[draft.step] ?? zone.terms[0] ?? 10);
  const pieces = definitionPieces(zone.terms[0] ?? 26);
  const order = draft.order.length ? draft.order : [2, 0, 3, 1];
  const choices = [entry.number, ...zone.terms.filter((number) => number !== entry.number), ...[10, 25, 28, 67].filter((number) => number !== entry.number && !zone.terms.includes(number))].slice(0, 4).sort((a, b) => a - b);
  return <section className="quest-enter py-4">
    <QuestGuide message={zone.kind === "match" ? "Recuperemos los enlaces del tablón." : zone.kind === "order" ? "La inscripción del puente espera sus piezas." : "El archivo necesita sus etiquetas."} />
    {zone.kind === "match" && <>
      <p className="mt-4 mb-4 font-bold text-secondary">Enlaces recuperados: {draft.matched.length}/{zone.terms.length}</p>
      <div className="grid gap-5 md:grid-cols-[1fr_2fr]">
        <div className="grid content-start gap-3">{zone.terms.map((number) => <Button key={number} variant="outline" disabled={draft.matched.includes(number)} onClick={() => { setSelected(number); setFeedback(""); }} className={`h-auto min-h-14 whitespace-normal border-2 p-4 text-left ${selected === number ? "border-gold bg-gold/20" : "bg-card"}`}>{draft.matched.includes(number) && <Check />}{officialTerm(number).term}</Button>)}</div>
        <div className="grid gap-3">{[...zone.terms].reverse().map((number) => <Button key={number} variant="outline" disabled={draft.matched.includes(number) || selected === null} className="h-auto min-h-20 justify-start whitespace-normal bg-card p-4 text-left leading-relaxed" onClick={() => {
          if (selected !== number) { setFeedback("¡CASI! Busca otro enlace; el tablón sigue esperando."); return; }
          const matched = [...draft.matched, number]; submit({ ...draft, matched }, matched.length === zone.terms.length);
        }}>{draft.matched.includes(number) && <Check />}{officialTerm(number).definition}</Button>)}</div>
      </div>
    </>}
    {zone.kind === "order" && <>
      <h2 className="mt-4 text-xl font-bold">{entry.term}</h2>
      <ol className="mt-4 grid gap-3">{order.map((piece, position) => <li key={piece} className="flex items-center gap-3 rounded-lg border-2 bg-card p-3"><span className="font-bold text-secondary">{position + 1}</span><p className="flex-1 text-sm leading-relaxed">{pieces[piece]}</p><div className="flex shrink-0 flex-col gap-1">{[-1, 1].map((direction) => <Button key={direction} variant="ghost" size="icon" aria-label={`${direction === -1 ? "Subir" : "Bajar"} fragmento ${position + 1}`} title={direction === -1 ? "Subir" : "Bajar"} disabled={position + direction < 0 || position + direction >= order.length} onClick={() => { const moved = [...order]; const swap = moved[position + direction]; if (swap === undefined) return; moved[position + direction] = piece; moved[position] = swap; save({ ...draft, order: moved }); setFeedback(""); }}>{direction === -1 ? <ArrowUp /> : <ArrowDown />}</Button>)}</div></li>)}</ol>
      <div className="mt-5 flex gap-3"><Button onClick={() => {
        if (order.every((value, i) => value === i)) submit({ ...draft, order }, true);
        else setFeedback("¡CASI! La inscripción aún no encaja. Puedes consultar el pergamino.");
      }}>Restaurar inscripción<Check /></Button><Button variant="outline" size="icon" aria-label="Reordenar desde el inicio" title="Reordenar desde el inicio" onClick={() => save({ ...draft, order: [2, 0, 3, 1] })}><RotateCcw /></Button></div>
      <details className="mt-4 text-sm"><summary className="cursor-pointer font-bold text-secondary">Pergamino de referencia</summary><p className="mt-2 leading-relaxed">{entry.definition}</p></details>
    </>}
    {zone.kind === "complete" && <>
      <p className="mt-4 font-bold text-secondary">Registro {draft.step + 1} de {zone.terms.length}</p>
      <div className="mt-4 border-y-2 border-gold py-5"><p className="mb-3 text-2xl font-extrabold text-primary">{selected === entry.number ? entry.term : "✦  …  ✦"}</p><p className="leading-relaxed">{entry.definition}</p></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{choices.map((number) => <Button key={number} variant="outline" onClick={() => {
        if (number !== entry.number) { setFeedback("¡CASI! Esa etiqueta pertenece a otro registro."); return; }
        const step = draft.step + 1; submit({ ...draft, step }, step === zone.terms.length);
      }} className="h-auto min-h-14 whitespace-normal border-2 bg-card p-4">{officialTerm(number).term}</Button>)}</div>
    </>}
    {feedback && <p key={`${feedback}-${draft.step}-${draft.matched.length}`} role="status" className="quest-reward mt-5 rounded-lg bg-accent p-4 font-bold text-accent-foreground">{feedback}</p>}
  </section>;
}