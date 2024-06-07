import { type NextRequest } from 'next/server';

import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /**
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/webpack-hmr (HMR files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest file)
     * - .(svg|png|jpg|jpeg|gif|webp) (image files)
     */
    '/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
