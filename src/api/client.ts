import axios from "axios";
import type { AnalysisResponse } from "@/types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

export async function analyzeDocuments(
  resume: File | null,
  jobDescription: File | null,
  jobDescriptionText: string
): Promise<AnalysisResponse> {
  const formData = new FormData();
  if (resume) formData.append("resume", resume);
  if (jobDescription) formData.append("job_description", jobDescription);
  if (jobDescriptionText) formData.append("job_description_text", jobDescriptionText);

  const { data } = await api.post<AnalysisResponse>("/api/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function healthCheck() {
  const { data } = await api.get("/api/health");
  return data;
}

// ──────────────── MOCK DATA FOR DEMO ────────────────

export const MOCK_ANALYSIS: AnalysisResponse = {
  analysis_id: "demo-sb-001",
  resume_skills: [
    { skill_name: "Python", raw_mention: "3 years of Python development", proficiency_level: "intermediate", years_experience: 3, confidence: 0.93, domain: "software_engineering" },
    { skill_name: "JavaScript", raw_mention: "JavaScript and ES6+", proficiency_level: "intermediate", years_experience: 2.5, confidence: 0.89, domain: "software_engineering" },
    { skill_name: "React", raw_mention: "Built 4 React SPAs", proficiency_level: "intermediate", years_experience: 2, confidence: 0.87, domain: "software_engineering" },
    { skill_name: "SQL", raw_mention: "SQL queries and database design", proficiency_level: "beginner", years_experience: 1, confidence: 0.81, domain: "data_science" },
    { skill_name: "Git", raw_mention: "Git/GitHub daily workflow", proficiency_level: "intermediate", years_experience: 3, confidence: 0.92, domain: "software_engineering" },
    { skill_name: "Agile Methodologies", raw_mention: "Agile scrum team of 6", proficiency_level: "intermediate", years_experience: 2, confidence: 0.76, domain: "product_management" },
    { skill_name: "REST API Design", raw_mention: "designed REST APIs for microservices", proficiency_level: "intermediate", years_experience: 2, confidence: 0.84, domain: "software_engineering" },
    { skill_name: "Data Structures", raw_mention: "algorithms and data structures", proficiency_level: "intermediate", years_experience: 2, confidence: 0.79, domain: "software_engineering" },
    { skill_name: "CSS", raw_mention: "CSS3 and responsive design", proficiency_level: "intermediate", years_experience: 2, confidence: 0.82, domain: "design_ux" },
    { skill_name: "Unit Testing", raw_mention: "unit tests with pytest", proficiency_level: "beginner", years_experience: 1, confidence: 0.71, domain: "software_engineering" },
  ],
  jd_skills: [
    { skill_name: "Python", raw_mention: "Expert-level Python required", proficiency_level: "expert", years_experience: 5, confidence: 0.95, domain: "software_engineering" },
    { skill_name: "TypeScript", raw_mention: "TypeScript for all frontend work", proficiency_level: "intermediate", years_experience: 2, confidence: 0.91, domain: "software_engineering" },
    { skill_name: "React", raw_mention: "Senior React developer", proficiency_level: "expert", years_experience: 4, confidence: 0.93, domain: "software_engineering" },
    { skill_name: "Node.js", raw_mention: "Node.js backend services", proficiency_level: "intermediate", years_experience: 2, confidence: 0.90, domain: "software_engineering" },
    { skill_name: "PostgreSQL", raw_mention: "PostgreSQL database administration", proficiency_level: "intermediate", years_experience: 2, confidence: 0.88, domain: "data_science" },
    { skill_name: "Docker", raw_mention: "Docker containerization required", proficiency_level: "intermediate", years_experience: 1, confidence: 0.92, domain: "operations_logistics" },
    { skill_name: "CI/CD Pipelines", raw_mention: "CI/CD pipeline management", proficiency_level: "intermediate", years_experience: 1, confidence: 0.85, domain: "operations_logistics" },
    { skill_name: "System Design", raw_mention: "system design interviews", proficiency_level: "intermediate", years_experience: 2, confidence: 0.80, domain: "software_engineering" },
    { skill_name: "Cloud Computing (AWS)", raw_mention: "AWS services (EC2, S3, Lambda)", proficiency_level: "beginner", years_experience: 1, confidence: 0.78, domain: "software_engineering" },
    { skill_name: "Agile Methodologies", raw_mention: "Agile environment", proficiency_level: "intermediate", years_experience: 2, confidence: 0.75, domain: "product_management" },
  ],
  skill_gaps: [
    { skill_name: "TypeScript", domain: "software_engineering", required_level: "intermediate", current_level: "none", gap_severity: "critical", gap_score: 0.67 },
    { skill_name: "Node.js", domain: "software_engineering", required_level: "intermediate", current_level: "none", gap_severity: "critical", gap_score: 0.67 },
    { skill_name: "Docker", domain: "operations_logistics", required_level: "intermediate", current_level: "none", gap_severity: "critical", gap_score: 0.67 },
    { skill_name: "CI/CD Pipelines", domain: "operations_logistics", required_level: "intermediate", current_level: "none", gap_severity: "critical", gap_score: 0.67 },
    { skill_name: "System Design", domain: "software_engineering", required_level: "intermediate", current_level: "none", gap_severity: "critical", gap_score: 0.67 },
    { skill_name: "Cloud Computing (AWS)", domain: "software_engineering", required_level: "beginner", current_level: "none", gap_severity: "moderate", gap_score: 0.33 },
    { skill_name: "PostgreSQL", domain: "data_science", required_level: "intermediate", current_level: "beginner", gap_severity: "moderate", gap_score: 0.33 },
    { skill_name: "React", domain: "software_engineering", required_level: "expert", current_level: "intermediate", gap_severity: "moderate", gap_score: 0.33 },
  ],
  pathway: [
    {
      course_id: "SE-TS1",
      title: "TypeScript Essentials",
      domain: "software_engineering",
      level: "beginner",
      duration_hours: 10,
      skill_tags: ["TypeScript", "type systems", "JavaScript"],
      description: "Master TypeScript fundamentals: types, interfaces, generics, and integration with modern frameworks.",
      addresses_gaps: ["TypeScript"],
      priority_order: 1,
      prerequisites_met: true,
    },
    {
      course_id: "SE-ND1",
      title: "Node.js Backend Development",
      domain: "software_engineering",
      level: "intermediate",
      duration_hours: 14,
      skill_tags: ["Node.js", "Express", "REST APIs", "server-side JavaScript"],
      description: "Build scalable server-side applications with Node.js, Express, and modern async patterns.",
      addresses_gaps: ["Node.js"],
      priority_order: 2,
      prerequisites_met: true,
    },
    {
      course_id: "DS-PG1",
      title: "PostgreSQL Deep Dive",
      domain: "data_science",
      level: "intermediate",
      duration_hours: 10,
      skill_tags: ["PostgreSQL", "database design", "SQL optimization", "indexing"],
      description: "Advanced PostgreSQL: query optimization, indexing strategies, and production database management.",
      addresses_gaps: ["PostgreSQL"],
      priority_order: 3,
      prerequisites_met: true,
    },
    {
      course_id: "SE-SD1",
      title: "System Design Fundamentals",
      domain: "software_engineering",
      level: "intermediate",
      duration_hours: 12,
      skill_tags: ["system design", "scalability", "distributed systems", "architecture"],
      description: "Design large-scale systems: load balancing, caching, database sharding, and microservices architecture.",
      addresses_gaps: ["System Design"],
      priority_order: 4,
      prerequisites_met: true,
    },
    {
      course_id: "OPS-DK1",
      title: "Docker & Containerization",
      domain: "operations_logistics",
      level: "beginner",
      duration_hours: 8,
      skill_tags: ["Docker", "containers", "Docker Compose", "image building"],
      description: "Containerize applications with Docker: images, volumes, networks, and multi-container orchestration.",
      addresses_gaps: ["Docker"],
      priority_order: 5,
      prerequisites_met: true,
    },
    {
      course_id: "OPS-CI1",
      title: "CI/CD Pipeline Engineering",
      domain: "operations_logistics",
      level: "intermediate",
      duration_hours: 10,
      skill_tags: ["CI/CD", "GitHub Actions", "automated testing", "deployment"],
      description: "Design and implement CI/CD pipelines with GitHub Actions, automated testing, and blue-green deployments.",
      addresses_gaps: ["CI/CD Pipelines"],
      priority_order: 6,
      prerequisites_met: true,
    },
    {
      course_id: "SE-CL1",
      title: "AWS Cloud Practitioner Path",
      domain: "software_engineering",
      level: "beginner",
      duration_hours: 12,
      skill_tags: ["AWS", "cloud computing", "EC2", "S3", "Lambda"],
      description: "Core AWS services: compute, storage, networking, and serverless with hands-on labs.",
      addresses_gaps: ["Cloud Computing (AWS)"],
      priority_order: 7,
      prerequisites_met: true,
    },
    {
      course_id: "SE-RC2",
      title: "Advanced React Patterns",
      domain: "software_engineering",
      level: "advanced",
      duration_hours: 10,
      skill_tags: ["React", "performance optimization", "advanced patterns", "state management"],
      description: "Master advanced React: render optimization, compound components, suspense, and concurrent features.",
      addresses_gaps: ["React"],
      priority_order: 8,
      prerequisites_met: true,
    },
  ],
  reasoning_trace: [
    {
      step_number: 1,
      step_type: "extraction",
      input_summary: "Resume PDF (2 pages) and Full-Stack Developer job description",
      output_summary: "10 resume skills, 10 JD skills identified across 4 domains",
      reasoning: "Identified 10 skills from the resume across software engineering, data science, product management, and design domains. Top skills: Python (3 yrs, intermediate), JavaScript (2.5 yrs), React (2 yrs). Found 10 required skills in the job description. Used sentence-transformer embeddings to normalize all skills against the O*NET-inspired taxonomy of 120+ skills.",
      confidence: 0.89,
    },
    {
      step_number: 2,
      step_type: "gap_analysis",
      input_summary: "10 resume skills vs 10 JD skills",
      output_summary: "8 skill gaps: 5 critical, 3 moderate",
      reasoning: "Detected 8 skill gaps between the resume and job requirements. Critical gaps: TypeScript, Node.js, Docker, CI/CD Pipelines, System Design — these skills are completely absent from the resume but required at intermediate level. Moderate gaps: AWS (not mentioned), PostgreSQL (beginner vs intermediate needed), React (intermediate vs expert needed). The candidate is strongest in core programming but lacks DevOps and system-level skills.",
      confidence: 0.91,
    },
    {
      step_number: 3,
      step_type: "course_selection",
      input_summary: "8 skill gaps against 62-course catalog",
      output_summary: "8 courses selected with 94% critical gap coverage",
      reasoning: "Filtered the 62-course catalog to 14 candidates with embedding similarity > 0.60 to the identified gaps. Scored each course on relevance (cosine similarity to gap skills) and multi-gap coverage (courses addressing multiple gaps scored higher). Added diversity bonus of 0.15 to operations_logistics courses since the candidate had no coverage in that domain. Selected 8 courses that maximize gap coverage while maintaining prerequisite integrity.",
      confidence: 0.87,
    },
    {
      step_number: 4,
      step_type: "ordering",
      input_summary: "8 selected courses with prerequisite dependencies",
      output_summary: "Ordered pathway: 86 hours over ~8.6 weeks",
      reasoning: "Applied topological sort on the course prerequisite graph. TypeScript placed first as it enables the Node.js course. PostgreSQL follows to support system design concepts. Docker precedes CI/CD as containerization is a prerequisite. Cloud computing comes after Docker for deployment context. Advanced React placed last as it builds on all prior web development modules. Final pathway of 8 courses covers 94% of critical gaps in approximately 8.6 weeks at 10 hours/week.",
      confidence: 0.92,
    },
  ],
  total_duration_hours: 86,
  estimated_weeks: 8.6,
  coverage_score: 0.94,
  cross_domain: true,
};
