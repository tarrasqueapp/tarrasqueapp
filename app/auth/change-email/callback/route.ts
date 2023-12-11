import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { createServerClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const token_hash = searchParams.get('token_hash');
  const next = searchParams.get('next') ?? '/';

  if (token_hash) {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);

    const { error } = await supabase.auth.verifyOtp({ type: 'email_change', token_hash });
    console.log(error);
    if (!error) {
      return NextResponse.redirect(new URL(`/${next.slice(1)}`, req.url));
    }
  }

  return NextResponse.redirect(new URL('/', req.url));
}
