/**
 * Typed content fetchers for the Django CMS API.
 *
 * Every fetcher is fail-soft: if the API is down or a key is missing the
 * page renders with sensible fallbacks instead of crashing. ISR keeps
 * responses cached for 60s, so the DB is not hit on every request.
 */
import { apiFetch } from "./api";

const REVALIDATE = { next: { revalidate: 60 } } as RequestInit;

export interface Paginated<T> {
  count: number;
  results: T[];
}

export interface Category {
  name: string;
  slug: string;
  description: string;
}

export interface PostListItem {
  title: string;
  slug: string;
  category: Category | null;
  excerpt: string;
  cover_image_url: string | null;
  cover_image_alt: string;
  reading_minutes: number;
  published_at: string;
  updated_at: string;
}

export interface PostDetail extends PostListItem {
  body: string;
  seo_title: string;
  seo_description: string;
  canonical_url: string;
}

export interface CaseStudyListItem {
  title: string;
  slug: string;
  tag: string;
  summary: string;
  tech_stack: string[];
  cover_image_url: string | null;
  cover_image_alt: string;
  featured: boolean;
  published_at: string;
  updated_at: string;
}

export interface CaseStudyImage {
  url: string | null;
  alt: string;
  caption: string;
}

export interface CaseStudyDetail extends CaseStudyListItem {
  body: string;
  video_url: string;
  images: CaseStudyImage[];
  seo_title: string;
  seo_description: string;
  canonical_url: string;
}

/** Extract a YouTube video id from watch/share/shorts/embed URL forms. */
export function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m ? m[1] : null;
}

export interface Service {
  title: string;
  description: string;
  icon: "architecture" | "code" | "integration" | "ai";
}

export type SiteText = Record<string, string>;

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export function getSiteText(): Promise<SiteText> {
  return safe(apiFetch<SiteText>("/api/v1/portfolio/site-text/", REVALIDATE), {});
}

/** Read a key with a hardcoded fallback so an empty DB never blanks the site. */
export function text(t: SiteText, key: string, fallback: string): string {
  return t[key]?.trim() || fallback;
}

export function getPosts(page = 1): Promise<Paginated<PostListItem>> {
  return safe(
    apiFetch<Paginated<PostListItem>>(`/api/v1/blog/posts/?page=${page}`, REVALIDATE),
    { count: 0, results: [] },
  );
}

export function getPost(slug: string): Promise<PostDetail | null> {
  return safe(
    apiFetch<PostDetail>(`/api/v1/blog/posts/${encodeURIComponent(slug)}/`, REVALIDATE),
    null,
  );
}

export function getCaseStudies(featuredOnly = false): Promise<Paginated<CaseStudyListItem>> {
  const qs = featuredOnly ? "?featured=true" : "";
  return safe(
    apiFetch<Paginated<CaseStudyListItem>>(`/api/v1/portfolio/case-studies/${qs}`, REVALIDATE),
    { count: 0, results: [] },
  );
}

export function getCaseStudy(slug: string): Promise<CaseStudyDetail | null> {
  return safe(
    apiFetch<CaseStudyDetail>(
      `/api/v1/portfolio/case-studies/${encodeURIComponent(slug)}/`,
      REVALIDATE,
    ),
    null,
  );
}

export function getServices(): Promise<Service[]> {
  return safe(apiFetch<Service[]>("/api/v1/portfolio/services/", REVALIDATE), []);
}

export interface PortalMilestone {
  title: string;
  description: string;
  status: "pending" | "in_progress" | "done";
  due_date: string | null;
}

export interface PortalInvoice {
  number: string;
  amount: string;
  currency: string;
  status: "draft" | "sent" | "paid" | "overdue";
  issued_date: string | null;
  due_date: string | null;
}

export interface PortalUpdate {
  title: string;
  body: string;
  created_at: string;
}

export interface PortalProject {
  title: string;
  description: string;
  status: "planning" | "in_progress" | "review" | "completed" | "on_hold";
  progress: number;
  start_date: string | null;
  due_date: string | null;
  milestones: PortalMilestone[];
  invoices: PortalInvoice[];
  updates: PortalUpdate[];
}

export function getDemoProjects(): Promise<PortalProject[]> {
  return safe(apiFetch<PortalProject[]>("/api/v1/portal/demo/", REVALIDATE), []);
}
