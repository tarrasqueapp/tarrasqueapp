import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { config } from '../../../lib/config';
import { createClient } from '../../../utils/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.exchangeCodeForSession(code);
  }

  const next = requestUrl.searchParams.get('next') || requestUrl.origin;

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${config.HOST}${next}`);
}
