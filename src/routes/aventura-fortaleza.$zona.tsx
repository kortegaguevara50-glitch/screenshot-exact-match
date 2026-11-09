import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/QuestNav";
import { FortressChallenge } from "@/components/FortressChallenge";
import { FORTRESS_ZONES } from "@/game/fortress-adventure";

export const Route = createFileRoute("/aventura-fortaleza/$zona")({
  component: FortressAdventurePage,
});

function FortressAdventurePage() {
  const { zona } = Route.useParams();

  const zone = FORTRESS_ZONES.find(
    (item) => item.id === zona,
  );

  if (!zone) {
    return (
      <PageShell title="🏰 Fortaleza de la Evaluación">
        <p>No encontramos esta zona.</p>

        <Button asChild variant="link">
          <Link to="/fortaleza">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la fortaleza
          </Link>
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell title={zone.name}>
      <FortressChallenge zone={zone} />

      <div className="mt-6">
        <Button asChild variant="link">
          <Link to="/fortaleza">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la fortaleza
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}