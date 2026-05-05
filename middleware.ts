import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/hwaya")) {
    const { response, user } = await updateSupabaseSession(request);

    if (pathname.startsWith("/hwaya/dashboard") && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/hwaya/login";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/hwaya/login") && user) {
      const url = request.nextUrl.clone();
      url.pathname = "/hwaya/dashboard";
      return NextResponse.redirect(url);
    }

    return response;
  }

  if (pathname.startsWith("/wisdom") || pathname.startsWith("/discord")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/wisdom/:path*", "/discord/:path*", "/hwaya/:path*"]
};
