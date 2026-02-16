import Redis from "ioredis";

// Configuration
const REDIS_URL = process.env.REDIS_URL;
const RATE_LIMIT_MAX = 20; // requests
const RATE_LIMIT_WINDOW_SECONDS = 60; // 1 minute

// In-Memory Fallback
const memoryStore = new Map<string, { count: number; resetAt: number }>();

// Clean up memory store periodically
if (typeof setInterval !== "undefined") {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of memoryStore) {
            if (now > entry.resetAt) memoryStore.delete(key);
        }
    }, 5 * 60 * 1000); // Every 5 minutes
}

let redis: Redis | null = null;

if (REDIS_URL) {
    console.log("Initializing Redis Rate Limiter...");
    redis = new Redis(REDIS_URL);
    redis.on("error", (err) => {
        console.warn("Redis connection error:", err);
        // We could potentially switch `redis` to null here to trigger fallback
        // but ioredis handles reconnection limits.
    });
} else {
    console.warn("No REDIS_URL found. Using in-memory rate limiter (NOT RECOMMENDED FOR PRODUCTION).");
}

export async function rateLimit(identifier: string): Promise<{ success: boolean; limit: number; remaining: number }> {
    const now = Date.now();
    const windowKey = `rate_limit:${identifier}`;

    // --- Redis Strategy ---
    if (redis) {
        try {
            // Simple fixed window counter using Redis atomic increment and expire
            const multi = redis.multi();
            multi.incr(windowKey);
            multi.expire(windowKey, RATE_LIMIT_WINDOW_SECONDS, "NX"); // Set expiry only if not exists

            const results = await multi.exec();
            if (!results) throw new Error("Redis transaction failed");

            // results[0] is [error, count]
            const countError = results[0][0];
            const count = results[0][1] as number;

            if (countError) throw countError;

            const remaining = Math.max(0, RATE_LIMIT_MAX - count);

            return {
                success: count <= RATE_LIMIT_MAX,
                limit: RATE_LIMIT_MAX,
                remaining,
            };

        } catch (error) {
            console.error("Redis rate limit check failed, falling back to memory:", error);
            // Fallthrough to memory
        }
    }

    // --- In-Memory Strategy (Fallback or Default) ---
    const entry = memoryStore.get(identifier);

    if (!entry || now > entry.resetAt) {
        memoryStore.set(identifier, {
            count: 1,
            resetAt: now + (RATE_LIMIT_WINDOW_SECONDS * 1000)
        });
        return {
            success: true,
            limit: RATE_LIMIT_MAX,
            remaining: RATE_LIMIT_MAX - 1,
        };
    }

    if (entry.count >= RATE_LIMIT_MAX) {
        return {
            success: false,
            limit: RATE_LIMIT_MAX,
            remaining: 0,
        };
    }

    entry.count++;
    return {
        success: true,
        limit: RATE_LIMIT_MAX,
        remaining: RATE_LIMIT_MAX - entry.count,
    };
}
