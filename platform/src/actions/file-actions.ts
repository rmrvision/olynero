"use server";

import { auth } from "@/auth";
import { updateFile, deleteFileByPath } from "@/lib/files";
import { db } from "@/lib/db";
import { FileSchema } from "@/lib/validation";

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

    const validation = FileSchema.safeParse({ path, content });
    if (!validation.success) {
        throw new Error(validation.error.issues[0].message);
    }

    await updateFile(projectId, path, content);

    return { success: true };
}

export async function deleteFileAction(projectId: string, path: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    await verifyProjectOwnership(projectId, session.user.id);

    const validation = FileSchema.pick({ path: true }).safeParse({ path });
    if (!validation.success) {
        throw new Error(validation.error.issues[0].message);
    }

    await deleteFileByPath(projectId, path);
    return { success: true };
}

export async function getFileContentAction(projectId: string, path: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await verifyProjectOwnership(projectId, session.user.id);

    const validation = FileSchema.pick({ path: true }).safeParse({ path });
    if (!validation.success) {
        throw new Error(validation.error.issues[0].message);
    }

    const { getFileContent } = await import("@/lib/files");
    const content = await getFileContent(projectId, path);
    return { success: true, content };
}

export async function getProjectFilesBatchAction(projectId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await verifyProjectOwnership(projectId, session.user.id);
    const { getProjectFilesBatch } = await import("@/lib/files");
    const files = await getProjectFilesBatch(projectId);
    return { success: true, files };
}
