import { NextResponse, type NextRequest } from 'next/server';
import { auth as adminAuth } from 'firebase-admin';
import { getAdminApp } from '@/lib/firebase/firebase-admin';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    const adminApp = getAdminApp();
    const sessionCookie = cookies().get('session')?.value;

    if (!sessionCookie) {
        return NextResponse.json({ status: 'already logged out' }, { status: 200 });
    }

    try {
        const decodedClaims = await adminAuth(adminApp).verifySessionCookie(sessionCookie);
        await adminAuth(adminApp).revokeRefreshTokens(decodedClaims.sub);
    } catch (error) {
        // Ignore errors if the cookie is invalid.
        console.log("Error revoking refresh tokens, maybe session already expired:", error);
    }

    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.cookies.set({
        name: 'session',
        value: '',
        maxAge: -1,
    });
    
    return response;
}
