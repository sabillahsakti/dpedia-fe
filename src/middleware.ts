import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/profile", "/subscription", "/payment", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = protectedPrefixes.some((path) => pathname.startsWith(path));
  const token = request.cookies.get("dpedia_access_token")?.value;

  if (needsAuth && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
