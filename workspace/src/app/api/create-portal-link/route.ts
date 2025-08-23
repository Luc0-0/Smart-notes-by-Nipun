
import { NextResponse } from 'next/server';

// Billing is temporarily disabled.
export async function POST(request: Request) {
  return NextResponse.json({ error: { message: 'Billing is temporarily disabled.' } }, { status: 503 });
}
