import { NextResponse, type NextRequest } from "next/server";

/** HTTP Basic auth for /admin. Disabled (404) when ADMIN_PASSWORD is unset. */
export function middleware(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return new NextResponse("Not found", { status: 404 });
  const header = req.headers.get("authorization") ?? "";
  const [scheme, encoded] = header.split(" ");
  if (scheme === "Basic" && encoded) {
    const [, pass] = atob(encoded).split(":");
    if (pass === password) return NextResponse.next();
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="admin"' },
  });
}

export const config = { matcher: ["/admin/:path*"] };
