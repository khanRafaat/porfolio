/**
 * Server-side fetch helper for the Django API.
 *
 * On the server (RSC, generateStaticParams, sitemap) we talk to Django
 * directly over the Docker network — no nginx hop. Browser code goes
 * through nginx at /api/* on the same origin.
 */
const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? "http://django:8000";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_INTERNAL_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new ApiError(res.status, `API request failed: ${res.status} ${path}`);
  }

  return res.json() as Promise<T>;
}
