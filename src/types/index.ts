export interface ExtractedSkill {
  skill_name: string;
  raw_mention: string;
  proficiency_level: "none" | "beginner" | "intermediate" | "expert";
  years_experience: number;
  confidence: number;
  domain: string;
}

export interface SkillGap {
  skill_name: string;
  domain: string;
  required_level: string;
  current_level: string;
  gap_severity: "critical" | "moderate" | "minor";
  gap_score: number;
}

export interface CourseModule {
  course_id: string;
  title: string;
  domain: string;
  level: "beginner" | "intermediate" | "advanced";
  duration_hours: number;
  skill_tags: string[];
  description: string;
  addresses_gaps: string[];
  priority_order: number;
  prerequisites_met: boolean;
}

export interface ReasoningStep {
  step_number: number;
  step_type: "extraction" | "gap_analysis" | "course_selection" | "ordering";
  input_summary: string;
  output_summary: string;
  reasoning: string;
  confidence: number;
}

export interface AnalysisResponse {
  analysis_id: string;
  resume_skills: ExtractedSkill[];
  jd_skills: ExtractedSkill[];
  skill_gaps: SkillGap[];
  pathway: CourseModule[];
  reasoning_trace: ReasoningStep[];
  total_duration_hours: number;
  estimated_weeks: number;
  coverage_score: number;
  cross_domain: boolean;
}

export type AnalysisStage = "upload" | "loading" | "results";

export type DomainKey =
  | "software_engineering"
  | "data_science"
  | "product_management"
  | "design_ux"
  | "operations_logistics"
  | "finance_accounting";

export const DOMAIN_LABELS: Record<string, string> = {
  software_engineering: "Software Engineering",
  data_science: "Data Science",
  product_management: "Product Management",
  design_ux: "Design & UX",
  operations_logistics: "Operations",
  finance_accounting: "Finance",
};

export const DOMAIN_COLORS: Record<string, string> = {
  software_engineering: "var(--domain-software)",
  data_science: "var(--domain-data)",
  product_management: "var(--domain-product)",
  design_ux: "var(--domain-design)",
  operations_logistics: "var(--domain-operations)",
  finance_accounting: "var(--domain-finance)",
};

export const DOMAIN_BG_CLASSES: Record<string, string> = {
  software_engineering: "bg-domain-software",
  data_science: "bg-domain-data",
  product_management: "bg-domain-product",
  design_ux: "bg-domain-design",
  operations_logistics: "bg-domain-operations",
  finance_accounting: "bg-domain-finance",
};

export const DOMAIN_TEXT_CLASSES: Record<string, string> = {
  software_engineering: "text-domain-software",
  data_science: "text-domain-data",
  product_management: "text-domain-product",
  design_ux: "text-domain-design",
  operations_logistics: "text-domain-operations",
  finance_accounting: "text-domain-finance",
};
