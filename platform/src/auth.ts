import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import { z } from 'zod';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Required for NextAuth v5; missing it causes 500 "server configuration" on callback
if (!process.env.AUTH_SECRET && process.env.NODE_ENV === 'production') {
    console.error('[Auth] AUTH_SECRET is not set. Set it in your deployment env (e.g. Vercel/Amplify).');
}

// GitHub: create an "OAuth App" (not "GitHub App") at https://github.com/settings/developers
// Callback URL must be exactly: https://olynero.com/api/auth/callback/github (no trailing space)
export const useGitHub = !!(process.env.GITHUB_ID && process.env.GITHUB_SECRET);

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
    providers: [
        Credentials({
            async authorize(credentials) {
                try {
                    const parsedCredentials = z
                        .object({ email: z.string().email(), password: z.string().min(6) })
                        .safeParse(credentials);

                    if (parsedCredentials.success) {
                        const { email, password } = parsedCredentials.data;

                        const user = await db.user.findUnique({ where: { email } });
                        if (!user || !user.password) return null;

                        const passwordsMatch = await bcrypt.compare(password, user.password);
                        if (passwordsMatch) return user;
                    }

                    return null;
                } catch (err) {
                    console.error('[Auth] Credentials authorize error:', err);
                    throw err;
                }
            },
        }),
        ...(useGitHub
            ? [
                  GitHub({
                      clientId: process.env.GITHUB_ID!,
                      clientSecret: process.env.GITHUB_SECRET!,
                      authorization: {
                          params: {
                              scope: 'read:user user:email repo',
                          },
                      },
                  }),
              ]
            : []),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.picture = user.image;
                token.role = (user as any).role;
            }
            if (token.id) {
                token.role = (token.role as string) ?? 'USER';
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
                session.user.email = (token.email as string) ?? undefined;
                session.user.name = (token.name as string) ?? undefined;
                session.user.image = (token.picture as string) ?? undefined;
                try {
                    // Always fetch role from DB on every request so manual changes take effect
                    const dbUser = await db.user.findUnique({
                        where: { id: token.id as string },
                        select: { role: true },
                    });
                    session.user.role = dbUser?.role ?? 'USER';
                } catch (err) {
                    console.error('[Auth] Session callback DB error:', err);
                }
            }
            return session;
        },
    },
});
