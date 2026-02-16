import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    trustHost: true, // required behind proxy / custom domain (e.g. olynero.com) to avoid 500 on /api/auth/session
    pages: {
        signIn: '/login',
    },
    providers: [
        // Added later in auth.ts
    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnProject = nextUrl.pathname.startsWith('/project');
            const isOnSettings = nextUrl.pathname.startsWith('/settings');
            const isOnProfile = nextUrl.pathname.startsWith('/profile');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            // Admin routes: require login + ADMIN role
            if (isOnAdmin) {
                if (!isLoggedIn) return false;
                const role = (auth?.user as any)?.role;
                if (role !== 'ADMIN') {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
                return true;
            }

            // Protected user routes
            if (isOnProject || isOnSettings || isOnProfile) {
                if (isLoggedIn) return true;
                return false;
            } else if (isLoggedIn) {
                if (nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register')) {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
