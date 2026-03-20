"""FastAPI application — SkillBridge AI-Adaptive Onboarding Engine."""

import os
import uuid
from typing import Optional

import fitz  # PyMuPDF
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import AnalysisResponse
from skill_extractor import extract_skills
from gap_analyzer import compute_gap
from pathway_generator import generate_pathway, validate_pathway
from reasoning_tracer import generate_trace
from course_catalog import COURSE_CATALOG, get_catalog_size

load_dotenv()

app = FastAPI(title="SkillBridge API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_pdf_text(file_bytes: bytes) -> str:
    """Extract text from PDF using PyMuPDF."""
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    if len(text.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="This PDF appears to be scanned. Please upload a text-based PDF or paste the job description.",
        )
    return text


@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "model": "llama3-70b",
        "catalog_size": get_catalog_size(),
    }


@app.get("/api/catalog")
async def catalog():
    return COURSE_CATALOG


@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze(
    resume: Optional[UploadFile] = File(None),
    job_description: Optional[UploadFile] = File(None),
    job_description_text: Optional[str] = Form(None),
):
    # 1. Extract text
    if resume is None:
        raise HTTPException(status_code=400, detail="Resume file is required.")

    resume_text = extract_pdf_text(await resume.read())

    jd_text = ""
    if job_description:
        jd_text = extract_pdf_text(await job_description.read())
    elif job_description_text:
        jd_text = job_description_text
    else:
        raise HTTPException(status_code=400, detail="Job description is required (file or text).")

    # 2. Extract skills
    resume_skills = extract_skills(resume_text, doc_type="resume")
    jd_skills = extract_skills(jd_text, doc_type="job description")

    if len(resume_skills) < 3:
        raise HTTPException(
            status_code=422,
            detail="We couldn't find enough skills to analyze. Try uploading a more detailed resume.",
        )

    # 3. Compute gaps
    skill_gaps = compute_gap(resume_skills, jd_skills)

    # 4. Generate pathway
    pathway = generate_pathway(skill_gaps)

    # 5. Validate (anti-hallucination)
    if not validate_pathway(pathway, skill_gaps):
        # Retry with stricter constraints — re-run
        pathway = generate_pathway(skill_gaps)

    # 6. Generate reasoning trace
    resume_domains = list(set(s.domain for s in resume_skills))
    reasoning_trace = generate_trace(
        skill_gaps=skill_gaps,
        pathway=pathway,
        resume_skill_count=len(resume_skills),
        jd_skill_count=len(jd_skills),
        resume_domains=resume_domains,
    )

    # 7. Compute summary stats
    total_hours = sum(c.duration_hours for c in pathway)
    critical_gaps = {g.skill_name for g in skill_gaps if g.gap_severity == "critical"}
    covered = set()
    for c in pathway:
        covered.update(c.addresses_gaps)
    coverage = len(critical_gaps & covered) / max(len(critical_gaps), 1)
    cross_domain = len(set(c.domain for c in pathway)) > 1

    return AnalysisResponse(
        analysis_id=f"sb-{uuid.uuid4().hex[:8]}",
        resume_skills=resume_skills,
        jd_skills=jd_skills,
        skill_gaps=skill_gaps,
        pathway=pathway,
        reasoning_trace=reasoning_trace,
        total_duration_hours=total_hours,
        estimated_weeks=round(total_hours / 10, 1),
        coverage_score=round(coverage, 2),
        cross_domain=cross_domain,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
