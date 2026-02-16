"use server";

import { auth } from "@/auth";
import { updateFile, deleteFileByPath } from "@/lib/files";
import { db } from "@/lib/db";

async function verifyProjectOwnership(projectId: string, userId: string) {
    const project = await db.project.findUnique({
        where: { id: projectId },
        select: { userId: true },
    });
    if (!project || project.userId !== userId) {
        throw new Error("Unauthorized: you do not own this project");
    }
    return project;
}

export async function saveFileAction(projectId: string, path: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    await verifyProjectOwnership(projectId, session.user.id);
    await updateFile(projectId, path, content);

    return { success: true };
}

export async function deleteFileAction(projectId: string, path: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    await verifyProjectOwnership(projectId, session.user.id);
    await deleteFileByPath(projectId, path);
    return { success: true };
}
