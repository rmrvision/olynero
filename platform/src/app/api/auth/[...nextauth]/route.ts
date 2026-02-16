import { handlers } from "@/auth"

// Export handlers directly - NextAuth v5 handles errors internally
// Additional error logging is in auth.ts authorize callback
export const { GET, POST } = handlers;
