import { motion } from "framer-motion";
import type { SkillGap, ExtractedSkill } from "@/types";
import { DomainBadge } from "./DomainBadge";
import { DOMAIN_LABELS } from "@/types";

interface SkillGapMatrixProps {
  gaps: SkillGap[];
  resumeSkills: ExtractedSkill[];
  jdSkills: ExtractedSkill[];
  coverageScore: number;
  totalHours: number;
  estimatedWeeks: number;
}

function ConfidenceDot({ confidence }: { confidence: number }) {
  const color =
    confidence >= 0.85
      ? "bg-gap-minor"
      : confidence >= 0.7
      ? "bg-gap-moderate"
      : "bg-gap-critical";
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${color}`}
      title={`Confidence: ${(confidence * 100).toFixed(0)}%`}
      aria-label={`Confidence ${(confidence * 100).toFixed(0)}%`}
    />
  );
}

function LevelDots({ level }: { level: string }) {
  const map: Record<string, string> = {
    none: "✕",
    beginner: "○",
    intermediate: "◐",
    expert: "●",
  };
  return <span className="font-mono text-sm">{map[level] ?? "✕"}</span>;
}

export function SkillGapMatrix({
  gaps,
  resumeSkills,
  jdSkills,
  coverageScore,
  totalHours,
  estimatedWeeks,
}: SkillGapMatrixProps) {
  const critical = gaps.filter((g) => g.gap_severity === "critical").length;
  const moderate = gaps.filter((g) => g.gap_severity === "moderate").length;
  const minor = gaps.filter((g) => g.gap_severity === "minor").length;

  const domainCounts: Record<string, number> = {};
  gaps.forEach((g) => {
    domainCounts[g.domain] = (domainCounts[g.domain] || 0) + 1;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Summary card */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Skill Gap Summary
        </h2>
        <p className="text-2xl font-bold text-foreground mb-1">{gaps.length} gaps found</p>
        <div className="flex flex-wrap gap-3 mt-3 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gap-critical" />
            {critical} critical
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gap-moderate" />
            {moderate} moderate
          </span>
          {minor > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-gap-minor" />
              {minor} minor
            </span>
          )}
        </div>

        {/* Domain bars */}
        <div className="mt-5 space-y-2">
          {Object.entries(domainCounts).map(([domain, count]) => (
            <div key={domain} className="flex items-center gap-2 text-xs">
              <span className="w-24 truncate text-muted-foreground">
                {DOMAIN_LABELS[domain] || domain}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(count / gaps.length) * 100}%` }}
                />
              </div>
              <span className="text-muted-foreground tabular-nums w-8 text-right">
                {((count / gaps.length) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-border flex flex-wrap gap-4 text-sm">
          <span>
            Coverage:{" "}
            <strong className="text-gap-minor">{(coverageScore * 100).toFixed(0)}%</strong>
          </span>
          <span>
            Duration: <strong>{totalHours}h</strong>
          </span>
          <span>
            ~<strong>{estimatedWeeks.toFixed(1)}</strong> weeks
          </span>
        </div>
      </div>

      {/* Gap table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm" aria-label="Skill gap details">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Skill
              </th>
              <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                You
              </th>
              <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Need
              </th>
              <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Gap
              </th>
            </tr>
          </thead>
          <tbody>
            {gaps.map((gap, i) => (
              <motion.tr
                key={gap.skill_name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`border-b border-border/50 last:border-0 ${
                  gap.gap_severity === "critical"
                    ? "bg-gap-critical/[0.03]"
                    : gap.gap_severity === "moderate"
                    ? "bg-gap-moderate/[0.03]"
                    : ""
                }`}
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{gap.skill_name}</span>
                    <DomainBadge domain={gap.domain} size="sm" />
                  </div>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <LevelDots level={gap.current_level} />
                </td>
                <td className="px-3 py-2.5 text-center">
                  <LevelDots level={gap.required_level} />
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      gap.gap_severity === "critical"
                        ? "bg-gap-critical/10 text-gap-critical"
                        : gap.gap_severity === "moderate"
                        ? "bg-gap-moderate/10 text-gap-moderate"
                        : "bg-gap-minor/10 text-gap-minor"
                    }`}
                  >
                    {gap.gap_severity}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
