import "server-only";
import { readdirSync, readFileSync } from "fs";
import path from "path";
import matter from "gray-matter";
import type { UseCaseId } from "./audit/types";

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  industry: string;
  size: string;
  hubs: string[];
  useCases: UseCaseId[];
  metrics: { value: string; label: string }[];
  stack: string[];
  status: "published" | "draft";
  featured: boolean;
  date: string;
  image?: string;
  sourceUrl?: string;
  body: string;
}

const DIR = path.join(process.cwd(), "content", "case-studies");

export function showDrafts() {
  const v = process.env.SHOW_DRAFTS;
  if (v === undefined) return process.env.NODE_ENV !== "production";
  return v === "true";
}

let cache: CaseStudy[] | null = null;

function loadAll(): CaseStudy[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  cache = readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(readFileSync(path.join(DIR, file), "utf8"));
      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title,
        client: data.client ?? "",
        industry: data.industry ?? "",
        size: data.size ?? "",
        hubs: data.hubs ?? [],
        useCases: data.useCases ?? [],
        metrics: data.metrics ?? [],
        stack: data.stack ?? [],
        status: data.status === "draft" ? "draft" : "published",
        featured: Boolean(data.featured),
        date: String(data.date ?? ""),
        image: data.image,
        sourceUrl: data.sourceUrl,
        body: content,
      } satisfies CaseStudy;
    })
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.date.localeCompare(a.date));
  return cache;
}

export function getCaseStudies(): CaseStudy[] {
  const drafts = showDrafts();
  return loadAll().filter((c) => drafts || c.status === "published");
}

export function getCaseStudy(slug: string): CaseStudy | null {
  return getCaseStudies().find((c) => c.slug === slug) ?? null;
}

/** Case studies relevant to the weakest use cases, published first. */
export function matchCaseStudies(useCases: UseCaseId[], limit = 3): CaseStudy[] {
  const all = getCaseStudies().filter((c) => c.status === "published");
  const scored = all
    .map((c) => {
      const idx = useCases.findIndex((u) => c.useCases.includes(u));
      return { c, rank: idx === -1 ? 99 : idx };
    })
    .filter((x) => x.rank < 99)
    .sort((a, b) => a.rank - b.rank);
  return scored.slice(0, limit).map((x) => x.c);
}
