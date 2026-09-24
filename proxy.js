import { NextResponse } from "next/server";

/**
 * proxy.js — injects x-pathname header so the root layout
 * can detect /admin routes server-side and skip Header/Footer.
 * (Renamed from middleware.js per Next.js 16 convention)
 */
export function proxy(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
