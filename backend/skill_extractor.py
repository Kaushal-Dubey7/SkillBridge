"""LLM-based skill extraction with taxonomy normalization."""

import json
import os
from typing import List

import numpy as np
from langchain_openai import ChatOpenAI
from sentence_transformers import SentenceTransformer

from models import ExtractedSkill
from skill_taxonomy import SKILL_TAXONOMY, get_all_skills, get_skill_domain

# Load sentence transformer once at module level
_embedder = SentenceTransformer("all-MiniLM-L6-v2")
_all_skills = get_all_skills()
_skill_embeddings = _embedder.encode(_all_skills, normalize_embeddings=True)

EXTRACTION_PROMPT = """You are an expert HR analyst and technical recruiter.
Extract ALL skills from the following {doc_type} document.

For each skill, identify:
1. The exact skill name as mentioned
2. The proficiency level (none/beginner/intermediate/expert) — infer from context clues like years of experience, phrases like "proficient in", "familiar with", "expert in", degree programs, certifications, or job titles
3. Approximate years of experience (0 if not stated)
4. Your confidence in this extraction (0.0-1.0)

OUTPUT FORMAT: Return ONLY a valid JSON array with no other text.
Each object must have keys: skill_name, proficiency_level, years_experience, confidence, raw_mention

DOCUMENT TEXT:
{text}"""


def _get_llm() -> ChatOpenAI:
    return ChatOpenAI(
        model="llama3-70b-8192",
        base_url="https://api.groq.com/openai/v1",
        api_key=os.getenv("GROQ_API_KEY", ""),
        temperature=0.1,
        max_tokens=4096,
    )


def _normalize_skill(skill_name: str) -> tuple[str, str, float]:
    """Map extracted skill to nearest taxonomy skill using cosine similarity.
    Returns (taxonomy_skill, domain, similarity_score)."""
    query_emb = _embedder.encode([skill_name], normalize_embeddings=True)
    similarities = np.dot(query_emb, _skill_embeddings.T)[0]
    best_idx = int(np.argmax(similarities))
    best_score = float(similarities[best_idx])
    best_skill = _all_skills[best_idx]
    domain = get_skill_domain(best_skill)
    return best_skill, domain, best_score


def extract_skills(text: str, doc_type: str = "resume") -> List[ExtractedSkill]:
    """Extract skills from document text using LLM + taxonomy normalization."""
    llm = _get_llm()
    prompt = EXTRACTION_PROMPT.format(doc_type=doc_type, text=text[:8000])

    response = llm.invoke(prompt)
    content = response.content.strip()

    # Parse JSON from LLM response
    if "```" in content:
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
    try:
        raw_skills = json.loads(content)
    except json.JSONDecodeError:
        return []

    # Normalize each skill against taxonomy
    extracted: List[ExtractedSkill] = []
    seen_skills = set()

    for raw in raw_skills:
        if not isinstance(raw, dict):
            continue
        skill_name = raw.get("skill_name", "")
        if not skill_name:
            continue

        taxonomy_skill, domain, similarity = _normalize_skill(skill_name)

        if similarity < 0.65:
            continue  # Skip unmapped skills
        if taxonomy_skill in seen_skills:
            continue
        seen_skills.add(taxonomy_skill)

        extracted.append(ExtractedSkill(
            skill_name=taxonomy_skill,
            raw_mention=raw.get("raw_mention", skill_name),
            proficiency_level=raw.get("proficiency_level", "beginner"),
            years_experience=float(raw.get("years_experience", 0)),
            confidence=float(raw.get("confidence", 0.5)) * similarity,
            domain=domain,
        ))

    return extracted
