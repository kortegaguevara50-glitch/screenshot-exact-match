import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/MagicCard";
import { QuestGuide, RewardStars } from "@/components/QuestRewards";
import {
  completeForestZone,
  saveForestZoneDraft,
  useProgress,
} from "@/game/progress";
import {
  FOREST_ZONES,
  FOREST_ZONE_XP,
  NEW_FOREST_DRAFT,
  forestOfficialTerm,
  forestZoneUnlocked,
  type ForestZone,
  type ForestZoneDraft,
} from "@/game/forest-adventure";

export function ForestChallenge({ zone }: { zone: ForestZone }) {
  const p = useProgress();
  const adventure = p.forestAdventure;
  const draft = adventure.drafts[zone.id] ?? NEW_FOREST_DRAFT;

  const [missionOpen, setMissionOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [selectedMemoryCards, setSelectedMemoryCards] = useState<string[]>(
    [],
  );

  const index = FOREST_ZONES.findIndex((entry) => entry.id === zone.id);
  const done = adventure.completed.includes(zone.id);
  const next = FOREST_ZONES[index + 1];

  function save(nextDraft: ForestZoneDraft) {
    saveForestZoneDraft(zone.id, nextDraft);
  }

  function acceptMission() {
    save({ ...draft, stage: "challenge" });
  }

  if (!forestZoneUnlocked(adventure, index)) {
    return (
      <div className="py-8 text-center">
        <QuestGuide message="Primero debemos abrir el camino anterior." />

        <Button asChild className="mt-6">
          <Link to="/bosque">Volver al Bosque</Link>
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <section className="relative py-6 text-center">
        <RewardStars />

        <QuestGuide
          celebrate
          message={
            next
              ? "¡Misión completada! Una nueva zona nos espera."
              : "¡Has conquistado el Bosque del Conocimiento!"
          }
        />

        <h2 className="mt-4 text-2xl font-bold">
          ¡MISIÓN COMPLETADA!
        </h2>

        <p className="quest-xp mt-3 text-4xl font-extrabold text-primary">
          +{FOREST_ZONE_XP} XP
        </p>

        <p className="mt-5 font-bold text-secondary">
          ✦ Cartas descubiertas
        </p>

        <div className="card-collection mt-4">
          {zone.terms.map((number) => {
            const term = forestOfficialTerm(number);

            return (
              <MagicCard
                key={number}
                compact
                revealed
                label={term.term}
                title={term.term}
                symbol={zone.emoji}
                matched
                world="bosque"
              />
            );
          })}
        </div>

        <p className="mt-5 font-bold text-secondary">
          {next ? `🔓 ${next.name} desbloqueada` : "🌲 Bosque conquistado"}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/bosque">Ver mi colección</Link>
          </Button>

          {next && (
            <Button asChild>
              <Link to="/aventura/$zona" params={{ zona: next.id }}>
                Siguiente zona <ArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </section>
    );
  }

  if (draft.stage === "intro") {
    return (
      <section className="py-4 text-center">
        <QuestGuide message="¡Una carta mágica nos espera!" />

        <div className="mx-auto mt-4 max-w-xs">
          <MagicCard
            kind="mission"
            revealed={missionOpen}
            onClick={() => setMissionOpen(!missionOpen)}
            label={
              missionOpen
                ? "Voltear carta de misión"
                : "Abrir carta de misión"
            }
            title={zone.name}
            symbol={zone.emoji}
            world="bosque"
          >
            {zone.intro}
          </MagicCard>
        </div>

        <p className="mt-4 font-bold text-secondary">
          Recompensa: {FOREST_ZONE_XP} XP
        </p>

        {missionOpen && (
          <Button
            className="quest-enter mt-4 h-12 rounded-full px-8"
            onClick={acceptMission}
          >
            Aceptar misión <ArrowRight />
          </Button>
        )}
      </section>
    );
  }

  // ZONA 1: EL ÁRBOL DE LOS CONCEPTOS
  if (zone.id === "arbol") {
    const definitions = [...zone.terms].reverse();

    function chooseDefinition(number: number) {
      if (draft.matched.includes(number)) return;

      if (selectedTerm === null) {
        setFeedback("Primero selecciona una carta de concepto.");
        return;
      }

      if (selectedTerm === number) {
        const nextMatched: number[] = [...draft.matched, number];

        const nextDraft: ForestZoneDraft = {
          ...draft,
          matched: nextMatched,
          revealed: [
            ...new Set([
              ...(draft.revealed ?? []),
              `c${number}`,
              `d${number}`,
            ]),
          ],
        };

        save(nextDraft);
        setSelectedTerm(null);
        setSuccess(true);
        setFeedback(
          "¡Pareja correcta! Has unido el concepto con su definición. ✨",
        );

        if (nextMatched.length === zone.terms.length) {
          completeForestZone(zone.id, nextDraft);
        }
      } else {
        setSelectedTerm(null);
        setSuccess(false);
        setFeedback("¡Esa no es la pareja correcta! Inténtalo otra vez.");
      }
    }

    return (
      <section className="quest-enter py-4">
        <QuestGuide
          celebrate={success}
          message={
            feedback ||
            "Selecciona un concepto y encuentra su definición correcta."
          }
        />

        <p className="mt-4 text-center font-bold text-secondary">
          Parejas encontradas: {draft.matched.length}/{zone.terms.length}
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-center font-bold">🌳 Conceptos</h2>

            <div className="grid gap-3">
              {zone.terms.map((number) => {
                const term = forestOfficialTerm(number);
                const matched = draft.matched.includes(number);

                return (
                  <MagicCard
                    key={number}
                    revealed
                    compact
                    label={term.term}
                    title={term.term}
                    symbol="🌳"
                    selected={selectedTerm === number}
                    matched={matched}
                    disabled={matched}
                    world="bosque"
                    onClick={() => {
                      if (matched) return;

                      setSelectedTerm(number);
                      setFeedback(
                        `Ahora encuentra la definición de ${term.term}.`,
                      );
                      setSuccess(false);
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-center font-bold">📜 Definiciones</h2>

            <div className="grid gap-3">
              {definitions.map((number) => {
                const term = forestOfficialTerm(number);
                const matched = draft.matched.includes(number);

                return (
                  <MagicCard
                    key={number}
                    revealed
                    compact
                    kind="answer"
                    label={`Definición de ${term.term}`}
                    title="Definición"
                    symbol="📜"
                    matched={matched}
                    disabled={matched}
                    world="bosque"
                    onClick={() => chooseDefinition(number)}
                  >
                    {term.definition}
                  </MagicCard>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ZONA 2: EL PERGAMINO PERDIDO
  if (zone.id === "pergamino") {
    const number = zone.terms.find(
      (value) => !draft.matched.includes(value),
    );

    if (number === undefined) return null;

    const currentNumber = number;
    const term = forestOfficialTerm(currentNumber);
    const words = term.definition.split(/\s+/);

    const pieces: { id: number; text: string }[] = [];

    for (let i = 0; i < 4; i++) {
      const start = Math.floor((i * words.length) / 4);
      const end = Math.floor(((i + 1) * words.length) / 4);

      pieces.push({
        id: i,
        text: words.slice(start, end).join(" "),
      });
    }

    const shuffledPieces = [...pieces];

    const seed = currentNumber * 7 + draft.step * 11;

    for (let i = shuffledPieces.length - 1; i > 0; i--) {
      const j = (seed + i * 3) % (i + 1);

      const current = shuffledPieces[i];
      const target = shuffledPieces[j];

      if (current && target) {
        shuffledPieces[i] = target;
        shuffledPieces[j] = current;
      }
    }

    function choosePiece(id: number) {
      if (draft.order.includes(id)) return;

      const nextOrder = [...draft.order, id];

      if (nextOrder.length === 4) {
        const correct = nextOrder.every(
          (value, position) => value === position,
        );

        if (correct) {
          const nextMatched: number[] = [
            ...draft.matched,
            currentNumber,
          ];

          const nextDraft: ForestZoneDraft = {
            ...draft,
            matched: nextMatched,
            order: [],
            step: draft.step + 1,
            attempts: (draft.attempts ?? 0) + 1,
          };

          setSuccess(true);
          setFeedback(
            "¡Has reconstruido el pergamino correctamente! ✨",
          );

          if (nextMatched.length === zone.terms.length) {
            completeForestZone(zone.id, nextDraft);
          } else {
            save(nextDraft);
          }
        } else {
          save({
            ...draft,
            order: [],
            attempts: (draft.attempts ?? 0) + 1,
          });

          setSuccess(false);
          setFeedback(
            "Los fragmentos no están en el orden correcto. ¡Inténtalo otra vez!",
          );
        }
      } else {
        save({ ...draft, order: nextOrder });
        setFeedback("¡Bien! Continúa ordenando los fragmentos.");
        setSuccess(false);
      }
    }

    return (
      <section className="quest-enter py-4">
        <QuestGuide
          celebrate={success}
          message={
            feedback ||
            `Reconstruye la definición oficial de: ${term.term}`
          }
        />

        <p className="mt-4 text-center font-bold text-secondary">
          Pergaminos reconstruidos: {draft.matched.length}/
          {zone.terms.length}
        </p>

        <h2 className="mt-6 text-center text-xl font-bold">
          📜 {term.term}
        </h2>

        <p className="my-4 text-center text-sm text-muted-foreground">
          Selecciona los cuatro fragmentos en el orden correcto.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {shuffledPieces.map((piece) => (
            <MagicCard
              key={piece.id}
              revealed
              kind="answer"
              compact
              label={piece.text}
              symbol="📜"
              selected={draft.order.includes(piece.id)}
              disabled={draft.order.includes(piece.id)}
              world="bosque"
              onClick={() => choosePiece(piece.id)}
            >
              {piece.text}
            </MagicCard>
          ))}
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Intentos: {draft.attempts ?? 0}
        </p>
      </section>
    );
  }

  
  // ZONA 3: EL CLARO DE LOS ENIGMAS
  if (zone.id === "enigmas") {
    const definitions = [...zone.terms].reverse();

    function chooseDefinition(number: number) {
      if (draft.matched.includes(number)) return;

      if (selectedTerm === null) return;

      if (selectedTerm === number) {
        const nextMatched: number[] = [...draft.matched, number];

        const nextDraft: ForestZoneDraft = {
          ...draft,
          matched: nextMatched,
          revealed: [
            ...new Set([
              ...(draft.revealed ?? []),
              `c${number}`,
              `d${number}`,
            ]),
          ],
        };

        save(nextDraft);
        setSelectedTerm(null);
        setSuccess(true);
        setFeedback("¡Respuesta correcta! Has resuelto el enigma. ✨");

        if (nextMatched.length === zone.terms.length) {
          completeForestZone(zone.id, nextDraft);
        }
      } else {
        setSelectedTerm(null);
        setSuccess(false);
        setFeedback(
          "¡Esa definición no corresponde! Inténtalo otra vez.",
        );
      }
    }

    return (
      <section className="quest-enter py-4">
        <QuestGuide
          celebrate={success}
          message={
            feedback ||
            "Elige una carta misteriosa y descubre qué definición esconde."
          }
        />

        <p className="mt-4 text-center font-bold text-secondary">
          Enigmas resueltos: {draft.matched.length}/{zone.terms.length}
        </p>

        <h2 className="mt-6 text-center font-bold">
          🔮 Cartas misteriosas
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {zone.terms.map((number) => {
            const term = forestOfficialTerm(number);
            const matched = draft.matched.includes(number);

            return (
              <MagicCard
                key={number}
                revealed={selectedTerm === number || matched}
                label={`Descubrir ${term.term}`}
                title={term.term}
                symbol="🔮"
                selected={selectedTerm === number}
                matched={matched}
                disabled={matched}
                world="bosque"
                onClick={() => {
                  if (matched) return;

                  setSelectedTerm(number);
                  setFeedback(
                    `Has descubierto ${term.term}. ¡Encuentra su definición!`,
                  );
                  setSuccess(false);
                }}
              >
                {term.definition}
              </MagicCard>
            );
          })}
        </div>

        {selectedTerm !== null && (
          <>
            <h2 className="mt-8 text-center font-bold">
              📜 Elige la definición correcta
            </h2>

            <div className="mt-4 grid gap-3">
              {definitions.map((number) => {
                const term = forestOfficialTerm(number);

                return (
                  <MagicCard
                    key={number}
                    revealed
                    compact
                    kind="answer"
                    label={`Definición de ${term.term}`}
                    title="Definición misteriosa"
                    symbol="✨"
                    world="bosque"
                    onClick={() => chooseDefinition(number)}
                  >
                    {term.definition}
                  </MagicCard>
                );
              })}
            </div>
          </>
        )}
      </section>
    );
  }

  // ZONA 4: LA BIBLIOTECA ENCANTADA
  if (zone.id === "biblioteca") {
    function chooseMemoryCard(cardId: string, number: number) {
      if (draft.matched.includes(number)) return;

      if (selectedMemoryCards.includes(cardId)) return;

      if (selectedMemoryCards.length === 2) {
        setSelectedMemoryCards([cardId]);
        setFeedback("Busca la pareja de esta nueva carta.");
        setSuccess(false);
        return;
      }

      const nextSelected = [...selectedMemoryCards, cardId];
      setSelectedMemoryCards(nextSelected);

      if (nextSelected.length === 1) {
        setFeedback("¡Ahora encuentra la carta que corresponde!");
        setSuccess(false);
        return;
      }

      const firstCard = nextSelected[0];

      if (!firstCard) {
        setSelectedMemoryCards([]);
        return;
      }

      const firstNumber = Number(firstCard.slice(1));
      const secondNumber = number;

      const isPair =
        firstNumber === secondNumber &&
        firstCard[0] !== cardId[0];

      if (isPair) {
        const nextMatched: number[] = [...draft.matched, number];

        const nextDraft: ForestZoneDraft = {
          ...draft,
          matched: nextMatched,
          revealed: [
            ...new Set([
              ...(draft.revealed ?? []),
              `c${number}`,
              `d${number}`,
            ]),
          ],
        };

        save(nextDraft);
        setSelectedMemoryCards([]);
        setSuccess(true);
        setFeedback("¡Encontraste una pareja mágica! ✨");

        if (nextMatched.length === zone.terms.length) {
          completeForestZone(zone.id, nextDraft);
        }
      } else {
        setSuccess(false);
        setFeedback(
          "Estas cartas no forman una pareja. Elige otra carta para continuar.",
        );
      }
    }

    return (
      <section className="quest-enter py-4">
        <QuestGuide
          celebrate={success}
          message={
            feedback ||
            "La biblioteca esconde parejas mágicas. ¡Encuentra los conceptos y sus definiciones!"
          }
        />

        <p className="mt-4 text-center font-bold text-secondary">
          Parejas encontradas: {draft.matched.length}/
          {zone.terms.length}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {zone.terms.map((number) => {
            const term = forestOfficialTerm(number);
            const matched = draft.matched.includes(number);
            const conceptId = `c${number}`;
            const definitionId = `d${number}`;

            const conceptRevealed =
              matched || selectedMemoryCards.includes(conceptId);

            const definitionRevealed =
              matched || selectedMemoryCards.includes(definitionId);

            return (
              <div key={number} className="contents">
                <MagicCard
                  revealed={conceptRevealed}
                  label={`Carta de concepto ${term.term}`}
                  title={term.term}
                  symbol="📚"
                  matched={matched}
                  disabled={matched}
                  world="bosque"
                  onClick={() =>
                    chooseMemoryCard(conceptId, number)
                  }
                />

                <MagicCard
                  revealed={definitionRevealed}
                  kind="answer"
                  label={`Carta de definición ${term.term}`}
                  title="Definición"
                  symbol="📜"
                  matched={matched}
                  disabled={matched}
                  world="bosque"
                  onClick={() =>
                    chooseMemoryCard(definitionId, number)
                  }
                >
                  {term.definition}
                </MagicCard>
              </div>
            );
          })}
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Encuentra las tres parejas para completar la biblioteca.
        </p>
      </section>
    );
  }

  // ZONA 5: EL SENDERO DE LAS DECISIONES
  if (zone.id === "sendero") {
    const senderoSteps = [
      {
        number: 17,
        title: "Primera decisión",
        situation:
          "El equipo necesita establecer qué se debe decidir después de analizar diferentes aspectos de una situación.",
        correct: 17,
        explanation:
          "¡Correcto! Determinación es la acción de establecer o decidir algo después de analizar diferentes aspectos.",
      },
      {
        number: 18,
        title: "Segunda decisión",
        situation:
          "El equipo necesita identificar el estado o condición en la que se encuentra un proyecto en un momento determinado.",
        correct: 18,
        explanation:
          "¡Correcto! Situación describe el estado o condición en la que se encuentra una persona, problema, organización o proyecto.",
      },
      {
        number: 22,
        title: "Tercera decisión",
        situation:
          "El equipo necesita realizar varias actividades relacionadas para obtener un resultado.",
        correct: 22,
        explanation:
          "¡Correcto! Un proceso está formado por pasos o actividades relacionadas que se realizan para obtener un resultado.",
      },
    ];

    const currentStepIndex = draft.matched.length;
    const currentStep = senderoSteps[currentStepIndex];

    if (!currentStep) {
      return null;
    }

    const step = currentStep;

    const shuffledAnswers = [...senderoSteps];

    const seed = currentStepIndex + 3;

    for (let i = shuffledAnswers.length - 1; i > 0; i--) {
      const j = (seed + i * 2) % (i + 1);

      const current = shuffledAnswers[i];
      const target = shuffledAnswers[j];

      if (current && target) {
        shuffledAnswers[i] = target;
        shuffledAnswers[j] = current;
      }
    }

    function chooseSenderoAnswer(number: number) {
      if (number !== step.correct) {
        const term = forestOfficialTerm(number);

        setSuccess(false);
        setFeedback(
          `❌ ${term.term} no corresponde a esta situación. Lee nuevamente la situación y elige otra carta.`,
        );

        return;
      }

      const nextMatched: number[] = [...draft.matched, number];

      const nextDraft: ForestZoneDraft = {
        ...draft,
        matched: nextMatched,
        revealed: [
          ...new Set([
            ...(draft.revealed ?? []),
            `c${number}`,
          ]),
        ],
        step: draft.step + 1,
      };

      save(nextDraft);

      setSuccess(true);
      setFeedback(step.explanation);

      if (nextMatched.length === zone.terms.length) {
        completeForestZone(zone.id, nextDraft);
      }
    }

    return (
      <section className="quest-enter py-4">
        <QuestGuide
          celebrate={success}
          message={
            feedback ||
            "Lee la situación y elige la carta que representa la mejor decisión."
          }
        />

        <div className="mt-4 flex items-center justify-center gap-2">
          {senderoSteps.map((senderoStep, stepIndex) => (
            <div
              key={senderoStep.number}
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-extrabold ${
                stepIndex < currentStepIndex
                  ? "border-success bg-primary text-primary-foreground"
                  : stepIndex === currentStepIndex
                    ? "border-gold bg-gold text-gold-foreground"
                    : "border-border bg-card text-muted-foreground"
              }`}
            >
              {stepIndex < currentStepIndex ? "✓" : stepIndex + 1}
            </div>
          ))}
        </div>

        <p className="mt-3 text-center font-bold text-secondary">
          Decisiones tomadas: {draft.matched.length}/{zone.terms.length}
        </p>

        <div className="mx-auto mt-6 max-w-3xl">
          <div className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-3 shadow-md">
            <div className="rounded-2xl border border-primary/20 bg-background/70 p-6">
              <p className="text-center text-sm font-bold uppercase tracking-wide text-secondary">
                🍃 Situación
              </p>

              <p className="mt-3 text-center text-lg font-semibold leading-relaxed">
                {step.situation}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-4xl">
          <h2 className="text-center text-xl font-bold">
            🧭 Elige la mejor decisión
          </h2>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            Lee la situación y selecciona la carta que consideres correcta.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {shuffledAnswers.map((senderoStep) => {
              const term = forestOfficialTerm(senderoStep.number);
              const matched = draft.matched.includes(senderoStep.number);

              return (
                <MagicCard
                  key={senderoStep.number}
                  revealed
                  kind="answer"
                  label={`Decisión: ${term.term}`}
                  title={term.term}
                  symbol="🧭"
                  selected={matched}
                  matched={matched}
                  disabled={matched}
                  world="bosque"
                  onClick={() => {
                    if (matched) return;

                    chooseSenderoAnswer(senderoStep.number);
                  }}
                >
                  {term.definition}
                </MagicCard>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Cada decisión correcta abre un nuevo tramo del sendero. 🌿
        </p>
      </section>
    );
  }

  // ZONA 6: EL SANTUARIO DEL SABER
  if (zone.id === "santuario") {
    const santuarioSteps = [
      {
        number: 19,
        situation:
          "Necesitas explicar de manera clara y precisa qué significa una palabra o concepto para que los demás puedan comprenderlo.",
        correct: 19,
        explanation:
          "¡Correcto! La Definición explica de forma clara y precisa el significado de una palabra, idea o concepto.",
      },
      {
        number: 33,
        situation:
          "Quieres comprender mejor un tema, por lo que necesitas analizar y aprender información relacionada con él.",
        correct: 33,
        explanation:
          "¡Correcto! Estudiar significa analizar y aprender información para comprender mejor un tema.",
      },
      {
        number: 1,
        situation:
          "Antes de tomar una decisión sobre un proyecto, necesitas conocer las circunstancias y condiciones que rodean el problema.",
        correct: 1,
        explanation:
          "¡Correcto! El Contexto permite comprender las circunstancias y condiciones que rodean una situación o proyecto.",
      },
    ];

    const currentStepIndex = draft.matched.length;
    const currentStep = santuarioSteps[currentStepIndex];

    if (!currentStep) {
      return null;
    }

    const step = currentStep;

    const shuffledAnswers = [...santuarioSteps];

    const seed = currentStepIndex + 7;

    for (let i = shuffledAnswers.length - 1; i > 0; i--) {
      const j = (seed + i * 2) % (i + 1);

      const current = shuffledAnswers[i];
      const target = shuffledAnswers[j];

      if (current && target) {
        shuffledAnswers[i] = target;
        shuffledAnswers[j] = current;
      }
    }

    function chooseSantuarioAnswer(number: number) {
      if (number !== step.correct) {
        const term = forestOfficialTerm(number);

        setSuccess(false);
        setFeedback(
          `❌ ${term.term} no corresponde a esta situación. Analiza nuevamente y elige otra carta.`,
        );

        return;
      }

      const nextMatched: number[] = [...draft.matched, number];

      const nextDraft: ForestZoneDraft = {
        ...draft,
        matched: nextMatched,
        revealed: [
          ...new Set([
            ...(draft.revealed ?? []),
            `c${number}`,
          ]),
        ],
        step: draft.step + 1,
      };

      save(nextDraft);

      setSuccess(true);
      setFeedback(step.explanation);

      if (nextMatched.length === zone.terms.length) {
        completeForestZone(zone.id, nextDraft);
      }
    }

    return (
      <section className="quest-enter py-4">
        <QuestGuide
          celebrate={success}
          message={
            feedback ||
            "Has llegado al último desafío. Lee cada situación y demuestra todo lo que aprendiste."
          }
        />

        <div className="mx-auto mt-5 max-w-3xl">
          <div className="rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-gold/10 via-card to-primary/10 p-3 shadow-md">
            <div className="rounded-2xl border border-gold/30 bg-background/70 p-6 text-center">
              <div className="text-5xl">✨</div>

              <h2 className="mt-3 text-2xl font-extrabold">
                El Santuario del Saber
              </h2>

              <p className="mt-2 text-sm font-semibold text-secondary">
                El último desafío del Bosque
              </p>

              <p className="mt-4 leading-relaxed text-muted-foreground">
                Has recorrido todo el bosque. Ahora tendrás que aplicar lo
                aprendido para superar tres situaciones finales.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {santuarioSteps.map((santuarioStep, stepIndex) => (
            <div
              key={santuarioStep.number}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-extrabold ${
                stepIndex < currentStepIndex
                  ? "border-success bg-primary text-primary-foreground"
                  : stepIndex === currentStepIndex
                    ? "border-gold bg-gold text-gold-foreground"
                    : "border-border bg-card text-muted-foreground"
              }`}
            >
              {stepIndex < currentStepIndex ? "✓" : stepIndex + 1}
            </div>
          ))}
        </div>

        <p className="mt-3 text-center font-bold text-secondary">
          Desafíos superados: {draft.matched.length}/{zone.terms.length}
        </p>

        <div className="mx-auto mt-7 max-w-3xl">
          <div className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-3 shadow-md">
            <div className="rounded-2xl border border-primary/20 bg-background/70 p-6">
              <p className="text-center text-sm font-bold uppercase tracking-wide text-secondary">
                🧠 Desafío {currentStepIndex + 1}
              </p>

              <p className="mt-4 text-center text-lg font-semibold leading-relaxed">
                {step.situation}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-4xl">
          <h2 className="text-center text-xl font-bold">
            🗝️ Elige el concepto correcto
          </h2>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            Lee con atención la situación y selecciona la carta que mejor
            responde al desafío.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {shuffledAnswers.map((santuarioStep) => {
              const term = forestOfficialTerm(santuarioStep.number);
              const matched = draft.matched.includes(santuarioStep.number);

              return (
                <MagicCard
                  key={santuarioStep.number}
                  revealed
                  kind="answer"
                  label={`Concepto: ${term.term}`}
                  title={term.term}
                  symbol="✨"
                  selected={matched}
                  matched={matched}
                  disabled={matched}
                  world="bosque"
                  onClick={() => {
                    if (matched) return;

                    chooseSantuarioAnswer(santuarioStep.number);
                  }}
                >
                  {term.definition}
                </MagicCard>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Supera los tres desafíos para conquistar el Santuario del Saber. 🌲✨
        </p>
      </section>
    );
  }

  return null;
}