import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // --- Exclude paths we don't want to process ---
  // static files (contains a dot), next internals, API routes, favicon
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // --- Normalize case: redirect to lowercase if any uppercase letter present ---
  if (/[A-Z]/.test(pathname)) {
    // nextUrl already contains the origin + search params
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 308);
  }

  // --- Auth check for the protected area (only /list routes) ---
  // skip auth for /auth pages
  if (pathname.startsWith('/list') && !pathname.startsWith('/auth')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const signInUrl = new URL('/auth', request.url);
      signInUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // run middleware for all pages, but we're excluding internals above
  matcher: '/:path*',
};
