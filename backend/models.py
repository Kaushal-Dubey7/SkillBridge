from pydantic import BaseModel
from typing import List, Optional
import uuid


class ExtractedSkill(BaseModel):
    skill_name: str
    raw_mention: str
    proficiency_level: str  # "none" | "beginner" | "intermediate" | "expert"
    years_experience: float = 0.0
    confidence: float = 0.0
    domain: str = "software_engineering"


class SkillGap(BaseModel):
    skill_name: str
    domain: str
    required_level: str
    current_level: str
    gap_severity: str  # "critical" | "moderate" | "minor"
    gap_score: float


class CourseModule(BaseModel):
    course_id: str
    title: str
    domain: str
    level: str
    duration_hours: int
    skill_tags: List[str]
    description: str
    addresses_gaps: List[str]
    priority_order: int
    prerequisites_met: bool


class ReasoningStep(BaseModel):
    step_number: int
    step_type: str  # "extraction" | "gap_analysis" | "course_selection" | "ordering"
    input_summary: str
    output_summary: str
    reasoning: str
    confidence: float


class AnalysisResponse(BaseModel):
    analysis_id: str = ""
    resume_skills: List[ExtractedSkill] = []
    jd_skills: List[ExtractedSkill] = []
    skill_gaps: List[SkillGap] = []
    pathway: List[CourseModule] = []
    reasoning_trace: List[ReasoningStep] = []
    total_duration_hours: int = 0
    estimated_weeks: float = 0.0
    coverage_score: float = 0.0
    cross_domain: bool = False

    @staticmethod
    def new_id() -> str:
        return f"sb-{uuid.uuid4().hex[:8]}"


class AnalyzeRequest(BaseModel):
    resume_text: Optional[str] = None
    job_description_text: Optional[str] = None
