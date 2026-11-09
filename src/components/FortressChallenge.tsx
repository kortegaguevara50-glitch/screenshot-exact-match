
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/MagicCard";
import { QuestGuide, RewardStars } from "@/components/QuestRewards";
import {
  completeFortressZone,
  saveFortressZoneDraft,
  useProgress,
} from "@/game/progress";
import {
  FORTRESS_ZONES,
  FORTRESS_ZONE_XP,
  fortressOfficialTerm,
  fortressZoneUnlocked,
  type FortressZone,
  type FortressZoneDraft,
} from "@/game/fortress-adventure";

export function FortressChallenge({
  zone,
}: {
  zone: FortressZone;
}) {
  const p = useProgress();
  const adventure = p.fortressAdventure;

  const draft: FortressZoneDraft =
    adventure.drafts[zone.id] ?? {
      kind: zone.kind,
      stage: "intro",
      matched: [],
      selected: [],
      order: [],
      revealed: [],
      decisions: [],
      completed: false,
    };

  const [missionOpen, setMissionOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(
    null,
  );
  const [selectedMemoryPosition, setSelectedMemoryPosition] =
    useState<number | null>(null);
  const [wrongMemoryPositions, setWrongMemoryPositions] =
    useState<number[]>([]);

  const index = FORTRESS_ZONES.findIndex(
    (entry) => entry.id === zone.id,
  );

  const done = adventure.completed.includes(zone.id);
  const next = FORTRESS_ZONES[index + 1];

  function save(nextDraft: FortressZoneDraft) {
    saveFortressZoneDraft(zone.id, nextDraft);
  }

  function acceptMission() {
    save({
      ...draft,
      stage: "playing",
    });
  }

  if (!fortressZoneUnlocked(adventure, index)) {
    return (
      <div className="py-8 text-center">
        <QuestGuide message="Primero debemos abrir el camino anterior." />

        <Button asChild className="mt-6">
          <Link to="/fortaleza">Volver a la Fortaleza</Link>
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
              : "¡Has conquistado la Fortaleza de la Evaluación!"
          }
        />

        <h2 className="mt-4 text-2xl font-bold">
          ¡MISIÓN COMPLETADA!
        </h2>

        <p className="quest-xp mt-3 text-4xl font-extrabold text-primary">
          +{FORTRESS_ZONE_XP} XP
        </p>

        <p className="mt-5 font-bold text-secondary">
          ✦ Cartas descubiertas
        </p>

        <div className="card-collection mt-4">
          {zone.terms.map((number) => {
            const term = fortressOfficialTerm(number);

            return (
              <MagicCard
                key={number}
                compact
                revealed
                label={term.term}
                title={term.term}
                symbol={zone.emoji}
                matched
                world="fortaleza"
              />
            );
          })}
        </div>

        <p className="mt-5 font-bold text-secondary">
          {next
            ? `🔓 ${next.name} desbloqueada`
            : "🏰 Fortaleza conquistada"}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/fortaleza">Ver mi colección</Link>
          </Button>

          {next && (
            <Button asChild>
              <Link
                to="/aventura-fortaleza/$zona"
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
            world="fortaleza"
          >
            {zone.intro}
          </MagicCard>
        </div>

        <p className="mt-4 font-bold text-secondary">
          Recompensa: {FORTRESS_ZONE_XP} XP
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

  /*
   * 1. SALA DE LOS INDICADORES
   * Une cada concepto con su definición.
   */
  if (draft.stage === "playing" && zone.kind === "match") {
    const definitions = [...zone.terms].reverse();

    function chooseDefinition(number: number) {
      if (draft.matched.includes(number)) return;

      if (selectedTerm === null) {
        setFeedback(
          "Primero selecciona una carta de concepto.",
        );
        setSuccess(false);
        return;
      }

      if (selectedTerm === number) {
        const nextMatched = [...draft.matched, number];

        const nextDraft: FortressZoneDraft = {
          ...draft,
          matched: nextMatched,
          revealed: [
            ...new Set([...draft.revealed, number]),
          ],
        };

        if (nextMatched.length === zone.terms.length) {
          completeFortressZone(zone.id, {
            ...nextDraft,
            completed: true,
          });
        } else {
          save(nextDraft);
        }

        setSelectedTerm(null);
        setSuccess(true);
        setFeedback(
          "¡Pareja correcta! Has unido el concepto con su definición. ✨",
        );
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
              📊 Conceptos
            </h2>

            <div className="grid gap-3">
              {zone.terms.map((number) => {
                const term = fortressOfficialTerm(number);
                const matched =
                  draft.matched.includes(number);

                return (
                  <MagicCard
                    key={number}
                    revealed
                    compact
                    label={term.term}
                    title={term.term}
                    symbol="📊"
                    selected={selectedTerm === number}
                    matched={matched}
                    disabled={matched}
                    world="fortaleza"
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
                const term = fortressOfficialTerm(number);
                const matched =
                  draft.matched.includes(number);

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
                    world="fortaleza"
                    onClick={() =>
                      chooseDefinition(number)
                    }
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

  /*
   * 2. CÁMARA DE LOS RECURSOS
   * El jugador debe recuperar los conceptos correctos.
   */
  if (draft.stage === "playing" && zone.kind === "order") {
    const scenarios = [
      {
        number: 64,
        title: "Situación 1",
        text:
          "La fortaleza tiene dinero, tiempo, personas, materiales y tecnología disponibles para realizar sus actividades. ¿Qué concepto representa todo eso?",
      },
      {
        number: 65,
        title: "Situación 2",
        text:
          "Para realizar una actividad del proyecto se necesita pagar una cantidad de dinero. ¿Qué concepto representa ese gasto?",
      },
      {
        number: 68,
        title: "Situación 3",
        text:
          "La fortaleza destina dinero y tiempo a un proyecto esperando obtener un beneficio o resultado en el futuro. ¿Qué concepto representa?",
      },
    ];

    const currentIndex = draft.order.length;
    const currentScenario = scenarios[currentIndex];

    if (!currentScenario) {
      return null;
    }

    const scenario = currentScenario;
    const options = [68, 64, 65];

    function selectResource(number: number) {
      if (number !== scenario.number) {
        setSuccess(false);
        setFeedback(
          "Ese concepto no corresponde a la situación. Inténtalo de nuevo.",
        );
        return;
      }

      const nextOrder = [...draft.order, number];

      if (nextOrder.length === scenarios.length) {
        completeFortressZone(zone.id, {
          ...draft,
          order: nextOrder,
          completed: true,
        });

        setSuccess(true);
        setFeedback(
          "¡Excelente! Recuperaste todos los recursos de la fortaleza. ✨",
        );

        return;
      }

      save({
        ...draft,
        order: nextOrder,
      });

      setSuccess(true);
      setFeedback(
        `¡Correcto! ${fortressOfficialTerm(number).term} fue recuperado. Continúa con la siguiente situación.`,
      );
    }

    return (
      <section className="quest-enter py-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Situación {currentIndex + 1} de {scenarios.length}
            </p>

            <h3 className="mt-1 text-xl font-bold text-slate-900">
              {scenario.title}
            </h3>
          </div>

          <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
            {draft.order.length}/{scenarios.length} recuperados
          </div>
        </div>

        <QuestGuide
          celebrate={success}
          message={
            feedback ||
            "Lee la situación y elige el concepto correcto."
          }
        />

        <div className="mb-5 mt-5">
          <MagicCard
            revealed
            compact
            label="Misión"
            title={scenario.title}
            symbol="📜"
            world="fortaleza"
          >
            {scenario.text}
          </MagicCard>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-3">
          {options.map((number) => {
            const item = fortressOfficialTerm(number);

            return (
              <MagicCard
                key={number}
                revealed
                compact
                label={`Concepto ${number}`}
                title={item.term}
                symbol={
                  number === 64
                    ? "📦"
                    : number === 65
                      ? "💸"
                      : "💰"
                }
                world="fortaleza"
                onClick={() => selectResource(number)}
              >
                {item.definition}
              </MagicCard>
            );
          })}
        </div>

        {draft.order.length > 0 && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="mb-3 text-sm font-bold text-emerald-800">
              🏆 Recursos recuperados
            </p>

            <div className="flex flex-wrap gap-2">
              {draft.order.map((number) => (
                <span
                  key={number}
                  className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-emerald-700 shadow-sm"
                >
                  ✓ {fortressOfficialTerm(number).term}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  }

  /*
   * 3. TRIBUNAL DE LA EVALUACIÓN
   * El jugador analiza casos y selecciona la evidencia correcta.
   */
  if (draft.stage === "playing" && zone.kind === "complete") {
    const cases = [
      {
        number: 3,
        title: "Caso 1: Analizar resultados",
        text:
          "El tribunal necesita conocer los resultados, la calidad y el progreso de una actividad. ¿Qué concepto debe utilizar?",
      },
      {
        number: 11,
        title: "Caso 2: Revisar un proyecto",
        text:
          "Un proyecto necesita ser analizado para saber si puede cumplir sus objetivos y si sus resultados son adecuados. ¿Qué concepto corresponde?",
      },
      {
        number: 59,
        title: "Caso 3: Recopilar información",
        text:
          "El tribunal necesita una herramienta para recopilar información y valorar conocimientos, resultados o desempeño. ¿Qué concepto necesita?",
      },
    ];

    const currentIndex = draft.selected.length;
    const currentCase = cases[currentIndex];

    if (!currentCase) {
      return null;
    }

    const tribunalCase = currentCase;
    const options = [59, 3, 11];

    function selectEvidence(number: number) {
      if (number !== tribunalCase.number) {
        setSuccess(false);
        setFeedback(
          "❌ Esa evidencia no corresponde al caso. Analiza nuevamente la situación.",
        );
        return;
      }

      const nextSelected = [
        ...draft.selected,
        number,
      ];

      if (nextSelected.length === cases.length) {
        completeFortressZone(zone.id, {
          ...draft,
          selected: nextSelected,
          completed: true,
        });

        setSuccess(true);
        setFeedback(
          "¡Caso resuelto! Has demostrado que sabes evaluar correctamente. ⚖️✨",
        );

        return;
      }

      save({
        ...draft,
        selected: nextSelected,
      });

      setSuccess(true);
      setFeedback(
        `¡Evidencia correcta! "${fortressOfficialTerm(number).term}" ha sido aceptada. El tribunal presenta el siguiente caso.`,
      );
    }

    return (
      <section className="quest-enter py-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-amber-700">
              Caso {currentIndex + 1} de {cases.length}
            </p>

            <h3 className="mt-1 text-xl font-bold text-slate-900">
              ⚖️ {tribunalCase.title}
            </h3>
          </div>

          <div className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">
            {draft.selected.length}/{cases.length} resueltos
          </div>
        </div>

        <QuestGuide
          celebrate={success}
          message={
            feedback ||
            "Lee el caso y selecciona la evidencia correcta."
          }
        />

        <div className="mx-auto mb-5 mt-5 max-w-2xl">
          <MagicCard
            revealed
            label="⚖️ Caso del tribunal"
            title={tribunalCase.title}
            symbol="📜"
            matched
            world="fortaleza"
          >
            {tribunalCase.text}
          </MagicCard>
        </div>

        <div className="mb-4 text-center">
          <p className="font-bold text-secondary">
            🔎 Evidencias disponibles
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Analiza cada carta antes de tomar tu decisión.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-3">
          {options.map((number) => {
            const term = fortressOfficialTerm(number);

            return (
              <MagicCard
                key={number}
                revealed
                compact
                label="Evidencia"
                title={term.term}
                symbol="🔎"
                world="fortaleza"
                onClick={() =>
                  selectEvidence(number)
                }
              >
                {term.definition}
              </MagicCard>
            );
          })}
        </div>

        {draft.selected.length > 0 && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="mb-3 text-sm font-bold text-amber-800">
              🏆 Casos resueltos
            </p>

            <div className="flex flex-wrap gap-2">
              {draft.selected.map((number) => (
                <span
                  key={number}
                  className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-amber-700 shadow-sm"
                >
                  ✓ {fortressOfficialTerm(number).term}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  }

  /*
   * 4. CÁMARA DE VERIFICACIÓN
   * Memorama de parejas.
   */
  if (draft.stage === "playing" && zone.kind === "memory") {
    const memoryCards = [
      ...zone.terms,
      ...[...zone.terms].reverse(),
    ];

    const currentRevealed = draft.revealed;
    const firstPosition = selectedMemoryPosition;

    function chooseMemory(
      number: number,
      position: number,
    ) {
      if (wrongMemoryPositions.length > 0) return;

      if (currentRevealed.includes(number)) return;

      if (firstPosition === position) return;

      if (firstPosition === null) {
        setSelectedTerm(number);
        setSelectedMemoryPosition(position);
        setSuccess(false);
        setFeedback(
          "Carta descubierta. Ahora busca su pareja.",
        );
        return;
      }

      if (selectedTerm === number) {
        const nextRevealed = [
          ...new Set([
            ...currentRevealed,
            number,
          ]),
        ];

        const nextDraft: FortressZoneDraft = {
          ...draft,
          revealed: nextRevealed,
        };

        if (nextRevealed.length === zone.terms.length) {
          completeFortressZone(zone.id, {
            ...nextDraft,
            completed: true,
          });

          setSuccess(true);
          setFeedback(
            "¡Memorama completado! Encontraste todas las parejas. 🧠✨",
          );
        } else {
          save(nextDraft);

          setSuccess(true);
          setFeedback(
            "¡Pareja encontrada! Sigue buscando las demás. ✨",
          );
        }

        setSelectedTerm(null);
        setSelectedMemoryPosition(null);
        return;
      }

      setSuccess(false);
      setFeedback(
        "❌ No son pareja. Observa las cartas y recuerda sus posiciones.",
      );

      setWrongMemoryPositions([firstPosition, position]);

      setTimeout(() => {
        setWrongMemoryPositions([]);
        setSelectedTerm(null);
        setSelectedMemoryPosition(null);
      }, 1000);
    }

    return (
      <section className="quest-enter py-4">
        <QuestGuide
          celebrate={success}
          message={
            feedback ||
            "Encuentra las parejas. Descubre dos cartas y recuerda sus posiciones."
          }
        />

        <div className="mx-auto mt-4 max-w-2xl text-center">
          <p className="font-bold text-secondary">
            🧠 Parejas encontradas: {draft.revealed.length}/
            {zone.terms.length}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Encuentra las 3 parejas para superar la Cámara de Verificación.
          </p>
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-3">
          {memoryCards.map((number, position) => {
            const term = fortressOfficialTerm(number);

            const visible =
              currentRevealed.includes(number) ||
              firstPosition === position ||
              wrongMemoryPositions.includes(position);

            const matched =
              currentRevealed.includes(number);

            return (
              <MagicCard
                key={`${number}-${position}`}
                revealed={visible}
                compact
                label={
                  visible
                    ? term.term
                    : "Carta misteriosa"
                }
                title={
                  visible
                    ? term.term
                    : "¿Qué hay aquí?"
                }
                symbol={visible ? "🔍" : "❓"}
                selected={
                  firstPosition === position ||
                  wrongMemoryPositions.includes(position)
                }
                matched={matched}
                disabled={matched || wrongMemoryPositions.length > 0}
                world="fortaleza"
                onClick={() =>
                  chooseMemory(number, position)
                }
              >
                {visible
                  ? term.definition
                  : "Haz clic para descubrir"}
              </MagicCard>
            );
          })}
        </div>

        <div className="mx-auto mt-5 max-w-3xl rounded-2xl border border-purple-200 bg-purple-50 p-4 text-center">
          <p className="font-bold text-purple-800">
            🃏 Recuerda las posiciones
          </p>

          <p className="mt-1 text-sm text-purple-700">
            Si las cartas no coinciden, tendrás un momento para observarlas antes de que vuelvan a ocultarse.
          </p>
        </div>
      </section>
    );
  }

  /*
   * 5. TORRE DEL DESEMPEÑO
   * Tres pisos y tres decisiones.
   */
  if (draft.stage === "playing" && zone.kind === "decisions") {
    const floors = [
      {
        number: 32,
        title: "Piso 1: El desempeño",
        text:
          "La fortaleza necesita saber qué tan bien está trabajando una persona o un equipo y conocer sus resultados. ¿Qué concepto debe utilizar?",
      },
      {
        number: 62,
        title: "Piso 2: La eficiencia",
        text:
          "La fortaleza quiere alcanzar un resultado utilizando correctamente el tiempo, el dinero y los recursos disponibles. ¿Qué concepto corresponde?",
      },
      {
        number: 63,
        title: "Piso 3: La economía",
        text:
          "La fortaleza necesita administrar sus recursos y evitar gastos innecesarios para utilizarlos de la mejor manera. ¿Qué concepto corresponde?",
      },
    ];

    const currentIndex = draft.decisions.length;
    const currentFloor = floors[currentIndex];

    if (!currentFloor) {
      return null;
    }

    const floor = currentFloor;
    const options = [63, 32, 62];

    function chooseDecision(number: number) {
      if (number !== floor.number) {
        setSuccess(false);
        setFeedback(
          "❌ Esa opción no permite subir al siguiente piso. Analiza la situación e inténtalo otra vez.",
        );
        return;
      }

      const nextDecisions = [
        ...draft.decisions,
        number,
      ];

      if (nextDecisions.length === floors.length) {
        completeFortressZone(zone.id, {
          ...draft,
          decisions: nextDecisions,
          completed: true,
        });

        setSuccess(true);
        setFeedback(
          "¡Excelente! Llegaste a la cima de la Torre del Desempeño. 📈✨",
        );

        return;
      }

      save({
        ...draft,
        decisions: nextDecisions,
      });

      setSuccess(true);
      setFeedback(
        `¡Correcto! ${fortressOfficialTerm(number).term} te permite subir al siguiente piso. ⬆️`,
      );
    }

    return (
      <section className="quest-enter py-4">
        <div className="mb-5 text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
            Torre del Desempeño
          </p>

          <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
            📈 {floor.title}
          </h2>

          <div className="mx-auto mt-4 flex max-w-md items-center justify-center gap-2">
            {floors.map((item, position) => {
              const reached =
                position < draft.decisions.length;
              const current =
                position === currentIndex;

              return (
                <div
                  key={item.number}
                  className={
                    reached
                      ? "flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-bold text-white"
                      : current
                        ? "flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-bold text-white ring-4 ring-indigo-100"
                        : "flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-500"
                  }
                >
                  {reached ? "✓" : position + 1}
                </div>
              );
            })}
          </div>

          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            Piso {currentIndex + 1} de {floors.length}
          </p>
        </div>

        <QuestGuide
          celebrate={success}
          message={
            feedback ||
            "Analiza la situación y elige la carta que te permita subir."
          }
        />

        <div className="mx-auto mt-5 max-w-2xl">
          <MagicCard
            revealed
            label="📜 Situación"
            title={floor.title}
            symbol="🏰"
            matched
            world="fortaleza"
          >
            {floor.text}
          </MagicCard>
        </div>

        <div className="mx-auto mt-6 max-w-3xl">
          <p className="mb-4 text-center font-bold text-secondary">
            🗝️ Elige la respuesta correcta para subir
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {options.map((number) => {
              const term = fortressOfficialTerm(number);

              return (
                <MagicCard
                  key={number}
                  revealed
                  compact
                  label="Respuesta"
                  title={term.term}
                  symbol="📈"
                  world="fortaleza"
                  onClick={() =>
                    chooseDecision(number)
                  }
                >
                  {term.definition}
                </MagicCard>
              );
            })}
          </div>
        </div>

        {draft.decisions.length > 0 && (
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
            <p className="mb-3 text-sm font-bold text-indigo-800">
              🏆 Pisos superados
            </p>

            <div className="flex flex-wrap gap-2">
              {draft.decisions.map((number, position) => (
                <span
                  key={number}
                  className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-indigo-700 shadow-sm"
                >
                  ✓ Piso {position + 1}:{" "}
                  {fortressOfficialTerm(number).term}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  }

  /*
   * 6. TRONO DE LA EVALUACIÓN
   * Misión final: resolver un problema siguiendo un proceso.
   */
  if (draft.stage === "playing" && zone.kind === "final") {
    const finalSteps = [
      {
        number: 21,
        title: "Paso 1: Comprender el problema",
        text:
          "La actividad de la fortaleza presenta errores y nadie sabe exactamente cómo funciona. Necesitas representar la situación para comprender sus partes y relaciones. ¿Qué concepto necesitas?",
        success:
          "¡Correcto! La modelación permite representar la situación para comprender mejor cómo funciona.",
        error:
          "Todavía no. Primero necesitamos representar la situación para entenderla. El control sirve para supervisar y el reporte se realiza después.",
      },
      {
        number: 55,
        title: "Paso 2: Organizar la solución",
        text:
          "Ya comprendes el problema. Ahora necesitas establecer una forma ordenada de realizar la actividad siguiendo determinados pasos. ¿Qué concepto necesitas?",
        success:
          "¡Correcto! El método establece una forma ordenada de realizar la actividad.",
        error:
          "Aún no. En este momento necesitamos decidir una forma ordenada de trabajar. La técnica se refiere a las acciones concretas que utilizaremos después.",
      },
      {
        number: 56,
        title: "Paso 3: Aplicar la solución",
        text:
          "Ya tienes una forma ordenada de trabajar. Ahora debes elegir las acciones y procedimientos que utilizarás para realizar correctamente la actividad. ¿Qué concepto necesitas?",
        success:
          "¡Correcto! La técnica representa las acciones y procedimientos que utilizarás para realizar la actividad.",
        error:
          "Todavía no. El método ya estableció el camino general. Ahora necesitamos las acciones concretas para llevarlo a cabo.",
      },
      {
        number: 9,
        title: "Paso 4: Supervisar el proceso",
        text:
          "La actividad ya está en marcha. Ahora necesitas comprobar que se está realizando de acuerdo con lo planeado y detectar posibles problemas. ¿Qué concepto necesitas?",
        success:
          "¡Correcto! El control permite supervisar y comprobar que las actividades se realicen de acuerdo con lo planeado.",
        error:
          "Aún no. La actividad ya está en marcha y necesitamos supervisarla. El reporte se elaborará cuando tengamos los resultados.",
      },
      {
        number: 30,
        title: "Paso 5: Presentar los resultados",
        text:
          "La actividad terminó. Ahora necesitas presentar la información, los resultados, los avances y las conclusiones de lo ocurrido. ¿Qué concepto necesitas?",
        success:
          "¡Correcto! El reporte reúne y presenta la información, los resultados, avances y conclusiones.",
        error:
          "Ese concepto no corresponde a esta etapa. La actividad ya terminó y ahora necesitamos documentar lo ocurrido mediante un reporte.",
      },
    ];

    const currentIndex = draft.order.length;
    const currentStep = finalSteps[currentIndex];

    if (!currentStep) {
      return null;
    }

    const step = currentStep;
    const options = [30, 56, 9, 21, 55];

    function chooseFinal(number: number) {
      if (draft.order.includes(number)) return;

      if (number !== step.number) {
        setSuccess(false);
        setFeedback(step.error);
        return;
      }

      const nextOrder = [...draft.order, number];

      if (nextOrder.length === finalSteps.length) {
        completeFortressZone(zone.id, {
          ...draft,
          order: nextOrder,
          completed: true,
        });

        setSuccess(true);
        setFeedback(
          "👑 ¡Misión completada! Resolviste el problema de la Fortaleza y conquistaste el Trono de la Evaluación. ✨",
        );

        return;
      }

      save({
        ...draft,
        order: nextOrder,
      });

      setSuccess(true);
      setFeedback(step.success);
    }

    return (
      <section className="quest-enter py-4">
        <div className="mb-5 text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-amber-600">
            Misión final
          </p>

          <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
            👑 Trono de la Evaluación
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            La fortaleza tiene un problema. Resuelve cada etapa
            utilizando el concepto adecuado y demuestra todo lo que
            aprendiste.
          </p>
        </div>

        <QuestGuide
          celebrate={success}
          message={
            feedback ||
            "Analiza la situación y elige el concepto que necesitas para resolver esta etapa."
          }
        />

        <div className="mx-auto mt-6 max-w-4xl">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-amber-700">
                  🏰 Problema de la Fortaleza
                </p>

                <p className="mt-1 font-semibold text-amber-900">
                  Etapa {currentIndex + 1} de {finalSteps.length}
                </p>
              </div>

              <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-amber-700 shadow-sm">
                {draft.order.length}/{finalSteps.length}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              {finalSteps.map((item, position) => {
                const completed =
                  position < draft.order.length;
                const current =
                  position === currentIndex;

                return (
                  <div
                    key={item.number}
                    className="flex flex-1 items-center"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={
                          completed
                            ? "flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 font-bold text-white"
                            : current
                              ? "flex h-11 w-11 items-center justify-center rounded-full bg-amber-500 font-bold text-white ring-4 ring-amber-200"
                              : "flex h-11 w-11 items-center justify-center rounded-full bg-amber-200 font-bold text-amber-700"
                        }
                      >
                        {completed
                          ? "✓"
                          : position + 1}
                      </div>

                      <span className="mt-2 hidden text-center text-xs font-semibold text-amber-800 sm:block">
                        {position === 0
                          ? "Comprender"
                          : position === 1
                            ? "Organizar"
                            : position === 2
                              ? "Aplicar"
                              : position === 3
                                ? "Supervisar"
                                : "Reportar"}
                      </span>
                    </div>

                    {position < finalSteps.length - 1 && (
                      <div
                        className={
                          position < draft.order.length
                            ? "mx-2 h-1 flex-1 rounded-full bg-emerald-400"
                            : "mx-2 h-1 flex-1 rounded-full bg-amber-200"
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-2xl">
          <MagicCard
            revealed
            label="📜 Situación actual"
            title={step.title}
            symbol="🏰"
            matched
            world="fortaleza"
          >
            {step.text}
          </MagicCard>
        </div>

        <div className="mx-auto mt-6 max-w-4xl">
          <p className="mb-2 text-center font-bold text-secondary">
            🧩 Herramientas disponibles
          </p>

          <p className="mb-5 text-center text-sm text-muted-foreground">
            Lee las definiciones y decide cuál necesitas para resolver
            esta etapa.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {options.map((number) => {
              const term = fortressOfficialTerm(number);
              const selected = draft.order.includes(number);

              return (
                <MagicCard
                  key={number}
                  revealed
                  compact
                  label={
                    selected
                      ? "Ya utilizada"
                      : "Herramienta"
                  }
                  title={term.term}
                  symbol={selected ? "✅" : "🧩"}
                  selected={selected}
                  matched={selected}
                  disabled={selected}
                  world="fortaleza"
                  onClick={() =>
                    chooseFinal(number)
                  }
                >
                  {term.definition}
                </MagicCard>
              );
            })}
          </div>
        </div>

        {draft.order.length > 0 && (
          <div className="mx-auto mt-6 max-w-4xl rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-center font-bold text-emerald-800">
              🏆 Solución construida
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-5">
              {draft.order.map((number, position) => (
                <div
                  key={number}
                  className="rounded-2xl bg-white p-3 text-center shadow-sm"
                >
                  <p className="text-xs font-bold text-emerald-600">
                    Etapa {position + 1}
                  </p>

                  <p className="mt-1 text-sm font-bold text-emerald-800">
                    {fortressOfficialTerm(number).term}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {draft.order.length === finalSteps.length && (
          <div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-amber-300 bg-amber-50 p-6 text-center">
            <ArrowUp className="mx-auto text-amber-500" />

            <h3 className="mt-2 text-2xl font-extrabold text-amber-900">
              👑 ¡El Trono es tuyo!
            </h3>

            <p className="mt-2 text-amber-800">
              Comprendiste el problema, organizaste la solución,
              aplicaste una técnica, controlaste el proceso y
              presentaste los resultados.
            </p>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="py-8 text-center">
      <QuestGuide message="Esta misión estará disponible en el siguiente paso." />

      <p className="mt-4 text-muted-foreground">
        Estamos preparando este desafío de la Fortaleza.
      </p>
    </section>
  );
}
