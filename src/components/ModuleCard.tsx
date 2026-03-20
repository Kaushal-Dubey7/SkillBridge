import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { CourseModule } from "@/types";
import { DomainBadge } from "./DomainBadge";
import { Clock, ToggleLeft, ToggleRight } from "lucide-react";

interface ModuleNodeData extends CourseModule {
  excluded: boolean;
  onToggle: (id: string) => void;
}

export const ModuleCardNode = memo(function ModuleCardNode({
  data,
}: NodeProps<ModuleNodeData>) {
  const isCritical = data.addresses_gaps.length > 0;
  const borderColor = isCritical ? "border-l-gap-critical" : "border-l-primary";

  return (
    <div
      className={`w-[240px] rounded-lg border bg-card shadow-md transition-all ${
        data.excluded ? "opacity-40 border-border" : "border-border"
      } border-l-[3px] ${data.excluded ? "border-l-muted" : borderColor}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-primary !w-2 !h-2" />

      <div className="p-3">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <DomainBadge domain={data.domain} size="sm" />
          <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium capitalize text-secondary-foreground">
            {data.level}
          </span>
        </div>

        <h4 className="text-sm font-semibold text-foreground leading-tight mb-1">
          {data.title}
        </h4>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <Clock className="h-3 w-3" />
          <span>{data.duration_hours} hours</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {data.skill_tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {data.addresses_gaps.length > 0 && (
          <p className="text-[10px] text-muted-foreground">
            Covers: {data.addresses_gaps.join(", ")}
          </p>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onToggle(data.course_id);
          }}
          className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors active:scale-[0.97]"
          aria-label={data.excluded ? "Re-add this course" : "Mark as already known"}
        >
          {data.excluded ? (
            <ToggleLeft className="h-3 w-3" />
          ) : (
            <ToggleRight className="h-3 w-3" />
          )}
          {data.excluded ? "Re-add course" : "I already know this"}
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-2 !h-2" />
    </div>
  );
});
