import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadPanelProps {
  onAnalyze: (resume: File | null, jd: File | null, jdText: string) => void;
  onDemo: () => void;
}

function FileDropzone({
  label,
  file,
  onFile,
  icon,
}: {
  label: string;
  file: File | null;
  onFile: (f: File) => void;
  icon: React.ReactNode;
}) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onFile(accepted[0]);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all duration-200 cursor-pointer min-h-[200px] ${
        isDragActive
          ? "border-primary bg-primary/5 scale-[1.01]"
          : file
          ? "border-gap-minor/40 bg-gap-minor/5"
          : "border-border hover:border-primary/40 hover:bg-primary/[0.02]"
      }`}
      role="button"
      aria-label={label}
    >
      <input {...getInputProps()} />
      <AnimatePresence mode="wait">
        {file ? (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <CheckCircle2 className="h-10 w-10 text-gap-minor" />
            <p className="text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <div className="rounded-full bg-secondary p-3">{icon}</div>
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">
              {isDragActive ? "Drop it here..." : "Drag & drop or click to browse"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function UploadPanel({ onAnalyze, onDemo }: UploadPanelProps) {
  const [resume, setResume] = useState<File | null>(null);
  const [jd, setJd] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");

  const canAnalyze = resume && (jd || jdText.trim().length > 20);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-4xl"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Your Resume
          </h3>
          <FileDropzone
            label="Drop your resume (PDF)"
            file={resume}
            onFile={setResume}
            icon={<FileText className="h-6 w-6 text-primary" />}
          />
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Job Description
          </h3>
          <FileDropzone
            label="Drop a job description (PDF)"
            file={jd}
            onFile={setJd}
            icon={<Upload className="h-6 w-6 text-primary" />}
          />
          <div className="mt-3">
            <textarea
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
              rows={3}
              placeholder="Or paste the job description text here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              aria-label="Paste job description text"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <Button
          size="lg"
          disabled={!canAnalyze}
          onClick={() => onAnalyze(resume, jd, jdText)}
          className="px-8 text-base font-semibold active:scale-[0.97] transition-transform"
          aria-label="Analyze my skill gap"
        >
          Analyze My Gap →
        </Button>

        <button
          onClick={onDemo}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors active:scale-[0.97]"
          aria-label="Try with demo data"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Try Demo (Software Engineer → Full-Stack)
        </button>

        <p className="text-xs text-muted-foreground/60">
          Powered by Llama 3 · Grounded against 62 curated courses
        </p>
      </div>
    </motion.div>
  );
}
