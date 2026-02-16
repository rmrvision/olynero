"use server";

import { auth } from "@/auth";
import { getUserUsage } from "@/lib/usage";

export async function getUserUsageAction() {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        const usage = await getUserUsage(session.user.id);
        return { success: true, usage };
    } catch (e) {
        return { error: "Failed to fetch usage data" };
    }
}
