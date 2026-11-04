import explorer from "@/assets/explorer-guide.png";

export function QuestGuide({ message, celebrate = false }: { message: string; celebrate?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <img src={explorer} width={816} height={816} loading="lazy" alt="Guía explorador saludando con su mapa" className={`h-28 w-24 shrink-0 object-contain ${celebrate ? "quest-reward" : ""}`} />
      <p className="max-w-sm text-lg font-extrabold text-primary">{message}</p>
    </div>
  );
}

export function RewardStars() {
  return <div aria-hidden="true" className="quest-stars pointer-events-none absolute inset-x-0 top-0 flex justify-around text-2xl text-gold"><span>✦</span><span>★</span><span>✧</span><span>★</span><span>✦</span></div>;
}