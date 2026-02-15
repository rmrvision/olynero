import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
    providers: [
        Credentials({
            async authorize(credentials) {
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

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            // Always refresh role from DB so manual role changes take effect without re-login
            if (token.id) {
                const dbUser = await db.user.findUnique({
                    where: { id: token.id as string },
                    select: { role: true, isActive: true },
                });
                token.role = dbUser?.role ?? 'USER';
                token.isActive = dbUser?.isActive ?? true;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
                session.user.email = (token.email as string) ?? undefined;
                session.user.name = (token.name as string) ?? undefined;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
});
