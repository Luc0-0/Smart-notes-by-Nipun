
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session')?.value;

  // Assume the user is not authenticated if there's no session cookie
  if (!sessionCookie) {
    if (pathname.startsWith('/app')) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // If there is a cookie, verify it by calling our internal API route
  const response = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
    headers: {
      Cookie: `session=${sessionCookie}`,
    },
  });

  const { isAuthenticated } = await response.json();

  // Redirect to login if trying to access protected routes without a valid session
  if (pathname.startsWith('/app') && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to app if trying to access login/signup while already authenticated
  if ((pathname === '/login' || pathname === '/signup') && isAuthenticated) {
    const appUrl = new URL('/app', request.url);
    return NextResponse.redirect(appUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/login', '/signup'],
};
