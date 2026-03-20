"""Skill gap computation with level-difference scoring."""

from typing import List
from models import ExtractedSkill, SkillGap

LEVEL_MAP = {"none": 0, "beginner": 1, "intermediate": 2, "expert": 3}


def compute_gap(
    resume_skills: List[ExtractedSkill],
    jd_skills: List[ExtractedSkill],
) -> List[SkillGap]:
    """Compute the skill gap between resume skills and JD requirements."""
    resume_lookup = {s.skill_name: s for s in resume_skills}
    gaps: List[SkillGap] = []

    for jd_skill in jd_skills:
        resume_skill = resume_lookup.get(jd_skill.skill_name)
        jd_level = LEVEL_MAP.get(jd_skill.proficiency_level, 2)

        if resume_skill is None:
            current_level = "none"
            resume_level = 0
        else:
            current_level = resume_skill.proficiency_level
            resume_level = LEVEL_MAP.get(current_level, 0)

        gap_score = max(0, (jd_level - resume_level)) / 3.0

        if gap_score <= 0:
            continue  # No gap

        if gap_score >= 0.67:
            severity = "critical"
        elif gap_score >= 0.33:
            severity = "moderate"
        else:
            severity = "minor"

        gaps.append(SkillGap(
            skill_name=jd_skill.skill_name,
            domain=jd_skill.domain,
            required_level=jd_skill.proficiency_level,
            current_level=current_level,
            gap_severity=severity,
            gap_score=round(gap_score, 2),
        ))

    gaps.sort(key=lambda g: g.gap_score, reverse=True)
    return gaps
