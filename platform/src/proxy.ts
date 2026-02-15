import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const auth = NextAuth(authConfig).auth;

export async function proxy(request: NextRequest) {
    const result = await auth(request as any);
    return result ?? NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
