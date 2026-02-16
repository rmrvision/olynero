import { db } from "@/lib/db";

export const DEFAULT_AI_limit = 1000;
export const DEFAULT_STORAGE_LIMIT = 50 * 1024 * 1024; // 50MB

export async function getUserUsage(userId: string) {
    const usage = await db.userUsage.findUnique({
        where: { userId },
    });

    if (!usage) {
        return await db.userUsage.create({
            data: {
                userId,
                limitAI: DEFAULT_AI_limit,
                limitStorage: DEFAULT_STORAGE_LIMIT,
            },
        });
    }

    return usage;
}

export async function checkAILimit(userId: string) {
    const usage = await getUserUsage(userId);

    if (usage.aiTokensUsed >= usage.limitAI) {
        throw new Error("AI Token Limit Exceeded. Please upgrade your plan.");
    }
}

export async function incrementAITokens(userId: string, tokens: number = 1) {
    await db.userUsage.update({
        where: { userId },
        data: {
            aiTokensUsed: {
                increment: tokens,
            },
        },
    });
}

export async function checkStorageLimit(userId: string, newFileSize: number) {
    const usage = await getUserUsage(userId);

    if (usage.storageUsedBytes + newFileSize > usage.limitStorage) {
        throw new Error("Storage Limit Exceeded. Please upgrade your plan.");
    }
}

export async function incrementStorage(userId: string, size: number) {
    await db.userUsage.update({
        where: { userId },
        data: {
            storageUsedBytes: {
                increment: size,
            },
        },
    });
}
