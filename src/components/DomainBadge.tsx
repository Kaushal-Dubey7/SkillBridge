import { DOMAIN_LABELS, DOMAIN_BG_CLASSES } from "@/types";

interface DomainBadgeProps {
  domain: string;
  size?: "sm" | "md";
}

export function DomainBadge({ domain, size = "sm" }: DomainBadgeProps) {
  const bgClass = DOMAIN_BG_CLASSES[domain] || "bg-muted";
  const label = DOMAIN_LABELS[domain] || domain;
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium text-white ${bgClass} ${sizeClass}`}
      aria-label={`Domain: ${label}`}
    >
      {label}
    </span>
  );
}
