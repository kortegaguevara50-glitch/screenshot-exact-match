
import type { ReactNode } from "react";
import { Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import valleyBack from "@/assets/valley-card-back.jpg";

export function MagicCard({
  revealed,
  onClick,
  label,
  title,
  children,
  symbol = "✦",
  kind = "concept",
  selected = false,
  matched = false,
  wrong = false,
  compact = false,
  disabled = false,
  world = "valle",
}: {
  revealed: boolean;
  onClick?: () => void;
  label: string;
  title?: string;
  children?: ReactNode;
  symbol?: string;
  kind?: "concept" | "answer" | "mission";
  selected?: boolean;
  matched?: boolean;
  wrong?: boolean;
  compact?: boolean;
  disabled?: boolean;
  world?: "bosque" | "valle" | "ciudad" | "fortaleza";
}) {
  const back = valleyBack;

  const worldName =
    world === "bosque"
      ? "Bosque"
      : world === "fortaleza"
        ? "Fortaleza"
        : "Valle";

  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={label}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={`magic-card magic-card-${kind} ${
        compact ? "magic-card-compact" : ""
      } ${revealed ? "is-revealed" : ""} ${
        selected ? "is-selected" : ""
      } ${matched ? "is-matched" : ""} ${
        wrong ? "quest-nudge" : ""
      }`}
    >
      <span className="magic-card-turn">
        <span className="magic-card-back" aria-hidden={revealed}>
          <img
            src={back}
            width={768}
            height={1152}
            loading="lazy"
            alt=""
          />

          <span className="magic-card-back-label">
            <Sparkles />
            {kind === "mission" ? "Abrir misión" : "Descubrir carta"}
          </span>
        </span>

        <span className="magic-card-front" aria-hidden={!revealed}>
          <span className="magic-card-caption">
            {kind === "mission"
              ? `Misión del ${worldName}`
              : kind === "answer"
                ? "Carta de respuesta"
                : "Carta de concepto"}
          </span>

          <span className="magic-card-symbol" aria-hidden="true">
            {symbol}
          </span>

          {title && (
            <span className="magic-card-title">{title}</span>
          )}

          {children && (
            <span className="magic-card-text">{children}</span>
          )}

          <span className="magic-card-seal" aria-hidden="true">
            {matched ? "✓" : <Compass />}
          </span>
        </span>
      </span>
    </Button>
  );
}
