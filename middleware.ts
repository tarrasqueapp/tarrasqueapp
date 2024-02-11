import { type NextRequest, NextResponse } from 'next/server';

import { createMiddlewareClient } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createMiddlewareClient(request);

    // Refresh session if expired - required for Server Components
    await supabase.auth.getSession();

    return response;
  } catch (error) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: [
    /**
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - manifest.json (PWA manifest file)
     */
    '/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon.ico|images|manifest.json).*)',
  ],
};
