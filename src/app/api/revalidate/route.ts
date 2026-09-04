import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const secret =
      req.nextUrl.searchParams.get("secret") ||
      req.headers.get("sanity-webhook-secret") ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

    // Verify secret if configured in environment
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json(
        { message: "Invalid revalidation secret" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const docType = body?._type;

    // Revalidate entire site cache on-demand
    revalidatePath("/", "layout");
    revalidatePath("/blog", "layout");

    // If a specific blog post changed, revalidate its page
    if (docType === "post" && (body?.slug || body?.slug?.current)) {
      const slug = typeof body.slug === "string" ? body.slug : body.slug.current;
      revalidatePath(`/blog/${slug}`, "page");
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: Date.now(),
      type: docType || "full-site",
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Revalidation failed" },
      { status: 500 }
    );
  }
}
