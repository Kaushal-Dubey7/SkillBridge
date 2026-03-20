"""Adaptive pathfinding algorithm for personalized learning pathways."""

from typing import List, Dict, Set
from collections import defaultdict, deque

import numpy as np
from sentence_transformers import SentenceTransformer

from models import SkillGap, CourseModule
from course_catalog import COURSE_CATALOG, get_catalog_dict

_embedder = SentenceTransformer("all-MiniLM-L6-v2")
MAX_PATHWAY_COURSES = 12


def _embed(texts: List[str]) -> np.ndarray:
    return _embedder.encode(texts, normalize_embeddings=True)


def generate_pathway(skill_gaps: List[SkillGap]) -> List[CourseModule]:
    """Generate an ordered, prerequisite-aware learning pathway."""
    if not skill_gaps:
        return []

    catalog = get_catalog_dict()
    gap_names = [g.skill_name for g in skill_gaps]
    gap_embeddings = _embed(gap_names)
    critical_gaps = {g.skill_name for g in skill_gaps if g.gap_severity == "critical"}

    # Step 1 — Gap-to-course mapping via embedding similarity
    course_scores: Dict[str, dict] = {}

    for cid, course in catalog.items():
        tag_embeddings = _embed(course["skill_tags"])
        # Max similarity between each gap and any course tag
        sim_matrix = np.dot(gap_embeddings, tag_embeddings.T)  # (gaps x tags)
        max_sims = sim_matrix.max(axis=1)  # Best match per gap

        relevant_gaps = []
        total_sim = 0.0
        for i, sim in enumerate(max_sims):
            if sim > 0.60:
                relevant_gaps.append(gap_names[i])
                total_sim += sim

        if not relevant_gaps:
            continue

        # Step 2 — Course scoring
        relevance = total_sim / len(relevant_gaps) if relevant_gaps else 0
        critical_covered = len([g for g in relevant_gaps if g in critical_gaps])
        coverage = critical_covered / max(len(critical_gaps), 1)
        composite = 0.5 * relevance + 0.5 * coverage

        course_scores[cid] = {
            "composite": composite,
            "relevant_gaps": relevant_gaps,
            "domain": course["domain"],
        }

    # Diversity bonus
    domains_seen: Set[str] = set()
    for cid in sorted(course_scores, key=lambda k: course_scores[k]["composite"], reverse=True):
        domain = course_scores[cid]["domain"]
        if domain not in domains_seen:
            course_scores[cid]["composite"] += 0.15
        domains_seen.add(domain)

    # Select top courses
    ranked = sorted(course_scores.keys(), key=lambda k: course_scores[k]["composite"], reverse=True)
    selected_ids = ranked[:MAX_PATHWAY_COURSES]

    # Step 3 — Prerequisite-aware topological sort (Kahn's algorithm)
    prereq_graph: Dict[str, List[str]] = defaultdict(list)
    in_degree: Dict[str, int] = {cid: 0 for cid in selected_ids}
    selected_set = set(selected_ids)

    for cid in selected_ids:
        course = catalog[cid]
        for prereq in course.get("prerequisites", []):
            if prereq in selected_set:
                prereq_graph[prereq].append(cid)
                in_degree[cid] = in_degree.get(cid, 0) + 1

    # Kahn's
    queue = deque()
    for cid in selected_ids:
        if in_degree.get(cid, 0) == 0:
            queue.append(cid)

    ordered: List[str] = []
    while queue:
        # Sort within same level by gap severity
        level_nodes = sorted(queue, key=lambda c: -course_scores.get(c, {}).get("composite", 0))
        queue.clear()
        for node in level_nodes:
            ordered.append(node)
            for neighbor in prereq_graph.get(node, []):
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

    # Add any remaining (cycle handling)
    for cid in selected_ids:
        if cid not in ordered:
            ordered.append(cid)

    # Step 4 — Ensure beginner before advanced
    beginners = [c for c in ordered if catalog[c]["level"] == "beginner"]
    advanced = [c for c in ordered if catalog[c]["level"] == "advanced"]
    if advanced and not beginners:
        pass  # No beginner courses available
    elif advanced and beginners:
        first_advanced_idx = ordered.index(advanced[0])
        first_beginner_idx = ordered.index(beginners[0])
        if first_beginner_idx > first_advanced_idx:
            ordered.remove(beginners[0])
            ordered.insert(first_advanced_idx, beginners[0])

    # Step 5 — Build CourseModule objects
    completed_ids: Set[str] = set()
    pathway: List[CourseModule] = []

    for i, cid in enumerate(ordered):
        course = catalog[cid]
        prereqs_met = all(p in completed_ids for p in course.get("prerequisites", []))
        completed_ids.add(cid)

        pathway.append(CourseModule(
            course_id=cid,
            title=course["title"],
            domain=course["domain"],
            level=course["level"],
            duration_hours=course["duration_hours"],
            skill_tags=course["skill_tags"],
            description=course["description"],
            addresses_gaps=course_scores.get(cid, {}).get("relevant_gaps", []),
            priority_order=i + 1,
            prerequisites_met=prereqs_met,
        ))

    return pathway


def validate_pathway(pathway: List[CourseModule], skill_gaps: List[SkillGap]) -> bool:
    """Validate pathway against anti-hallucination rules."""
    catalog = get_catalog_dict()
    seen_ids = set()

    for course in pathway:
        # Rule 1: course_id must exist
        if course.course_id not in catalog:
            return False
        # No duplicates
        if course.course_id in seen_ids:
            return False
        seen_ids.add(course.course_id)

    # At least 1 course per critical gap
    critical_gaps = {g.skill_name for g in skill_gaps if g.gap_severity == "critical"}
    covered_gaps = set()
    for course in pathway:
        covered_gaps.update(course.addresses_gaps)

    uncovered_critical = critical_gaps - covered_gaps
    return len(uncovered_critical) == 0
