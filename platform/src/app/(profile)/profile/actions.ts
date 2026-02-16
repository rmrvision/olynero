"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function getProjectCount(): Promise<number> {
    const session = await auth();
    if (!session?.user?.id) return 0;
    return db.project.count({
        where: { userId: session.user.id },
    });
}

export async function getTokenUsage(): Promise<{ used: number; limit: number }> {
    const session = await auth();
    if (!session?.user?.id) return { used: 0, limit: 100000 };

    // Get user's project IDs first
    const projects = await db.project.findMany({
        where: { userId: session.user.id },
        select: { id: true },
    });

    const projectIds = projects.map((p: { id: string }) => p.id);

    if (projectIds.length === 0) return { used: 0, limit: 100000 };

    // Count assistant messages across user's projects as a proxy for token usage
    const messageCount = await db.message.count({
        where: {
            role: "assistant",
            projectId: { in: projectIds },
        },
    });

    // Approximate: ~500 tokens per assistant message
    const estimatedTokens = messageCount * 500;
    const limit = 100000; // Free tier limit

    return { used: Math.min(estimatedTokens, limit), limit };
}
