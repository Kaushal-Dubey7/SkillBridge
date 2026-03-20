interface ProgressBarProps {
  level: string;
  label?: string;
  showLabel?: boolean;
}

const LEVEL_MAP: Record<string, number> = {
  none: 0,
  beginner: 1,
  intermediate: 2,
  expert: 3,
};

const LEVEL_ICONS: Record<string, string> = {
  none: "✕",
  beginner: "○",
  intermediate: "◐",
  expert: "●",
};

export function ProgressBar({ level, label, showLabel = true }: ProgressBarProps) {
  const numericLevel = LEVEL_MAP[level] ?? 0;
  const pct = (numericLevel / 3) * 100;
  const icon = LEVEL_ICONS[level] ?? "✕";

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5" aria-label={`Proficiency: ${level}`}>
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={`text-sm ${i <= numericLevel ? "text-primary" : "text-muted-foreground/30"}`}
          >
            {i <= numericLevel ? "●" : "○"}
          </span>
        ))}
      </div>
      {showLabel && (
        <span className="text-xs capitalize text-muted-foreground">{label || level}</span>
      )}
    </div>
  );
}

export function ProficiencyDot({ level }: { level: string }) {
  const icon = LEVEL_ICONS[level] ?? "✕";
  return (
    <span className="text-sm text-foreground" aria-label={level}>
      {icon}
    </span>
  );
}
