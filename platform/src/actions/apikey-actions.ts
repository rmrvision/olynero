"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import crypto from "crypto";

function generateApiKey(): string {
    const raw = crypto.randomBytes(32).toString("hex");
    return `olyn_${raw}`;
}

function hashKey(key: string): string {
    return crypto.createHash("sha256").update(key).digest("hex");
}

export async function createApiKey(name: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    if (!name || name.trim().length === 0) {
        return { error: "Название ключа обязательно" };
    }

    // Limit to 5 keys per user
    const count = await db.apiKey.count({ where: { userId: session.user.id } });
    if (count >= 5) {
        return { error: "Максимум 5 API-ключей на аккаунт" };
    }

    const rawKey = generateApiKey();
    const hashedKey = hashKey(rawKey);
    const prefix = rawKey.slice(0, 12) + "...";

    await db.apiKey.create({
        data: {
            name: name.trim(),
            key: hashedKey,
            prefix,
            userId: session.user.id,
        },
    });

    // Return the raw key ONLY on creation — it won't be shown again
    return { success: true, key: rawKey };
}

export async function getApiKeys() {
    const session = await auth();
    if (!session?.user?.id) {
        return [];
    }

    const keys = await db.apiKey.findMany({
        where: { userId: session.user.id },
        select: {
            id: true,
            name: true,
            prefix: true,
            lastUsedAt: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return keys;
}

export async function deleteApiKey(keyId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    await db.apiKey.deleteMany({
        where: {
            id: keyId,
            userId: session.user.id,
        },
    });

    return { success: true };
}
