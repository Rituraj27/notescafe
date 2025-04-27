import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    return NextResponse.json({
      authenticated: !!session,
      session: session
        ? {
            user: {
              email: session.user?.email,
              role: session.user?.role,
            },
          }
        : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Authentication test failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
