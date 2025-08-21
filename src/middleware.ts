import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // The token check is handled by the client-side AuthProvider and AppLayout
  // This middleware is now only responsible for basic routing logic
  // if the user is already on a page that requires auth.
  // The actual redirect for unauthenticated users happens on the client.

  if (pathname === '/login' || pathname === '/signup') {
    // Let the user access login/signup pages
    return NextResponse.next();
  }

  if (pathname.startsWith('/app')) {
    // Let the client-side auth check handle redirection
    // for the app routes.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/login', '/signup'],
};
