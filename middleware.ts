import { type NextRequest, NextResponse } from 'next/server';

import { createMiddlewareClient } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createMiddlewareClient(request);

    // Refresh session if expired - required for Server Components
    await supabase.auth.getSession();

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}
