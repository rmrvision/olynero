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

            if (isOnChat || isOnSettings) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                // Redirect logged-in users away from auth pages to chat
                // However, we might want to let them browse marketing pages.
                // Let's only redirect if they are on /login or /register
                if (nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register')) {
                    return Response.redirect(new URL('/chat', nextUrl));
                }
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
