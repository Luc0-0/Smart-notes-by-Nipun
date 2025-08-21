import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('firebaseIdToken');
  const { pathname } = request.nextUrl;

  // If the user is trying to access the app and is not authenticated, redirect to login
  if (pathname.startsWith('/app') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user is authenticated and tries to access login/signup, redirect to the app
  if ((pathname === '/login' || pathname === '/signup' || pathname === '/') && token) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/login', '/signup', '/'],
};
