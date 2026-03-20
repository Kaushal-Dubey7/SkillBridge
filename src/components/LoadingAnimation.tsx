import { motion } from "framer-motion";

const STEPS = [
  { icon: "📄", label: "Parsing your documents..." },
  { icon: "🧠", label: "Extracting skills with AI..." },
  { icon: "🔍", label: "Analyzing skill gaps..." },
  { icon: "🗺️", label: "Building your learning roadmap..." },
];

interface LoadingAnimationProps {
  currentStep: number;
}

export function LoadingAnimation({ currentStep }: LoadingAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="flex flex-col gap-4 w-full max-w-md">
        {STEPS.map((step, i) => {
          const isActive = i === currentStep;
          const isDone = i < currentStep;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{
                opacity: i <= currentStep ? 1 : 0.3,
                x: 0,
              }}
              transition={{ delay: i * 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors duration-300 ${
                isActive
                  ? "border-primary/30 bg-primary/5"
                  : isDone
                  ? "border-gap-minor/30 bg-gap-minor/5"
                  : "border-border bg-card"
              }`}
            >
              <span className="text-xl" role="img" aria-hidden="true">
                {isDone ? "✅" : step.icon}
              </span>
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-foreground" : isDone ? "text-gap-minor" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
              {isActive && (
                <motion.div
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Skeleton preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-12 grid w-full max-w-5xl grid-cols-3 gap-4 px-4"
      >
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3 rounded-lg border border-border/50 bg-card/50 p-4">
            <div className="h-3 w-1/2 rounded bg-muted animate-pulse-soft" />
            <div className="h-2 w-3/4 rounded bg-muted animate-pulse-soft" />
            <div className="h-2 w-2/3 rounded bg-muted animate-pulse-soft" />
            <div className="h-16 w-full rounded bg-muted animate-pulse-soft" />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
