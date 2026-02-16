import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import { z } from 'zod';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Validate critical environment variables (only log warnings, don't throw during build)
// Note: AUTH_SECRET may not be available during build time but should be set at runtime
if (!process.env.AUTH_SECRET) {
    const env = process.env.NODE_ENV || 'development';
    console.warn(`[Auth] ⚠️  AUTH_SECRET is not set (env: ${env}). Make sure it's set in your deployment environment variables.`);
} else {
    // Only log in development to avoid noise in production logs
    if (process.env.NODE_ENV !== 'production') {
        console.log('[Auth] ✓ AUTH_SECRET is set');
    }
}

if (process.env.AUTH_URL && process.env.NODE_ENV !== 'production') {
    console.log(`[Auth] ✓ AUTH_URL is set to: ${process.env.AUTH_URL}`);
} else if (!process.env.AUTH_URL) {
    console.warn('[Auth] ⚠️  AUTH_URL is not set. NextAuth will try to detect it automatically.');
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
                    console.log('[Auth] Credentials authorize called');
                    
                    const parsedCredentials = z
                        .object({ email: z.string().email(), password: z.string().min(6) })
                        .safeParse(credentials);

                    if (!parsedCredentials.success) {
                        console.log('[Auth] Credentials validation failed:', parsedCredentials.error.format());
                        return null;
                    }

                    const { email, password } = parsedCredentials.data;
                    console.log(`[Auth] Attempting to find user with email: ${email}`);

                    const user = await db.user.findUnique({ where: { email } });
                    
                    if (!user) {
                        console.log(`[Auth] User not found for email: ${email}`);
                        return null;
                    }

                    if (!user.password) {
                        console.log(`[Auth] User found but has no password (likely OAuth user): ${email}`);
                        return null;
                    }

                    console.log(`[Auth] Comparing password for user: ${user.id}`);
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    
                    if (passwordsMatch) {
                        console.log(`[Auth] Password match! Returning user: ${user.id}`);
                        // Return only the fields NextAuth needs - avoid serialization issues
                        return {
                            id: user.id,
                            email: user.email!,
                            name: user.name || undefined,
                            image: user.image || undefined,
                            role: (user as any).role || 'USER',
                        };
                    } else {
                        console.log(`[Auth] Password mismatch for user: ${user.id}`);
                        return null;
                    }
                } catch (err) {
                    console.error('[Auth] Credentials authorize error:', err);
                    // Log full error details
                    if (err instanceof Error) {
                        console.error('[Auth] Error message:', err.message);
                        console.error('[Auth] Error stack:', err.stack);
                    }
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
            try {
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
            } catch (err) {
                console.error('[Auth] JWT callback error:', err);
                if (err instanceof Error) {
                    console.error('[Auth] Error message:', err.message);
                    console.error('[Auth] Error stack:', err.stack);
                }
                throw err;
            }
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
                    });
                    session.user.role = (dbUser as any)?.role ?? 'USER';
                } catch (err) {
                    console.error('[Auth] Session callback DB error:', err);
                    if (err instanceof Error) {
                        console.error('[Auth] Error message:', err.message);
                        console.error('[Auth] Error stack:', err.stack);
                    }
                }
            }
            return session;
        },
    },
});
