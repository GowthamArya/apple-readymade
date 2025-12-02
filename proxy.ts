import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if (/[A-Z]/.test(pathname)) {
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 308);
  }

  if ((pathname.startsWith('/list') || pathname.startsWith('/api/push') || pathname.startsWith('/api/generic')) && !pathname.startsWith('/auth')) {
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
  matcher: '/:path*',
};
