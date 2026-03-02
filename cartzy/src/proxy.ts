import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const response = NextResponse.next();
  const session = await auth();

  if (!session) {
    const guestId = req.cookies.get("guestId")?.value;
    console.log("before", guestId);

    if (!guestId) {
      response.cookies.set("guestId", crypto.randomUUID(), {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });
    }
    console.log("after", guestId);
  }

  const legacyPrefixes = ["/", "/login", "/register", "/user/cart", "/search"];

  if (legacyPrefixes.some((prefix) => pathname === prefix)) {
    return response;
  }

  if (!session) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirectTo", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  const role = session?.user?.role;

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (pathname.startsWith("/customer") && role !== "customer") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (pathname.startsWith("/delivery_partner") && role !== "delivery_partner") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
