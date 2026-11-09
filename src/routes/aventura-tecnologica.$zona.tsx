import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/QuestNav";
import { TechnologyChallenge } from "@/components/TechnologyChallenge";import {
  TECHNOLOGY_ZONES,
} from "@/game/technology-adventure";

export const Route = createFileRoute("/aventura-tecnologica/$zona")({
  component: TechnologyAdventurePage,
});

function TechnologyAdventurePage() {
  const { zona } = Route.useParams();

  const zone = TECHNOLOGY_ZONES.find(
    (item) => item.id === zona,
  );

  if (!zone) {
    return (
      <PageShell title="🏙️ Ciudad Tecnológica">
        <p>No encontramos esta zona.</p>

        <Button asChild variant="link">
          <Link to="/ciudad">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la ciudad
          </Link>
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell title={zone.name}>
      <TechnologyChallenge zone={zone} />

      <div className="mt-6">
        <Button asChild variant="link">
          <Link to="/ciudad">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la ciudad
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
