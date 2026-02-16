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
