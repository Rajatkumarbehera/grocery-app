// import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const publicRoutes = ["/login", "/register", "/api/auth"];

  if (publicRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const session = await auth();

  // if (!token) {
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirectTo", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // const role = token.role;
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
