import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT_SHA || '1e4fc8a8764a5e810beb5609d2db828e36501db5';
  const appEnv = process.env.APP_ENV || process.env.VERCEL_ENV || 'staging';
  const builtAt = new Date().toISOString();

  return NextResponse.json({
    commit,
    appEnv,
    builtAt,
  });
}
