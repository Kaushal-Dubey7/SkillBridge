import { useState, useCallback } from "react";
import type { AnalysisResponse, AnalysisStage } from "@/types";
import { analyzeDocuments, MOCK_ANALYSIS } from "@/api/client";

export function useAnalysis() {
  const [stage, setStage] = useState<AnalysisStage>("upload");
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [excludedCourses, setExcludedCourses] = useState<Set<string>>(new Set());

  const runLoadingSequence = useCallback(() => {
    setLoadingStep(0);
    const steps = [0, 1, 2, 3];
    const delays = [0, 2000, 5000, 8000];
    steps.forEach((step, i) => {
      setTimeout(() => setLoadingStep(step), delays[i]);
    });
  }, []);

  const analyze = useCallback(
    async (resume: File | null, jd: File | null, jdText: string) => {
      setStage("loading");
      setError(null);
      runLoadingSequence();

      try {
        const data = await analyzeDocuments(resume, jd, jdText);
        setResult(data);
        setStage("results");
      } catch {
        setError("Analysis service temporarily unavailable. Using demo data...");
        setTimeout(() => {
          setResult(MOCK_ANALYSIS);
          setStage("results");
          setError(null);
        }, 1500);
      }
    },
    [runLoadingSequence]
  );

  const runDemo = useCallback(() => {
    setStage("loading");
    setError(null);
    runLoadingSequence();
    setTimeout(() => {
      setResult(MOCK_ANALYSIS);
      setStage("results");
    }, 10000);
  }, [runLoadingSequence]);

  const reset = useCallback(() => {
    setStage("upload");
    setResult(null);
    setError(null);
    setLoadingStep(0);
    setExcludedCourses(new Set());
  }, []);

  const toggleCourseExclusion = useCallback((courseId: string) => {
    setExcludedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) next.delete(courseId);
      else next.add(courseId);
      return next;
    });
  }, []);

  const filteredPathway = result
    ? result.pathway
        .filter((c) => !excludedCourses.has(c.course_id))
        .map((c, i) => ({ ...c, priority_order: i + 1 }))
    : [];

  const filteredDuration = filteredPathway.reduce((s, c) => s + c.duration_hours, 0);

  return {
    stage,
    result,
    error,
    loadingStep,
    excludedCourses,
    filteredPathway,
    filteredDuration,
    analyze,
    runDemo,
    reset,
    toggleCourseExclusion,
  };
}
