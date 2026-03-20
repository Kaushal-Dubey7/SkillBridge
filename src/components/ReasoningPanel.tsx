import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ReasoningStep } from "@/types";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import type { AnalysisResponse } from "@/types";

interface ReasoningPanelProps {
  steps: ReasoningStep[];
  totalHours: number;
  estimatedWeeks: number;
  coverageScore: number;
  result: AnalysisResponse;
}

const STEP_ICONS: Record<string, string> = {
  extraction: "📄",
  gap_analysis: "🔍",
  course_selection: "📚",
  ordering: "🗺️",
};

const STEP_LABELS: Record<string, string> = {
  extraction: "Skill Extraction",
  gap_analysis: "Gap Analysis",
  course_selection: "Course Selection",
  ordering: "Pathway Ordering",
};

function ConfidenceBadge({ value }: { value: number }) {
  const pct = (value * 100).toFixed(0);
  const color =
    value >= 0.85
      ? "bg-gap-minor/10 text-gap-minor"
      : value >= 0.7
      ? "bg-gap-moderate/10 text-gap-moderate"
      : "bg-gap-critical/10 text-gap-critical";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${color}`}>
      {pct}%
    </span>
  );
}

function downloadPDF(result: AnalysisResponse) {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text("SkillBridge — Learning Roadmap", 20, y);
  y += 12;

  doc.setFontSize(10);
  doc.text(`Analysis ID: ${result.analysis_id}`, 20, y);
  y += 6;
  doc.text(
    `Coverage: ${(result.coverage_score * 100).toFixed(0)}% | Duration: ${result.total_duration_hours}h | ~${result.estimated_weeks.toFixed(1)} weeks`,
    20,
    y
  );
  y += 12;

  doc.setFontSize(13);
  doc.text("Skill Gaps", 20, y);
  y += 8;
  doc.setFontSize(9);
  result.skill_gaps.forEach((gap) => {
    doc.text(
      `• ${gap.skill_name} (${gap.gap_severity}) — ${gap.current_level} → ${gap.required_level}`,
      24,
      y
    );
    y += 5;
    if (y > 270) { doc.addPage(); y = 20; }
  });
  y += 6;

  doc.setFontSize(13);
  doc.text("Learning Pathway", 20, y);
  y += 8;
  doc.setFontSize(9);
  result.pathway.forEach((course, i) => {
    doc.text(`${i + 1}. ${course.title} (${course.duration_hours}h, ${course.level})`, 24, y);
    y += 5;
    if (y > 270) { doc.addPage(); y = 20; }
    doc.text(`   Covers: ${course.addresses_gaps.join(", ")}`, 24, y);
    y += 6;
    if (y > 270) { doc.addPage(); y = 20; }
  });

  doc.save("skillbridge-roadmap.pdf");
}

export function ReasoningPanel({
  steps,
  totalHours,
  estimatedWeeks,
  coverageScore,
  result,
}: ReasoningPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-5"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        AI Reasoning Trace
      </h2>

      <Accordion type="multiple" defaultValue={["step-1"]} className="space-y-2">
        {steps.map((step) => (
          <AccordionItem
            key={step.step_number}
            value={`step-${step.step_number}`}
            className="rounded-lg border border-border bg-card px-4 shadow-sm"
          >
            <AccordionTrigger className="py-3 text-sm hover:no-underline">
              <div className="flex items-center gap-2 text-left">
                <span role="img" aria-hidden="true">
                  {STEP_ICONS[step.step_type]}
                </span>
                <span className="font-medium text-foreground">
                  {STEP_LABELS[step.step_type]}
                </span>
                <ConfidenceBadge value={step.confidence} />
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {step.reasoning}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Summary stats */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span>📊</span>
          <span>
            Estimated completion:{" "}
            <strong className="text-foreground">{estimatedWeeks.toFixed(1)} weeks</strong>{" "}
            <span className="text-muted-foreground">(10 hrs/week)</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>🎯</span>
          <span>
            Gap coverage:{" "}
            <strong className="text-gap-minor">
              {(coverageScore * 100).toFixed(0)}%
            </strong>{" "}
            of critical skills addressed
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full active:scale-[0.97] transition-transform"
        onClick={() => downloadPDF(result)}
        aria-label="Download roadmap as PDF"
      >
        <Download className="mr-2 h-4 w-4" />
        Download Roadmap (PDF)
      </Button>
    </motion.div>
  );
}
