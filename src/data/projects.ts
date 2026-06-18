export type ProjectStatus = "shipped" | "experiment" | "archived";

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
  links: { github?: string; demo?: string };
};

const GH = "https://github.com/metehanulusoy";

/**
 * Real projects, aligned with Metehan's CV + public GitHub. Only live links
 * (public repos / deployed demos) are included.
 */
export const projects: Project[] = [
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
    accent: "--accent3",
    links: { github: `${GH}/banking-chatbot-rag` },
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
    links: {
      github: `${GH}/pdf-rag-app`,
      demo: "https://pdf-rag-app-metehanulusoy.streamlit.app",
    },
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
    links: { github: `${GH}/myanimelist`, demo: "https://myanimelist-eta.vercel.app" },
  },
];

export const projectTags = ["all", ...Array.from(new Set(projects.flatMap((p) => p.tags)))];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function sortedProjects() {
  const statusRank: Record<ProjectStatus, number> = {
    shipped: 0,
    experiment: 1,
    archived: 2,
  };
  return [...projects].sort(
    (a, b) =>
      Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
      b.year - a.year ||
      statusRank[a.status] - statusRank[b.status],
  );
}
