import { NextResponse, type NextRequest } from 'next/server';
import { auth as adminAuth } from 'firebase-admin';
import { getAdminApp } from '@/lib/firebase/firebase-admin';

export async function POST(request: NextRequest) {
  const adminApp = getAdminApp();
  try {
    const { idToken } = await request.json();
    
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    // Create the session cookie. This will also verify the ID token.
    const sessionCookie = await adminAuth(adminApp).createSessionCookie(idToken, { expiresIn });

    const options = {
      name: 'session',
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    };

    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.cookies.set(options);
    
    return response;

  } catch (error) {
    console.error('Session login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 401 });
  }
}
