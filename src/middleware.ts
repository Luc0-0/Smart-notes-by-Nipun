
import { NextResponse, type NextRequest } from 'next/server';
import { auth } from 'firebase-admin';
import { initAdminSDK } from './lib/firebase/firebase-admin';

initAdminSDK();

async function verifySessionCookie(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  if (!sessionCookie) {
    return null;
  }
  try {
    const decodedToken = await auth().verifySessionCookie(sessionCookie, true);
    return decodedToken;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const decodedToken = await verifySessionCookie(request);
  const isAuthenticated = !!decodedToken;

  if (pathname.startsWith('/app') && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === '/login' || pathname === '/signup') && isAuthenticated) {
    const appUrl = new URL('/app', request.url);
    return NextResponse.redirect(appUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/login', '/signup'],
};
