import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    providers: [
        // Added later in auth.ts
    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnChat = nextUrl.pathname.startsWith('/chat');
            const isOnSettings = nextUrl.pathname.startsWith('/settings');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            // Admin routes: require login + ADMIN role
            if (isOnAdmin) {
                if (!isLoggedIn) return false;
                const role = (auth?.user as any)?.role;
                if (role !== 'ADMIN') {
                    return Response.redirect(new URL('/chat', nextUrl));
                }
                return true;
            }

            // Protected user routes
            if (isOnChat || isOnSettings) {
                if (isLoggedIn) return true;
                return false;
            } else if (isLoggedIn) {
                if (nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register')) {
                    return Response.redirect(new URL('/chat', nextUrl));
                }
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
