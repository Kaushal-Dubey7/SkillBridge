import { AnimatePresence, motion } from "framer-motion";
import { useAnalysis } from "@/hooks/useAnalysis";
import { UploadPanel } from "@/components/UploadPanel";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { SkillGapMatrix } from "@/components/SkillGapMatrix";
import { PathwayGraph } from "@/components/PathwayGraph";
import { ReasoningPanel } from "@/components/ReasoningPanel";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import { useState } from "react";

export default function Index() {
  const {
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
  } = useAnalysis();

  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    setDark((d) => {
      document.documentElement.classList.toggle("dark", !d);
      return !d;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            {stage === "results" && (
              <button
                onClick={reset}
                className="rounded-md p-1.5 hover:bg-secondary transition-colors active:scale-95"
                aria-label="Go back to upload"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              Skill<span className="text-primary">Bridge</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="hidden sm:block text-xs text-muted-foreground">
              Your gap. Your path. Your growth.
            </p>
            <button
              onClick={toggleDark}
              className="rounded-md p-1.5 hover:bg-secondary transition-colors active:scale-95"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          {/* STAGE 1 — UPLOAD */}
          {stage === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center pt-8 sm:pt-16"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-center mb-10"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance leading-tight">
                  Discover your skill gaps.
                  <br />
                  <span className="text-primary">Get a personalized roadmap.</span>
                </h2>
                <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                  Upload your resume and a target job description. Our AI analyzes the gap and
                  builds a course-by-course learning path — grounded in real courses, never
                  hallucinated.
                </p>
              </motion.div>
              <UploadPanel onAnalyze={analyze} onDemo={runDemo} />
            </motion.div>
          )}

          {/* STAGE 2 — LOADING */}
          {stage === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingAnimation currentStep={loadingStep} />
              {error && (
                <p className="text-center text-sm text-gap-moderate mt-4">{error}</p>
              )}
            </motion.div>
          )}

          {/* STAGE 3 — RESULTS */}
          {stage === "results" && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid gap-6 lg:grid-cols-[280px_1fr_280px] xl:grid-cols-[300px_1fr_300px]">
                {/* Left — Skill Gap Summary */}
                <div className="order-2 lg:order-1">
                  <SkillGapMatrix
                    gaps={result.skill_gaps}
                    resumeSkills={result.resume_skills}
                    jdSkills={result.jd_skills}
                    coverageScore={result.coverage_score}
                    totalHours={filteredDuration}
                    estimatedWeeks={filteredDuration / 10}
                  />
                </div>

                {/* Center — Pathway Graph */}
                <div className="order-1 lg:order-2">
                  <PathwayGraph
                    pathway={filteredPathway}
                    excludedCourses={excludedCourses}
                    onToggleCourse={toggleCourseExclusion}
                  />
                </div>

                {/* Right — Reasoning Trace */}
                <div className="order-3">
                  <ReasoningPanel
                    steps={result.reasoning_trace}
                    totalHours={filteredDuration}
                    estimatedWeeks={filteredDuration / 10}
                    coverageScore={result.coverage_score}
                    result={result}
                  />
                </div>
              </div>

              {/* Mobile sticky download */}
              <div className="fixed bottom-4 left-4 right-4 lg:hidden z-50">
                <button
                  onClick={() => {
                    // Trigger download from ReasoningPanel's function
                    const btn = document.querySelector('[aria-label="Download roadmap as PDF"]');
                    if (btn instanceof HTMLElement) btn.click();
                  }}
                  className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg active:scale-[0.97] transition-transform"
                >
                  📥 Download Roadmap
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
