type Confidence = "high" | "medium" | "low";

const CONFIG: Record<
  Confidence,
  { label: string; dot: string; bg: string; text: string }
> = {
  high: {
    label: "Sehr sicher",
    dot: "bg-signal-green",
    bg: "bg-signal-green-light",
    text: "text-signal-green",
  },
  medium: {
    label: "Mittlere Sicherheit",
    dot: "bg-signal-amber",
    bg: "bg-signal-amber-light",
    text: "text-signal-amber",
  },
  low: {
    label: "Unsicher",
    dot: "bg-signal-red",
    bg: "bg-signal-red-light",
    text: "text-signal-red",
  },
};

export default function TrustBadge({
  confidence,
  animate = false,
}: {
  confidence: Confidence;
  animate?: boolean;
}) {
  const c = CONFIG[confidence];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${c.bg} px-3 py-1 font-mono text-[11px] uppercase tracking-wide ${c.text}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${c.dot} ${animate ? "animate-stamp" : ""}`}
      />
      {c.label}
    </span>
  );
}

export type { Confidence };
