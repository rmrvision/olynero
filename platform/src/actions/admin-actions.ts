"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Middleware should handle general protection, but we double-check here
async function checkAdmin() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
    }
    return session;
}

export async function getUsersAction() {
    await checkAdmin();

    try {
        const users = await db.user.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { projects: true },
                },
                usage: true,
            },
        });
        return { success: true, users };
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return { error: "Failed to fetch users" };
    }
}

export async function updateUserRoleAction(userId: string, role: UserRole) {
    await checkAdmin();

    try {
        await db.user.update({
            where: { id: userId },
            data: { role },
        });
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update user role" };
    }
}

export async function banUserAction(userId: string, isActive: boolean) {
    await checkAdmin();

    try {
        await db.user.update({
            where: { id: userId },
            data: { isActive },
        });
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update user status" };
    }
}
