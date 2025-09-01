
import { NextResponse, type NextRequest } from 'next/server';
import { auth as adminAuth } from 'firebase-admin';
import { app as adminApp } from '@/lib/firebase/firebase-admin'; // Use the initialized app

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }
    
    // Verify the session cookie. This will throw an error if invalid.
    await adminAuth(adminApp).verifySessionCookie(sessionCookie, true);
    
    return NextResponse.json({ isAuthenticated: true }, { status: 200 });
  } catch (error) {
    // Session cookie is invalid or expired.
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}
