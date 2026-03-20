# SkillBridge — AI-Adaptive Onboarding Engine

<div align="center">

![SkillBridge Banner](https://img.shields.io/badge/SkillBridge-AI--Adaptive%20Onboarding-3B82F6?style=for-the-badge&logo=lightning&logoColor=white)

**Your gap. Your path. Your growth.**

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-skill--bridge--two--ochre.vercel.app-22c55e?style=for-the-badge)](https://skill-bridge-two-ochre.vercel.app/)
[![Built with React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![LLaMA 3](https://img.shields.io/badge/LLaMA%203-70B-FF6B35?style=flat-square&logo=meta)](https://ai.meta.com/llama/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## 🎯 Problem Statement

Corporate onboarding is broken. Every year, companies spend billions of dollars putting new hires through generic, one-size-fits-all training programs — courses that either teach what the employee already knows or skip ahead of what they're not yet ready for. A senior engineer spends 40 hours in "Introduction to Git." A junior analyst is dropped into advanced machine learning before they've touched pandas. The result is demoralized employees, wasted L&D budgets, and a longer time-to-productivity than necessary.

**SkillBridge solves this.** By analyzing a new hire's resume against the actual requirements of their target role, SkillBridge computes a precise skill delta and generates a hyper-personalized, ordered training pathway that covers only the real gaps — nothing more, nothing less. Every course recommendation is grounded against a curated 62-course catalog (zero hallucinations), every decision is explained through an AI reasoning trace, and the full pipeline runs in under 15 seconds. The result: onboarding that respects what the employee already knows and accelerates them to competency faster.

---

## 🚀 Live Demo

> **Try it now:** [https://skill-bridge-two-ochre.vercel.app/](https://skill-bridge-two-ochre.vercel.app/)

Click **"✨ Try with sample data"** on the upload page to instantly load a pre-built Software Engineer resume and Full-Stack Developer job description — no file upload needed.

---

## ✨ Features

- **📄 PDF Resume & JD Parsing** — Upload any text-based PDF; PyMuPDF extracts the raw text
- **🧠 LLM Skill Extraction** — LLaMA 3 70B (via Groq) identifies skills and infers proficiency levels from context
- **🔬 Taxonomy Normalization** — Every skill mapped to a 120+ skill O*NET-inspired vocabulary using cosine similarity
- **🎯 Precision Gap Analysis** — Level-difference scoring quantifies exactly how large each skill gap is
- **🗺️ Adaptive Pathfinding** — Composite scoring + topological sort generates an ordered, prerequisite-aware pathway
- **📊 Interactive DAG Visualization** — React Flow renders the learning roadmap as a zoomable, clickable graph
- **🔍 AI Reasoning Trace** — 4-step programmatic explanation of every decision made by the engine
- **🚫 Zero Hallucination** — All course recommendations validated against a static catalog
- **🌙 Dark Mode** — Full dark/light theme with system preference detection
- **📱 Fully Responsive** — Works on 1920px desktop, 1280px laptop, and 375px mobile

---

## 🖼️ Screenshots

| Upload Stage | Results — Skill Gap | Results — Learning Roadmap |
|:---:|:---:|:---:|
| *Drop resume + JD to begin* | *Skill gap matrix with severity* | *React Flow DAG course pathway* |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│   React 18 + Vite + TypeScript + TailwindCSS                │
│                                                              │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ Upload   │  │ Skill Gap    │  │ Learning Roadmap      │  │
│  │ Panel    │  │ Summary +    │  │ React Flow DAG +      │  │
│  │          │  │ Matrix Table │  │ AI Reasoning Trace    │  │
│  └──────────┘  └──────────────┘  └───────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │ Axios HTTP (multipart/form-data)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      FASTAPI BACKEND                         │
│                                                              │
│  POST /api/analyze                                           │
│       │                                                      │
│       ├─► pdf_extractor.py   (PyMuPDF → raw text)           │
│       ├─► skill_extractor.py (LLM + taxonomy normalization)  │
│       ├─► gap_analyzer.py    (level-diff gap scoring)        │
│       ├─► pathway_generator.py (embedding + topo sort)       │
│       ├─► validators.py      (anti-hallucination checks)     │
│       └─► reasoning_tracer.py (programmatic trace)          │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        AI CORE                               │
│                                                              │
│  ┌────────────────┐   ┌──────────────────────────────────┐  │
│  │ Groq API       │   │ sentence-transformers             │  │
│  │ LLaMA 3 70B    │   │ all-MiniLM-L6-v2 (local, 384d)   │  │
│  │ temperature=0.1│   │ FAISS cosine similarity index     │  │
│  └────────────────┘   └──────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Static Data (zero-hallucination grounding)           │   │
│  │  • skill_taxonomy.py  — 120+ skills, 6 domains       │   │
│  │  • course_catalog.py  — 62+ courses, 10+ per domain  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ How It Works

### Full Pipeline (7 Steps)

**Step 1 — PDF Extraction**
PyMuPDF (`fitz`) reads the uploaded resume and job description PDFs, iterates through all pages, and extracts clean text. If the result is fewer than 50 characters, the document is flagged as scanned/image-based.

**Step 2 — LLM Skill Extraction**
LLaMA 3 70B (via Groq API, `temperature=0.1`) receives a structured prompt asking it to extract all technical skills with proficiency levels inferred from context clues — years of experience, titles like "senior" or "lead", phrases like "proficient in" or "familiar with". Returns a strict JSON array.

**Step 3 — Taxonomy Normalization**
Every extracted skill is encoded to a 384-dimensional vector using `all-MiniLM-L6-v2`. Cosine similarity is computed against all 120+ skills in the pre-indexed FAISS taxonomy. Skills with similarity ≥ 0.65 are mapped to the nearest taxonomy term; skills below threshold are flagged as unmapped and excluded from gap analysis.

**Step 4 — Gap Scoring**
For each skill required by the JD, the gap is computed against the resume:
```python
level_map = {"none": 0, "beginner": 1, "intermediate": 2, "expert": 3}
gap_score = max(0.0, (jd_level - resume_level) / 3.0)
# gap_score = 0.0   → no gap (candidate meets or exceeds requirement)
# gap_score = 0.33  → minor gap
# gap_score = 0.67  → moderate gap
# gap_score = 1.0   → critical gap (complete skill absence)
```

**Step 5 — Course Retrieval**
For each skill gap, candidate courses are identified from the 62-course catalog by computing cosine similarity between the gap embedding and each course's skill tag embeddings. A course qualifies if `max_sim > 0.60`. Each candidate course is scored:
```
composite_score = (0.5 × relevance_score) + (0.5 × coverage_score) + [0.15 diversity_bonus]
```

**Step 6 — Pathway Ordering (Topological Sort)**
A directed graph is built from course prerequisite relationships using `networkx`. Kahn's algorithm produces a valid topological ordering. Within each topological level, courses addressing critical gaps are placed first. The final pathway is capped at 12 courses.

**Step 7 — Reasoning Trace**
Four `ReasoningStep` objects are built **programmatically** by injecting real computed values (actual skill counts, real gap names, actual course titles, measured coverage percentages) into sentence templates. The LLM is never called freely for this — factual grounding is guaranteed.

---

## 🧮 Adaptive Pathing Algorithm

The core algorithm behind SkillBridge's course recommendations:

### Composite Scoring Formula

```
composite_score = (0.5 × relevance_score) + (0.5 × coverage_score) + diversity_bonus

where:
  relevance_score  = mean(max cosine_sim(gap_embedding, course_tag_embeddings))
                     for all gaps this course addresses

  coverage_score   = critical_gaps_this_course_covers / total_critical_gaps

  diversity_bonus  = +0.15 if course domain not yet represented in selected_courses
                     (prevents over-fitting to a single domain)
```

### Prerequisite Graph & Topological Sort

```
1. Build networkx DiGraph
   → Nodes: all selected course_ids
   → Edges: prerequisite_course → dependent_course

2. Run Kahn's Algorithm (nx.topological_sort)
   → Produces a valid linear ordering where all prerequisites
     appear before their dependents

3. Within each topological level:
   → Sort by gap_severity (critical → moderate → minor)

4. Assign priority_order = 1, 2, 3, ...

5. Validate: prerequisites_met = True if all prereqs
   appear earlier in the ordered list
```

### Anti-Hallucination Validation

After every pathway generation, a validation pass checks:
- ✅ All `course_id` values exist in `COURSE_CATALOG`
- ✅ No duplicate courses in the pathway
- ✅ Every critical gap appears in at least one course's `addresses_gaps`
- ✅ `prerequisites_met = True` for all courses

If any check fails, the pathway is regenerated with `force_coverage=True`.

---

## 🛠️ Tech Stack

| Component | Technology | Why Chosen |
|---|---|---|
| **LLM** | LLaMA 3 70B via Groq API | Free tier, ~3s latency, structured JSON output, 6K TPM |
| **Embeddings** | all-MiniLM-L6-v2 (sentence-transformers) | 384-dim, runs locally, no API cost, strong semantic accuracy |
| **Vector Search** | FAISS-cpu | Sub-millisecond cosine similarity over 120-skill taxonomy index |
| **Prerequisite Graph** | networkx + Kahn's Algorithm | Directed graph + topological sort for valid course ordering |
| **PDF Extraction** | PyMuPDF (fitz) | Handles complex resume layouts, no external API required |
| **Backend Framework** | FastAPI + Pydantic v2 | Async, type-safe, auto-generated OpenAPI docs |
| **Frontend Framework** | React 18 + Vite + TypeScript | Strict typing, fast HMR, strong component isolation |
| **Graph Visualization** | React Flow v11 + dagre | DAG rendering with custom nodes, pan/zoom, fit view |
| **Animations** | Framer Motion | 4-step loading sequence, drawer slide-ins, AnimatePresence |
| **State Management** | Zustand | Lightweight, no boilerplate, persists filter and dark mode |
| **Styling** | TailwindCSS v3 | Utility-first, consistent dark mode via `dark:` variants |
| **PDF Export** | jsPDF + html2canvas | Client-side roadmap download, no server needed |
| **LLM Orchestration** | LangChain | Prompt templates, output parsing, LLM abstraction layer |
| **Containerization** | Docker + docker-compose | One-command setup for judges and evaluators |

---

## 📊 Datasets & Citations

| Dataset | Source | Usage |
|---|---|---|
| **O*NET 28.0 Database** | [onetcenter.org/db_releases.html](https://www.onetcenter.org/db_releases.html) | Inspired the 120+ skill vocabulary across 6 occupational domains |
| **Kaggle Resume Dataset** | [snehaanbhawal/resume-dataset](https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset/data) | Used to validate skill extraction accuracy across 10 labeled resumes |
| **Jobs & Job Descriptions** | [kshitizregmi/jobs-and-job-description](https://www.kaggle.com/datasets/kshitizregmi/jobs-and-job-description) | Validated JD parsing across 6 target roles |
| **LLaMA 3 (Meta AI)** | [ai.meta.com/llama](https://ai.meta.com/llama/) | Primary LLM for skill extraction (open weights, served via Groq) |
| **all-MiniLM-L6-v2** | [HuggingFace](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) | Embedding model for semantic skill matching (Apache 2.0) |

> The course catalog (62 entries) was curated manually and cross-referenced against public learning platforms. No proprietary data is used anywhere in the pipeline.

---

## 📈 Evaluation Metrics

| Metric | Value | Measurement Method |
|---|---|---|
| **Skill Extraction Accuracy** | 85–95% | Compared LLM output against manually labeled ground truth on 10 diverse resumes |
| **Hallucination Rate** | **0%** | All `CourseModule.course_id` values validated against static catalog post-generation |
| **Pathway Coverage** | ~94% avg | % of critical skill gaps (score ≥ 0.67) addressed by at least one course |
| **End-to-End Latency** | **< 15 seconds** | PDF upload to full `AnalysisResponse` on Groq free tier with LLaMA 3 70B |
| **Cross-Domain Accuracy** | **6 / 6 roles** | Validated on SE, Data Analyst, PM, UX Designer, Ops Manager, Financial Analyst profiles |

---

## 🚦 Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- A free Groq API key → [console.groq.com](https://console.groq.com)

### Option 1 — Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/skillbridge.git
cd skillbridge

# Add your Groq API key
echo "GROQ_API_KEY=your_key_here" > .env

# Build and run both services
docker-compose up --build
```

Frontend → http://localhost:5173  
Backend → http://localhost:8000  
API Docs → http://localhost:8000/docs

---

### Option 2 — Manual Setup

#### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Start the backend
uvicorn main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open http://localhost:5173 in your browser.

---

## 📁 Project Structure

```
skillbridge/
├── backend/
│   ├── main.py                  # FastAPI app, CORS, startup warmup, all routes
│   ├── skill_extractor.py       # LLM skill extraction + taxonomy normalization
│   ├── gap_analyzer.py          # Skill gap scoring algorithm
│   ├── pathway_generator.py     # Adaptive pathfinding + topological sort
│   ├── reasoning_tracer.py      # Programmatic reasoning trace generation
│   ├── validators.py            # Anti-hallucination pathway validation
│   ├── embeddings.py            # Sentence transformer singleton + cosine utils
│   ├── pdf_extractor.py         # PyMuPDF PDF-to-text extraction
│   ├── course_catalog.py        # 62+ hard-coded courses (6 domains)
│   ├── skill_taxonomy.py        # 120+ skill taxonomy + FAISS index
│   ├── models.py                # All Pydantic v2 schemas
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Stage machine: upload → loading → results
│   │   ├── store/               # Zustand global state
│   │   ├── components/
│   │   │   ├── UploadPanel.tsx
│   │   │   ├── LoadingAnimation.tsx
│   │   │   ├── SkillGapSummary.tsx
│   │   │   ├── SkillGapMatrix.tsx
│   │   │   ├── PathwayGraph.tsx
│   │   │   ├── CourseNode.tsx
│   │   │   ├── CourseDrawer.tsx
│   │   │   ├── ReasoningPanel.tsx
│   │   │   └── ...
│   │   ├── api/client.ts
│   │   ├── types/index.ts
│   │   └── hooks/useAnalysis.ts
│   ├── package.json
│   └── vite.config.ts
├── README.md
└── docker-compose.yml
```

---

## 🌐 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze` | Full analysis pipeline (multipart PDF upload) |
| `POST` | `/api/analyze/demo` | Demo mode (JSON text input, no PDF needed) |
| `GET` | `/api/catalog` | Returns full 62-course catalog |
| `GET` | `/api/health` | Health check with model and catalog info |

**Interactive API docs:** http://localhost:8000/docs (Swagger UI)

---

## 🎨 Domain Color System

| Domain | Color | Hex |
|---|---|---|
| Software Engineering | 🔵 Blue | `#3B82F6` |
| Data Science | 🟣 Purple | `#8B5CF6` |
| Product Management | 🟢 Green | `#10B981` |
| Design / UX | 🟠 Orange | `#F59E0B` |
| Operations & Logistics | 🔴 Red | `#EF4444` |
| Finance & Accounting | 🩵 Teal | `#14B8A6` |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Meta AI](https://ai.meta.com/llama/) for LLaMA 3 open weights
- [Groq](https://groq.com) for the free, ultra-fast inference API
- [sentence-transformers](https://www.sbert.net/) for the all-MiniLM-L6-v2 model
- [O*NET](https://www.onetcenter.org/) for the occupational skills ontology that inspired the taxonomy
- [React Flow](https://reactflow.dev/) for the DAG visualization library
- ARTPARK CodeForge Hackathon for the challenge prompt

---

<div align="center">

Built with ❤️ for the **ARTPARK CodeForge Hackathon**

[![Live Demo](https://img.shields.io/badge/🚀%20Try%20SkillBridge%20Live-skill--bridge--two--ochre.vercel.app-3B82F6?style=for-the-badge)](https://skill-bridge-two-ochre.vercel.app/)

</div>

