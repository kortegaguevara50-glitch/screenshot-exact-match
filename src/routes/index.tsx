import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-quest.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Proyecto Quest — Aventura para aprender proyectos" },
      {
        name: "description",
        content:
          "Videojuego educativo de Administración y Evaluación de Proyectos e Innovación Tecnológica.",
      },
      { property: "og:title", content: "Proyecto Quest" },
      {
        property: "og:description",
        content:
          "Explora mundos y supera desafíos sobre proyectos e innovación.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <img
        src={hero}
        alt="Explorador observando los cuatro mundos"
        width={1600}
        height={912}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-hero-overlay" />

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-end px-6 pb-20 text-center">
        <p className="rounded-full bg-gold-gradient px-4 py-1 text-sm font-bold text-gold-foreground">
          Aventura educativa
        </p>

        <h1 className="mt-4 text-5xl font-bold text-primary-foreground md:text-7xl">
          Proyecto Quest
        </h1>

        <p className="mt-4 max-w-xl text-lg text-primary-foreground/90">
          Recorre cuatro mundos y domina la Administración y Evaluación de
          Proyectos e Innovación Tecnológica.
        </p>

        <Link
          to="/mapa"
          className="mt-8 rounded-full bg-gold-gradient px-10 py-4 text-lg font-bold text-gold-foreground shadow-quest transition hover:scale-105"
        >
          ⚔️ Comenzar aventura
        </Link>
      </div>
    </div>
  );
}
