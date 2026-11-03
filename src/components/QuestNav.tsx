import { Link } from "@tanstack/react-router";
import { useProgress } from "@/game/progress";

const LINKS = [
  { to: "/mapa", label: "Mapa", icon: "🗺️" },
  { to: "/misiones", label: "Misiones", icon: "⚔️" },
  { to: "/glosario", label: "Glosario", icon: "📜" },
  { to: "/insignias", label: "Insignias", icon: "🏅" },
  { to: "/progreso", label: "Progreso", icon: "⭐" },
] as const;

export function QuestNav() {
  const p = useProgress();
  return (
    <header className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="font-display text-lg font-bold text-primary">Proyecto Quest</Link>
        <span className="rounded-full bg-gold-gradient px-3 py-1 text-sm font-bold text-gold-foreground shadow-quest">⭐ {p.xp} XP</span>
      </div>
      <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 pb-2">
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:bg-muted"
            activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary" }}
          >
            {l.icon} {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function PageShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <>
      <QuestNav />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold text-primary md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </main>
    </>
  );
}
