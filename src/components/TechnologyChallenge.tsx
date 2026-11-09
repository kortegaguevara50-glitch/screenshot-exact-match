import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/MagicCard";
import { QuestGuide, RewardStars } from "@/components/QuestRewards";
import {
  completeTechnologyZone,
  saveTechnologyZoneDraft,
  useProgress,
} from "@/game/progress";
import {
  TECHNOLOGY_ZONES,
  TECHNOLOGY_ZONE_XP,
  technologyOfficialTerm,
  technologyZoneUnlocked,
  type TechnologyZone,
  type TechnologyZoneDraft,
} from "@/game/technology-adventure";

const NEW_TECHNOLOGY_DRAFT: TechnologyZoneDraft = {
  kind: "match",
  stage: "playing",
  matched: [],
  selected: [],
  order: [],
  revealed: [],
  decisions: [],
  completed: false,
};

export function TechnologyChallenge({
  zone,
}: {
  zone: TechnologyZone;
}) {
  const p = useProgress();
  const adventure = p.technologyAdventure;

  const draft =
    adventure.drafts[zone.id] ?? {
      ...NEW_TECHNOLOGY_DRAFT,
      kind: zone.kind,
    };

  const [missionOpen, setMissionOpen] = useState(false);
  const [missionAccepted, setMissionAccepted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [selectedMemoryCards, setSelectedMemoryCards] = useState<string[]>(
    [],
  );

  const index = TECHNOLOGY_ZONES.findIndex(
    (entry) => entry.id === zone.id,
  );

  const done = adventure.completed.includes(zone.id);
  const next = TECHNOLOGY_ZONES[index + 1];

  const hasProgress =
    draft.matched.length > 0 ||
    draft.order.length > 0 ||
    draft.revealed.length > 0 ||
    draft.decisions.length > 0;

  function save(nextDraft: TechnologyZoneDraft) {
    saveTechnologyZoneDraft(zone.id, nextDraft);
  }

  function acceptMission() {
    setMissionAccepted(true);
    setMissionOpen(false);

    save({
      ...draft,
      stage: "playing",
      revealed: [],
    });
  }

  if (!technologyZoneUnlocked(adventure, index)) {
    return (
      <div className="py-8 text-center">
        <QuestGuide message="Primero debemos abrir el camino anterior." />

        <Button asChild className="mt-6">
          <Link to="/ciudad">Volver a la ciudad</Link>
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
              ? "¡Misión completada! Una nueva zona tecnológica nos espera."
              : "¡Has conquistado la Ciudad Tecnológica!"
          }
        />

        <h2 className="mt-4 text-2xl font-bold">
          ¡MISIÓN COMPLETADA!
        </h2>

        <p className="quest-xp mt-3 text-4xl font-extrabold text-primary">
          +{TECHNOLOGY_ZONE_XP} XP
        </p>

        <p className="mt-5 font-bold text-secondary">
          ✦ Conceptos descubiertos
        </p>

        <div className="card-collection mt-4">
          {zone.terms.map((number) => {
            const term = technologyOfficialTerm(number);

            return (
              <MagicCard
                key={number}
                compact
                revealed
                label={term.term}
                title={term.term}
                symbol={zone.emoji}
                matched
                world="ciudad"
              />
            );
          })}
        </div>

        <p className="mt-5 font-bold text-secondary">
          {next
            ? `🔓 ${next.name} desbloqueada`
            : "🏙️ Ciudad Tecnológica conquistada"}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/ciudad">Volver a la ciudad</Link>
          </Button>

          {next && (
            <Button asChild>
              <Link
                to="/aventura-tecnologica/$zona"
                params={{ zona: next.id }}
              >
                Siguiente zona <ArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </section>
    );
  }

  if (
    draft.stage === "playing" &&
    !hasProgress &&
    !missionAccepted
  ) {
    return (
      <section className="py-4 text-center">
        <QuestGuide message="¡Una carta tecnológica nos espera!" />

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
            world="ciudad"
          >
            {zone.intro}
          </MagicCard>
        </div>

        <p className="mt-4 font-bold text-secondary">
          Recompensa: {TECHNOLOGY_ZONE_XP} XP
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

  // ZONA 1: PLAZA DE LA INNOVACIÓN
  if (zone.id === "plaza") {
    const definitions = [...zone.terms].reverse();

    function chooseDefinition(number: number) {
      if (draft.matched.includes(number)) return;

      if (selectedTerm === null) {
        setFeedback("Primero selecciona una carta de concepto.");
        return;
      }

      if (selectedTerm === number) {
        const nextMatched = [
          ...draft.matched,
          number,
        ];

        const nextDraft: TechnologyZoneDraft = {
          ...draft,
          matched: nextMatched,
          revealed: [
            ...new Set([
              ...draft.revealed,
              number,
            ]),
          ],
          completed:
            nextMatched.length === zone.terms.length,
        };

        setSelectedTerm(null);
        setSuccess(true);
        setFeedback(
          "¡Pareja correcta! Has conectado el concepto tecnológico. ✨",
        );

        if (nextMatched.length === zone.terms.length) {
          completeTechnologyZone(zone.id, nextDraft);
        } else {
          save(nextDraft);
        }
      } else {
        setSelectedTerm(null);
        setSuccess(false);
        setFeedback(
          "¡Esa no es la pareja correcta! Inténtalo otra vez.",
        );
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
          Parejas encontradas: {draft.matched.length}/
          {zone.terms.length}
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-center font-bold">
              💡 Conceptos
            </h2>

            <div className="grid gap-3">
              {zone.terms.map((number) => {
                const term = technologyOfficialTerm(number);
                const matched = draft.matched.includes(number);

                return (
                  <MagicCard
                    key={number}
                    revealed
                    compact
                    label={term.term}
                    title={term.term}
                    symbol="💡"
                    selected={selectedTerm === number}
                    matched={matched}
                    disabled={matched}
                    world="ciudad"
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
            <h2 className="mb-3 text-center font-bold">
              📜 Definiciones
            </h2>

            <div className="grid gap-3">
              {definitions.map((number) => {
                const term = technologyOfficialTerm(number);
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
                    world="ciudad"
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

  // ZONA 2: LABORATORIO DE TECNOLOGÍA
  if (zone.id === "laboratorio") {
    const currentNumber = zone.terms.find(
      (value) => !draft.matched.includes(value),
    );

    if (currentNumber === undefined) return null;

    const activeNumber = currentNumber;
    const term = technologyOfficialTerm(activeNumber);
    const words = term.definition.split(/\s+/);

    const pieces = Array.from({ length: 4 }, (_, i) => {
      const start = Math.floor((i * words.length) / 4);
      const end = Math.floor(((i + 1) * words.length) / 4);

      return {
        id: i,
        text: words.slice(start, end).join(" "),
      };
    });

    const shuffledPieces = [
      pieces[2]!,
      pieces[0]!,
      pieces[3]!,
      pieces[1]!,
    ];

    function choosePiece(id: number) {
      if (draft.order.includes(id)) return;

      const nextOrder = [
        ...draft.order,
        id,
      ];

      if (nextOrder.length === 4) {
        const correct = nextOrder.every(
          (value, position) => value === position,
        );

        if (correct) {
          const nextMatched = [
            ...draft.matched,
            activeNumber,
          ];

          const nextDraft: TechnologyZoneDraft = {
            ...draft,
            matched: nextMatched,
            order: [],
            completed:
              nextMatched.length === zone.terms.length,
          };

          setSuccess(true);
          setFeedback(
            "¡Has organizado el proceso tecnológico correctamente! ✨",
          );

          if (nextMatched.length === zone.terms.length) {
            completeTechnologyZone(zone.id, nextDraft);
          } else {
            save(nextDraft);
          }
        } else {
          save({
            ...draft,
            order: [],
          });

          setSuccess(false);
          setFeedback(
            "Los fragmentos no están en el orden correcto. ¡Inténtalo otra vez!",
          );
        }
      } else {
        save({
          ...draft,
          order: nextOrder,
        });

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
          Conceptos reconstruidos: {draft.matched.length}/
          {zone.terms.length}
        </p>

        <h2 className="mt-6 text-center text-xl font-bold">
          🤖 {term.term}
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
  label="Pieza de la definición"
  title=" "
  symbol="🤖"
  selected={draft.order.includes(piece.id)}
  disabled={draft.order.includes(piece.id)}
  world="ciudad"
  onClick={() => choosePiece(piece.id)}
>
  {piece.text}
</MagicCard>
          ))}
        </div>
      </section>
    );
  }

  // ZONA 3: CENTRO DE PROTOTIPOS
  if (zone.id === "prototipos") {
    const definitions = [...zone.terms].reverse();

    function chooseDefinition(number: number) {
      if (selectedTerm === null) return;

      if (selectedTerm === number) {
        const nextMatched = [
          ...draft.matched,
          number,
        ];

        const nextDraft: TechnologyZoneDraft = {
          ...draft,
          matched: nextMatched,
          revealed: [
            ...new Set([
              ...draft.revealed,
              number,
            ]),
          ],
          completed:
            nextMatched.length === zone.terms.length,
        };

        save(nextDraft);
        setSelectedTerm(null);
        setSuccess(true);
        setFeedback(
          "¡Respuesta correcta! El prototipo recuperó su concepto. ✨",
        );

        if (nextMatched.length === zone.terms.length) {
          completeTechnologyZone(zone.id, nextDraft);
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
            "Descubre una carta y encuentra la definición que le corresponde."
          }
        />

        <p className="mt-4 text-center font-bold text-secondary">
          Prototipos recuperados: {draft.matched.length}/
          {zone.terms.length}
        </p>

        <h2 className="mt-6 text-center font-bold">
          🚀 Cartas de prototipo
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {zone.terms.map((number) => {
            const term = technologyOfficialTerm(number);
            const matched = draft.matched.includes(number);

            return (
              <MagicCard
                key={number}
                revealed={
                  selectedTerm === number || matched
                }
                label={`Descubrir ${term.term}`}
                title={term.term}
                symbol="🚀"
                selected={selectedTerm === number}
                matched={matched}
                disabled={matched}
                world="ciudad"
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
                const term = technologyOfficialTerm(number);

                return (
                  <MagicCard
                    key={number}
                    revealed
                    compact
                    kind="answer"
                    label={`Definición de ${term.term}`}
                    title="Definición"
                    symbol="✨"
                    world="ciudad"
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

  // ZONA 4: RED DIGITAL
  if (zone.id === "red-digital") {
    function chooseMemoryCard(
      cardId: string,
      number: number,
    ) {
      if (draft.matched.includes(number)) return;

      if (selectedMemoryCards.includes(cardId)) return;

      if (selectedMemoryCards.length === 2) {
        setSelectedMemoryCards([cardId]);
        setFeedback(
          "Busca la pareja de esta nueva carta.",
        );
        setSuccess(false);
        return;
      }

      const nextSelected = [
        ...selectedMemoryCards,
        cardId,
      ];

      setSelectedMemoryCards(nextSelected);

      if (nextSelected.length === 1) {
        setFeedback(
          "¡Ahora encuentra la carta que corresponde!",
        );
        setSuccess(false);
        return;
      }

      const firstCard = nextSelected[0]!;
      const firstNumber = Number(firstCard.slice(1));
      const secondNumber = number;

      const isPair =
        firstNumber === secondNumber &&
        firstCard[0] !== cardId[0];

      if (isPair) {
        const nextMatched = [
          ...draft.matched,
          number,
        ];

        const nextDraft: TechnologyZoneDraft = {
          ...draft,
          matched: nextMatched,
          revealed: [
            ...new Set([
              ...draft.revealed,
              number,
            ]),
          ],
          completed:
            nextMatched.length === zone.terms.length,
        };

        save(nextDraft);
        setSelectedMemoryCards([]);
        setSuccess(true);
        setFeedback(
          "¡Encontraste una conexión digital! ✨",
        );

        if (nextMatched.length === zone.terms.length) {
          completeTechnologyZone(zone.id, nextDraft);
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
            "La red perdió sus conexiones. Encuentra los conceptos y sus definiciones."
          }
        />

        <p className="mt-4 text-center font-bold text-secondary">
          Conexiones encontradas: {draft.matched.length}/
          {zone.terms.length}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {zone.terms.map((number) => {
            const term = technologyOfficialTerm(number);
            const matched = draft.matched.includes(number);

            const conceptId = `c${number}`;
            const definitionId = `d${number}`;

            const conceptRevealed =
              matched ||
              selectedMemoryCards.includes(conceptId);

            const definitionRevealed =
              matched ||
              selectedMemoryCards.includes(
                definitionId,
              );

            return (
              <div key={number} className="contents">
                <MagicCard
                  revealed={conceptRevealed}
                  label={`Carta de concepto ${term.term}`}
                  title={term.term}
                  symbol="🌐"
                  matched={matched}
                  disabled={matched}
                  world="ciudad"
                  onClick={() =>
                    chooseMemoryCard(
                      conceptId,
                      number,
                    )
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
                  world="ciudad"
                  onClick={() =>
                    chooseMemoryCard(
                      definitionId,
                      number,
                    )
                  }
                >
                  {term.definition}
                </MagicCard>
              </div>
            );
          })}
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Encuentra las tres conexiones para restablecer la red.
        </p>
      </section>
    );
  }

  // ZONA 5: TALLER DEL CAMBIO
  if (zone.id === "taller") {
    const scenarios: Record<number, string> = {
      42: "Un equipo prepara un espacio de trabajo y necesita mantenerlo limpio y adecuado para realizar sus actividades. ¿Qué concepto representa esta condición?",
      46: "Una empresa quiere implementar una nueva tecnología y debe respetar las leyes y normas que corresponden. ¿Qué concepto debe considerar?",
      47: "Un proyecto necesita personas con conocimientos y habilidades para realizar correctamente las actividades. ¿Qué concepto representa a esas personas?",
    };

    const number = zone.terms.find(
      (value) => !draft.matched.includes(value),
    );

    if (number === undefined) return null;

    const activeNumber = number;

    function chooseDecision(answer: number) {
      if (draft.matched.includes(activeNumber)) return;

      if (answer === activeNumber) {
        const nextMatched = [
          ...draft.matched,
          activeNumber,
        ];

        const nextDraft: TechnologyZoneDraft = {
          ...draft,
          matched: nextMatched,
          revealed: [
            ...new Set([
              ...draft.revealed,
              activeNumber,
            ]),
          ],
          decisions: [
            ...draft.decisions,
            answer,
          ],
          completed:
            nextMatched.length === zone.terms.length,
        };

        save(nextDraft);
        setSuccess(true);
        setFeedback(
          "¡Decisión correcta! Has elegido el camino tecnológico adecuado. ✨",
        );

        if (nextMatched.length === zone.terms.length) {
          completeTechnologyZone(zone.id, nextDraft);
        }
      } else {
        setSuccess(false);
        setFeedback(
          "Ese concepto no corresponde a la situación. ¡Analiza otra vez!",
        );
      }
    }

    return (
      <section className="quest-enter py-4">
        <QuestGuide
          celebrate={success}
          message={
            feedback ||
            "Lee la situación y elige el concepto tecnológico correcto."
          }
        />

        <p className="mt-4 text-center font-bold text-secondary">
          Decisiones acertadas: {draft.matched.length}/
          {zone.terms.length}
        </p>

        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border-2 border-primary/20 bg-card p-5 text-center shadow-quest">
          <span className="text-4xl">⚙️</span>

          <p className="mt-3 text-xs font-bold uppercase text-secondary">
            Situación del taller
          </p>

          <h2 className="mt-3 text-lg font-bold">
            {scenarios[activeNumber]}
          </h2>
        </div>

        <h3 className="mb-4 mt-8 text-center font-bold">
          🔮 Elige tu respuesta
        </h3>

        <div className="grid gap-3 sm:grid-cols-3">
          {[...zone.terms].reverse().map((option) => {
            const optionTerm =
              technologyOfficialTerm(option);

            return (
              <MagicCard
                key={option}
                revealed
                compact
                label={optionTerm.term}
                title={optionTerm.term}
                symbol="⚙️"
                world="ciudad"
                onClick={() =>
                  chooseDecision(option)
                }
              >
                {optionTerm.definition}
              </MagicCard>
            );
          })}
        </div>
      </section>
    );
  }

  // ZONA 6: TORRE DEL FUTURO
  if (zone.id === "torre") {
    const challenges = [
      {
        question:
          "Una organización utiliza herramientas y recursos para manejar información mediante computadoras y otros medios tecnológicos. ¿Qué concepto representa esto?",
        answer: 50,
        options: [50, 51, 52],
      },
      {
        question:
          "Una herramienta tecnológica creada para realizar una función específica puede ser utilizada por una persona para resolver una necesidad. ¿Qué concepto representa?",
        answer: 51,
        options: [51, 50, 52],
      },
      {
        question:
          "Una representación que explica cómo funciona o se organiza algo puede utilizarse para comprender un sistema. ¿Qué concepto representa?",
        answer: 52,
        options: [52, 51, 50],
      },
    ];

    const currentStep = Math.min(
      draft.matched.length,
      challenges.length - 1,
    );

    const challenge = challenges[currentStep];

    if (!challenge) return null;

    const activeChallenge = challenge;

    function answerTower(answer: number) {
      if (
        draft.matched.includes(
          activeChallenge.answer,
        )
      ) {
        return;
      }

      if (answer === activeChallenge.answer) {
        const nextMatched = [
          ...draft.matched,
          activeChallenge.answer,
        ];

        const nextDraft: TechnologyZoneDraft = {
          ...draft,
          matched: nextMatched,
          revealed: [
            ...new Set([
              ...draft.revealed,
              activeChallenge.answer,
            ]),
          ],
          completed:
            nextMatched.length === zone.terms.length,
        };

        save(nextDraft);
        setSuccess(true);
        setFeedback(
          "¡Correcto! La torre se ilumina y revela el camino al futuro. ✨",
        );

        if (nextMatched.length === zone.terms.length) {
          completeTechnologyZone(zone.id, nextDraft);
        }
      } else {
        setSuccess(false);
        setFeedback(
          "Esa respuesta no es correcta. ¡Inténtalo de nuevo!",
        );
      }
    }

    if (draft.matched.length === zone.terms.length) {
      return (
        <section className="quest-enter py-8 text-center">
          <QuestGuide
            celebrate
            message="¡Lo conseguiste! Has demostrado todo lo que aprendiste en la Ciudad Tecnológica."
          />

          <div className="mx-auto mt-6 max-w-xl rounded-3xl border-2 border-primary/30 bg-card p-8 shadow-quest">
            <div className="text-6xl">🏆</div>

            <h2 className="mt-4 text-2xl font-bold text-secondary">
              ¡Torre conquistada!
            </h2>

            <p className="mt-3">
              Has superado las tres pruebas y completado tu aventura tecnológica.
            </p>

            <p className="mt-4 font-bold text-primary">
              +{TECHNOLOGY_ZONE_XP} XP
            </p>
          </div>
        </section>
      );
    }

    return (
      <section className="quest-enter py-4">
        <QuestGuide
          celebrate={success}
          message={
            feedback ||
            "La torre guarda tres pruebas. Responde correctamente para recuperar todo el conocimiento."
          }
        />

        <div className="mx-auto mt-5 max-w-2xl rounded-2xl border-2 border-primary/20 bg-card p-6 text-center shadow-quest">
          <div className="text-5xl">🏆</div>

          <p className="mt-3 text-xs font-bold uppercase text-secondary">
            Prueba {draft.matched.length + 1} de 3
          </p>

          <h2 className="mt-4 text-lg font-bold">
            {activeChallenge.question}
          </h2>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {activeChallenge.options.map((option) => {
            const term =
              technologyOfficialTerm(option);

            return (
              <MagicCard
                key={option}
                revealed
                compact
                label={term.term}
                title={term.term}
                symbol="🏙️"
                world="ciudad"
                onClick={() =>
                  answerTower(option)
                }
              >
                {term.definition}
              </MagicCard>
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Cada respuesta correcta ilumina el camino hacia la última recompensa.
        </p>
      </section>
    );
  }

  return (
    <section className="quest-enter py-4">
      <QuestGuide
        celebrate={success}
        message={
          feedback ||
          "¡Descubre las cartas y completa los desafíos de la Ciudad Tecnológica!"
        }
      />

      <p className="mt-4 text-center font-bold text-secondary">
        Conceptos completados: {draft.matched.length}/
        {zone.terms.length}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {zone.terms.map((number) => {
          const term =
            technologyOfficialTerm(number);

          const revealed =
            draft.revealed.includes(number) ||
            draft.matched.includes(number);

          return (
            <MagicCard
              key={number}
              revealed={revealed}
              label={`Descubrir ${term.term}`}
              title={term.term}
              symbol={zone.emoji}
              matched={draft.matched.includes(number)}
              world="ciudad"
              onClick={() => {
                save({
                  ...draft,
                  revealed: [
                    ...new Set([
                      ...draft.revealed,
                      number,
                    ]),
                  ],
                });

                setFeedback(
                  `Has descubierto: ${term.term}`,
                );
                setSuccess(false);
              }}
            >
              {term.definition}
            </MagicCard>
          );
        })}
      </div>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Estamos preparando este desafío tecnológico.
      </p>
    </section>
  );
}