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
 * Real projects, curated from Metehan's CV + public GitHub. Only links that
 * are actually live (public repos / deployed demos) are included.
 */
export const projects: Project[] = [
  {
    slug: "n8n-automation-bundle",
    title: "n8n Workflow Recommender & AI Bundle",
    summary:
      "An AI chatbot that recommends the right automation from 2,055+ n8n workflows — packaged into a commercial product on Gumroad.",
    description:
      "A zero-backend browser app that recommends the right automation from a curated library of 2,055+ n8n workflows using a custom keyword-scoring algorithm, plus a companion Python→n8n converter. Packaged and sold as a $20 product on Gumroad — end-to-end product development with a real, paying customer base.",
    year: 2026,
    status: "shipped",
    tags: ["ai", "automation"],
    tech: ["JavaScript", "n8n", "GitHub Pages", "Gumroad"],
    featured: true,
    accent: "--accent2",
    links: { github: `${GH}/awesome-n8n-workflows`, demo: "https://metmete.gumroad.com" },
  },
  {
    slug: "pdf-rag-assistant",
    title: "PDF Assistant — RAG Q&A",
    summary:
      "Upload PDFs and ask questions across Turkish, English, German and French — RAG with LangChain + GPT-4o-mini.",
    description:
      "A multi-language document Q&A system built with LangChain, OpenAI GPT-4o-mini and a ChromaDB vector store. Users upload multiple PDFs and query them through a conversational interface with automatic summary extraction and quick-question shortcuts. Deployed live on Streamlit Cloud.",
    year: 2026,
    status: "shipped",
    tags: ["ai"],
    tech: ["Python", "LangChain", "ChromaDB", "Streamlit"],
    featured: true,
    accent: "--accent1",
    links: {
      github: `${GH}/pdf-rag-app`,
      demo: "https://pdf-rag-app-metehanulusoy.streamlit.app",
    },
  },
  {
    slug: "garbage-classifier",
    title: "Real-Time Garbage Classifier",
    summary:
      "Client-side waste classification with MobileNetV2 transfer learning — 87.3% accuracy across 6 categories.",
    description:
      "A real-time waste-classification web app using MobileNetV2 transfer learning, trained on 2,500+ Kaggle images (87.3% validation accuracy across 6 categories). Inference runs fully in the browser: only the Dense layer weights (~30KB) are shipped while the MobileNetV2 base loads from a CDN, avoiding an 80MB model download.",
    year: 2026,
    status: "shipped",
    tags: ["ml"],
    tech: ["Python", "TensorFlow.js", "MobileNetV2"],
    accent: "--accent3",
    links: {
      github: `${GH}/garbage-classifier`,
      demo: "https://metehanulusoy.github.io/garbage-classifier",
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
    accent: "--accent4",
    links: { github: `${GH}/price-tracker-bot` },
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
    accent: "--accent5",
    links: {},
  },
  {
    slug: "basiclan",
    title: "BasicLan — Language Learning Platform",
    summary:
      "A Java language-learning app (team of 4) with pluggable Binary/SQLite/MySQL storage and a full CI/CD pipeline.",
    description:
      "A console-based language-learning app built by a 4-person Agile team in Java, with a pluggable storage architecture (Binary, SQLite, MySQL) switchable at runtime. Shipped with a Maven + GitHub Actions CI/CD pipeline, a Dockerized MySQL backend, and JaCoCo coverage across Windows/macOS/Linux builds.",
    year: 2025,
    status: "shipped",
    tags: ["tooling"],
    tech: ["Java", "Maven", "Docker", "GitHub Actions"],
    accent: "--accent2",
    links: {},
  },
  {
    slug: "animeverse",
    title: "AnimeVerse",
    summary:
      "A social anime-tracking platform — watch lists, ratings, and following — built on Next.js 16 + Supabase.",
    description:
      "A full social platform for anime fans built on Next.js 16 and Supabase: authentication, a personal watch list with statuses and ratings, social following, and a responsive, app-like UI. A end-to-end, data-backed web product.",
    year: 2026,
    status: "shipped",
    tags: ["web"],
    tech: ["Next.js", "TypeScript", "Supabase"],
    accent: "--accent1",
    links: { github: `${GH}/myanimelist`, demo: "https://myanimelist-eta.vercel.app" },
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
    slug: "mnist-digit-recognizer",
    title: "MNIST Digit Recognizer",
    summary:
      "Handwritten digit recognition with a neural network — ~98% accuracy, runnable in the browser.",
    description:
      "A neural-network digit recognizer trained on MNIST to ~98.2% accuracy with TensorFlow/Keras, deployed as an interactive browser demo where you draw a digit and watch it get classified.",
    year: 2025,
    status: "shipped",
    tags: ["ml"],
    tech: ["Python", "TensorFlow", "Keras"],
    accent: "--accent4",
    links: {
      github: `${GH}/mnist-digit-recognizer`,
      demo: "https://metehanulusoy.github.io/mnist-digit-recognizer",
    },
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
