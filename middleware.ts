import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isProtectedApiRoute = request.nextUrl.pathname.startsWith('/api/prompts') || 
                               request.nextUrl.pathname.startsWith('/api/user');

  // If user is not authenticated and trying to access protected API routes
  if (!token && isProtectedApiRoute) {
    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 }
    );
  }

  // If user is authenticated and trying to access auth pages, redirect to home
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/prompts/:path*',
    '/api/user/:path*',
    '/auth/:path*',
  ],
};
