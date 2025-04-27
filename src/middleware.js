import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Define which paths are protected admin routes
  const isAdminPath =
    path.startsWith('/admin/dashboard') ||
    path.startsWith('/admin/notes') ||
    path.startsWith('/admin/users');

  // Define public paths that don't need authentication
  const isPublicPath = path === '/login';

  const token = await getToken({
    req: request,
    secret:
      process.env.NEXTAUTH_SECRET || 'your-fallback-secret-should-be-in-env',
  });

  // Redirect logic for admin routes
  if (isAdminPath) {
    // If not logged in, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If user is not an admin, redirect to homepage
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If already logged in and trying to access login page, redirect based on role
  if (isPublicPath && token) {
    if (token.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths this middleware applies to
export const config = {
  matcher: ['/admin/:path*', '/login'],
};
