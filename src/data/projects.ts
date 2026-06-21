export type ProjectStatus = "shipped" | "experiment" | "archived" | "private";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  year: number;
  status: ProjectStatus;
  tags: string[];
  tech: string[];
  featured?: boolean;
  accent: string; // CSS var token, e.g. "--accent2"
  cover?: string; // real screenshot under /public/projects
  links: { github?: string; demo?: string };
  locked?: boolean; // private repo — shown locked, not clickable, no details
};

const GH = "https://github.com/metehanulusoy";

/**
 * Real public projects, aligned with Metehan's CV + public GitHub. Only live
 * links (public repos / deployed demos) are included.
 */
const publicProjects: Project[] = [
  {
    slug: "credit-risk-scoring",
    title: "Credit Risk Scoring",
    summary:
      "A credit-default ML pipeline — 4 models on 10k+ samples, AUC-ROC 0.87, SHAP explainability, served over FastAPI.",
    description:
      "An end-to-end credit-default prediction pipeline comparing 4 models on 10,000+ samples (AUC-ROC 0.87, KS 0.61, Gini 0.75) with 19 crafted features. SHAP explainability across every feature, and a FastAPI endpoint for real-time scoring of loan applications — built to mirror how risk models actually ship in finance.",
    year: 2026,
    status: "shipped",
    tags: ["ml", "finance"],
    tech: ["scikit-learn", "XGBoost", "SHAP", "FastAPI"],
    featured: true,
    accent: "--accent2",
    links: { github: `${GH}/credit-risk-scoring` },
  },
  {
    slug: "fraud-detection-system",
    title: "Real-Time Fraud Detection",
    summary:
      "An XGBoost + Isolation Forest ensemble on 50k transactions — F1 0.99, 0.02% false-positive rate.",
    description:
      "A real-time fraud-detection system: an XGBoost + Isolation Forest ensemble trained on 50,000 transactions (F1 0.99, FPR 0.02%) with 20+ domain features (velocity, amount anomaly, temporal signals). Handles a 98/2 class imbalance with SMOTETomek resampling and ships a rule-based alert engine with 6 configurable thresholds.",
    year: 2026,
    status: "shipped",
    tags: ["ml", "finance"],
    tech: ["XGBoost", "Isolation Forest", "FastAPI"],
    featured: true,
    accent: "--accent1",
    links: { github: `${GH}/fraud-detection-system` },
  },
  {
    slug: "llm-cost-autopilot",
    title: "LLM Cost Autopilot",
    summary:
      "A multi-provider LLM gateway that routes each prompt to the cheapest capable model — 50%+ cost cut vs an all-GPT-4o baseline.",
    description:
      "An intelligent multi-provider LLM gateway with sub-millisecond scikit-learn complexity routing, hot-reloadable YAML config, auto-escalation on failures, and async LLM-as-judge quality verification. Most requests don't need your biggest model — a tiny classifier decides which one each prompt actually needs, halving the bill.",
    year: 2026,
    status: "shipped",
    tags: ["ai"],
    tech: ["Python", "scikit-learn", "FastAPI"],
    accent: "--accent3",
    links: { github: `${GH}/llm-cost-autopilot` },
  },
  {
    slug: "model-regression-detection",
    title: "LLM Regression Detection",
    summary:
      "A CI/CD-style regression gate for LLM features — catches quality drops on every prompt or model change before they reach users.",
    description:
      "A regression-detection pipeline for LLM-powered features: an async eval runner, exact-match + LLM-as-judge scoring, per-case HTML diffs, Slack alerts, and a GitHub Action with a PR-comment bot and merge gate. Treats prompts like code — every change is gated behind an eval suite.",
    year: 2026,
    status: "shipped",
    tags: ["ai"],
    tech: ["Python", "GitHub Actions", "LLM-as-judge"],
    accent: "--accent1",
    links: { github: `${GH}/model-regression-detection` },
  },
  {
    slug: "semantic-caching",
    title: "Semantic Caching Proxy",
    summary:
      "An OpenAI-compatible drop-in proxy that dedupes near-identical requests by embedding similarity — streaming-aware, temperature-keyed TTLs.",
    description:
      "An OpenAI-compatible drop-in semantic caching proxy: embedding-based similarity dedup, a streaming-aware writer that only caches complete successful responses, temperature-keyed TTL tiers, Prometheus observability, and an optional Redis backend. Cuts repeat-call latency and cost without touching the calling code.",
    year: 2026,
    status: "shipped",
    tags: ["ai"],
    tech: ["Python", "FastAPI", "Redis", "Embeddings"],
    accent: "--accent2",
    links: { github: `${GH}/semantic-caching` },
  },
  {
    slug: "rag-hybrid-search",
    title: "Hybrid-Search RAG Pipeline",
    summary:
      "Production-grade retrieval: dense + BM25 indexing, RRF fusion, cross-encoder rerank, and verified citations.",
    description:
      "An end-to-end RAG pipeline that takes retrieval quality seriously: multi-format ingestion, swappable chunking strategies, dual dense + BM25 indexing fused with Reciprocal Rank Fusion, cross-encoder reranking, grounded generation with bracketed citations, an LLM-as-judge citation verifier, and a composite-confidence 'I don't know' gate.",
    year: 2026,
    status: "experiment",
    tags: ["ai"],
    tech: ["Python", "RAG", "Embeddings", "BM25"],
    accent: "--accent3",
    links: { github: `${GH}/rag-hybrid-search` },
  },
  {
    slug: "llm-arbitration",
    title: "Multi-Agent LLM Arbitration",
    summary:
      "Three specialist critics on three providers grade an output; a disagreement detector + adjudicator synthesize one confidence-scored verdict.",
    description:
      "Multi-agent LLM output arbitration: three specialist critics on three different providers (OpenAI / Anthropic / Ollama) grade output along distinct dimensions, then a pure disagreement detector and an adjudicator agent synthesize a single confidence-scored verdict. A LangGraph-style fixed DAG with a deterministic fallback.",
    year: 2026,
    status: "experiment",
    tags: ["ai"],
    tech: ["Python", "LangGraph", "Multi-LLM"],
    accent: "--accent4",
    links: { github: `${GH}/llm-arbitration` },
  },
  {
    slug: "failure-forensics",
    title: "Failure Forensics",
    summary:
      "Observability + automatic root-cause analysis for multi-step AI pipelines — span tracing and parallel LLM-as-judge backward traces.",
    description:
      "Observability and automatic root-cause analysis for multi-step AI pipelines: decorator-based span tracing, a parallel LLM-as-judge backward trace, an atomic feedback-to-eval loop, a FastAPI gateway, and a Streamlit visual explorer that shows exactly where a run went wrong.",
    year: 2026,
    status: "experiment",
    tags: ["ai"],
    tech: ["Python", "FastAPI", "Streamlit"],
    accent: "--accent5",
    links: { github: `${GH}/failure-forensics` },
  },
  {
    slug: "self-healing-docs",
    title: "Self-Healing Docs",
    summary:
      "A GitHub Action that detects when code changes leave docs stale, then opens an auto-fix PR or flags the affected sections.",
    description:
      "A GitHub Action that detects when code changes left the docs stale, then opens an auto-fix PR or flags affected sections for review — built on an embedding-based code-to-docs link graph, an LLM staleness verifier, and a style-preservation pass that keeps your voice.",
    year: 2026,
    status: "experiment",
    tags: ["ai", "automation"],
    tech: ["Python", "GitHub Actions", "Embeddings"],
    accent: "--accent3",
    links: { github: `${GH}/self-healing-docs` },
  },
  {
    slug: "banking-chatbot-rag",
    title: "Banking FAQ Chatbot (RAG)",
    summary:
      "A Turkish banking FAQ chatbot with RAG + 5 compliance guardrails — PII masking, confidence scoring, disclaimers.",
    description:
      "A RAG-based banking FAQ chatbot using LangChain + ChromaDB + FastAPI, with multilingual embeddings over banking documents for accurate Turkish retrieval. Enforces 5 compliance guardrails: out-of-scope detection, PII masking, confidence scoring, fallback routing, and regulatory disclaimers.",
    year: 2026,
    status: "shipped",
    tags: ["ai", "finance"],
    tech: ["LangChain", "ChromaDB", "FastAPI"],
    accent: "--accent4",
    links: { github: `${GH}/banking-chatbot-rag` },
  },
  {
    slug: "jarvis",
    title: "Jarvis — Local AI Assistant",
    summary:
      "A privacy-first personal assistant on local models (Ollama) — morning briefings, RAG research, a coding helper, and voice input.",
    description:
      "A privacy-focused personal AI assistant powered by local models via Ollama: morning briefings, RAG-backed research, a coding assistant, and voice input — everything runs on your own machine, nothing leaves the laptop.",
    year: 2026,
    status: "shipped",
    tags: ["ai"],
    tech: ["Python", "Ollama", "RAG"],
    accent: "--accent1",
    links: { github: `${GH}/jarvis` },
  },
  {
    slug: "pdf-rag-assistant",
    title: "PDF Assistant — RAG Q&A",
    summary:
      "Upload PDFs and ask questions across Turkish, English, German and French — RAG with LangChain + GPT-4o-mini.",
    description:
      "A multi-language document Q&A system built with LangChain, OpenAI GPT-4o-mini and a ChromaDB vector store. Users upload multiple PDFs and query them through a conversational interface with automatic summary extraction. Deployed live on Streamlit Cloud.",
    year: 2026,
    status: "shipped",
    tags: ["ai"],
    tech: ["Python", "LangChain", "ChromaDB", "Streamlit"],
    accent: "--accent4",
    cover: "/projects/pdf-rag-assistant.png",
    links: {
      github: `${GH}/pdf-rag-app`,
      demo: "https://pdf-rag-app-metehanulusoy.streamlit.app",
    },
  },
  {
    slug: "bist-ai-yatirim-asistani",
    title: "BIST AI Investment Assistant",
    summary:
      "A BIST-focused, AI-assisted personal portfolio, analysis, and paper-trading app built with Python + Streamlit.",
    description:
      "A BIST-focused, AI-assisted personal stock app: portfolio tracking, analysis, and paper trading. Built with Python and Streamlit to explore market data and test strategies without risking real money.",
    year: 2026,
    status: "shipped",
    tags: ["ai", "finance"],
    tech: ["Python", "Streamlit"],
    accent: "--accent2",
    links: { github: `${GH}/bist-ai-yatirim-asistani` },
  },
  {
    slug: "n8n-automation-bundle",
    title: "n8n Workflow Recommender & AI Bundle",
    summary:
      "An AI chatbot that recommends from 2,055+ n8n workflows — packaged as a commercial product on Gumroad.",
    description:
      "A zero-backend browser app that recommends the right automation from a curated library of 2,055+ n8n workflows using a custom keyword-scoring algorithm, plus a companion Python→n8n converter. Packaged and sold as a $20 product on Gumroad — end-to-end product development with a real customer base.",
    year: 2026,
    status: "shipped",
    tags: ["ai", "automation"],
    tech: ["JavaScript", "n8n", "Gumroad"],
    accent: "--accent5",
    links: { github: `${GH}/awesome-n8n-workflows`, demo: "https://metmete.gumroad.com" },
  },
  {
    slug: "n8n-workflow-to-python",
    title: "n8n → Python Converter",
    summary:
      "Converts n8n workflow JSON into runnable Python scripts — the companion tool to the n8n workflow library.",
    description:
      "A browser tool that converts exported n8n workflow JSON files into clean, runnable Python scripts — the companion converter to the awesome-n8n-workflows library, for when you'd rather own the code than the no-code graph.",
    year: 2026,
    status: "shipped",
    tags: ["automation"],
    tech: ["JavaScript", "n8n", "Python"],
    accent: "--accent3",
    links: {
      github: `${GH}/n8n-workflow-to-python`,
      demo: "https://metehanulusoy.github.io/n8n-workflow-to-python",
    },
  },
  {
    slug: "price-tracker-bot",
    title: "Price Tracker Bot",
    summary:
      "Monitors Trendyol & Amazon prices and pings you on Telegram when they drop — with history charts.",
    description:
      "An automated price-monitoring system for Trendyol and Amazon using Playwright web scraping, with real-time Telegram alerts when a price falls below a user-defined target. A Supabase (PostgreSQL) backend tracks products per user, and a Streamlit dashboard renders Plotly price-history charts.",
    year: 2026,
    status: "shipped",
    tags: ["automation"],
    tech: ["Python", "Playwright", "Supabase", "Telegram"],
    accent: "--accent2",
    links: { github: `${GH}/price-tracker-bot` },
  },
  {
    slug: "claude-recipes",
    title: "Claude Code Recipes",
    summary:
      "Copy-paste-ready skills, subagents, hooks, slash commands & MCP configs for Claude Code — each one explained.",
    description:
      "A curated, copy-paste-ready collection of skills, subagents, hooks, slash commands, and MCP server configs for Claude Code — each one documented with what it does and why, so you can lift the pattern instead of reverse-engineering it.",
    year: 2026,
    status: "shipped",
    tags: ["ai", "automation"],
    tech: ["Claude Code", "MCP"],
    accent: "--accent4",
    links: { github: `${GH}/claude-recipes` },
  },
  {
    slug: "comic-book-manager",
    title: "Comic Book Manager (C++)",
    summary:
      "A C++ app showcasing 10+ hand-built data structures — B+ tree, XOR linked list, hash tables, graphs — plus Huffman & KMP.",
    description:
      "A cross-platform C++ application implementing 10+ custom data structures (B+ tree, XOR linked list, chaining & open-addressing hash tables, sparse matrix, graph with BFS/DFS), Huffman compression, and KMP string search — covered by an 18+ module GoogleTest suite. A deep dive into algorithms and testing discipline.",
    year: 2025,
    status: "shipped",
    tags: ["systems"],
    tech: ["C++", "CMake", "GoogleTest"],
    accent: "--accent4",
    links: {},
  },
  {
    slug: "animeverse",
    title: "AnimeVerse",
    summary:
      "A social anime-tracking platform — watch lists, ratings, and following — built on Next.js 16 + Supabase.",
    description:
      "A full social platform for anime fans built on Next.js 16 and Supabase: authentication, a personal watch list with statuses and ratings, social following, and a responsive, app-like UI. An end-to-end, data-backed web product.",
    year: 2026,
    status: "shipped",
    tags: ["web"],
    tech: ["Next.js", "TypeScript", "Supabase"],
    accent: "--accent1",
    cover: "/projects/animeverse.png",
    links: { github: `${GH}/myanimelist`, demo: "https://myanimelist-eta.vercel.app" },
  },
  {
    slug: "garbage-classifier",
    title: "Real-Time Garbage Classifier",
    summary:
      "Browser waste classification with MobileNetV2 transfer learning — 87.3% accuracy across 6 categories.",
    description:
      "A real-time waste-classification web app using MobileNetV2 transfer learning, trained on 2,500+ images (87.3% validation accuracy across 6 categories). Inference runs fully in the browser — only the Dense-layer weights (~30KB) ship while the base loads from a CDN, avoiding an 80MB download.",
    year: 2026,
    status: "shipped",
    tags: ["ml"],
    tech: ["TensorFlow.js", "MobileNetV2"],
    accent: "--accent3",
    cover: "/projects/garbage-classifier.png",
    links: {
      github: `${GH}/garbage-classifier`,
      demo: "https://metehanulusoy.github.io/garbage-classifier",
    },
  },
  {
    slug: "mnist-digit-recognizer",
    title: "MNIST Digit Recognizer",
    summary:
      "Draw a digit, watch a neural net classify it live — ~98% accuracy, fully in the browser.",
    description:
      "A neural-network digit recognizer trained on MNIST to ~98.2% accuracy with TensorFlow/Keras, deployed as an interactive browser demo: draw a digit on the canvas and watch the per-class probabilities update in real time.",
    year: 2025,
    status: "shipped",
    tags: ["ml"],
    tech: ["TensorFlow.js", "Keras"],
    accent: "--accent1",
    cover: "/projects/mnist-digit-recognizer.png",
    links: {
      github: `${GH}/mnist-digit-recognizer`,
      demo: "https://metehanulusoy.github.io/mnist-digit-recognizer",
    },
  },
];

const LOCKED_ACCENTS = ["--accent1", "--accent2", "--accent3", "--accent4", "--accent5"];

/** Private repositories. The name is shown with a lock, but the cards are not
 *  clickable and carry no description, tech, detail page, or sitemap entry. */
const PRIVATE_NAMES = [
  "LifeOS",
  "Yucelergida Web",
  "Bio Sync Turkey Strategy",
  "AI Deep Research Agent",
  "AI HR CV Screening",
  "AI WhatsApp RAG Chatbot",
  "AI Email Autoresponder",
  "Telegram AI Agent Memory",
  "Emotion Detector",
  "CV Builder",
  "n8n Workflow Recommender",
];

const lockedProjects: Project[] = PRIVATE_NAMES.map((title, i) => ({
  slug: `private-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
  title,
  summary: "",
  description: "",
  year: 2026,
  status: "private" as const,
  tags: ["private"],
  tech: [],
  accent: LOCKED_ACCENTS[i % LOCKED_ACCENTS.length],
  locked: true,
  links: {},
}));

export const projects: Project[] = [...publicProjects, ...lockedProjects];

export const projectTags = ["all", ...Array.from(new Set(projects.flatMap((p) => p.tags)))];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function sortedProjects() {
  const statusRank: Record<ProjectStatus, number> = {
    shipped: 0,
    experiment: 1,
    archived: 2,
    private: 3,
  };
  return [...projects].sort(
    (a, b) =>
      // Locked (private) projects always sort to the very end.
      Number(Boolean(a.locked)) - Number(Boolean(b.locked)) ||
      Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
      b.year - a.year ||
      statusRank[a.status] - statusRank[b.status],
  );
}
