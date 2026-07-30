import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * On-demand ISR endpoint, called by Django's post_save signal when a
 * post is published/updated.
 *
 * Security: nginx never routes /api/* here (it goes to Django), so this
 * is only reachable inside the Docker network at http://nextjs:3000 —
 * and it still requires the shared secret as defense in depth.
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  let path: unknown;
  try {
    ({ path } = await request.json());
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof path !== "string" || !path.startsWith("/")) {
    return NextResponse.json(
      { message: "Body must be {\"path\": \"/blog/some-slug\"}" },
      { status: 400 },
    );
  }

  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path, now: Date.now() });
}
