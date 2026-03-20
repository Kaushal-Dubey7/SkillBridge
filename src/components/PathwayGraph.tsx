import { useMemo, useCallback, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import type { CourseModule } from "@/types";
import { ModuleCardNode } from "./ModuleCard";
import { DOMAIN_LABELS } from "@/types";
import { motion } from "framer-motion";

interface PathwayGraphProps {
  pathway: CourseModule[];
  excludedCourses: Set<string>;
  onToggleCourse: (id: string) => void;
}

const nodeTypes = { moduleCard: ModuleCardNode };

const DOMAIN_HEX: Record<string, string> = {
  software_engineering: "#3b82f6",
  data_science: "#a855f7",
  product_management: "#22c55e",
  design_ux: "#f59e0b",
  operations_logistics: "#ef4444",
  finance_accounting: "#14b8a6",
};

export function PathwayGraph({ pathway, excludedCourses, onToggleCourse }: PathwayGraphProps) {
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = pathway.map((course, i) => ({
      id: course.course_id,
      type: "moduleCard",
      position: {
        x: (i % 2) * 280 + 20,
        y: Math.floor(i / 2) * 220 + 20,
      },
      data: {
        ...course,
        excluded: excludedCourses.has(course.course_id),
        onToggle: onToggleCourse,
      },
    }));

    const edges: Edge[] = [];
    for (let i = 1; i < pathway.length; i++) {
      edges.push({
        id: `e-${pathway[i - 1].course_id}-${pathway[i].course_id}`,
        source: pathway[i - 1].course_id,
        target: pathway[i].course_id,
        type: "smoothstep",
        animated: true,
        style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
      });
    }

    return { initialNodes: nodes, initialEdges: edges };
  }, [pathway, excludedCourses, onToggleCourse]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when pathway/excluded changes
  useMemo(() => {
    // nodes are derived from initialNodes via useNodesState
  }, [initialNodes]);

  const legendDomains = useMemo(() => {
    const seen = new Set<string>();
    pathway.forEach((c) => seen.add(c.domain));
    return Array.from(seen);
  }, [pathway]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Your Learning Roadmap
      </h2>
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden" style={{ height: "600px" }}>
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          minZoom={0.3}
          maxZoom={1.5}
          attributionPosition="bottom-left"
          proOptions={{ hideAttribution: true }}
        >
          <Controls className="!bg-card !border-border !shadow-sm" />
          <Background color="hsl(var(--border))" gap={20} size={1} />
        </ReactFlow>
      </div>

      {/* Legend */}
      <div className="absolute top-10 right-3 rounded-lg border border-border bg-card/95 backdrop-blur-sm p-3 shadow-sm z-10">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Legend
        </p>
        <div className="space-y-1.5">
          {legendDomains.map((d) => (
            <div key={d} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: DOMAIN_HEX[d] || "#888" }}
              />
              <span className="text-[10px] text-muted-foreground">
                {DOMAIN_LABELS[d] || d}
              </span>
            </div>
          ))}
          <div className="border-t border-border pt-1.5 mt-1.5 flex items-center gap-2">
            <span className="h-0.5 w-2.5 bg-gap-critical rounded" />
            <span className="text-[10px] text-muted-foreground">Critical gap</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
