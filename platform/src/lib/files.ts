import { db } from "@/lib/db";

export async function saveFile(projectId: string, path: string, content: string) {
    // Upsert file: update content if exists, create if not
    return await db.file.upsert({
        where: {
            projectId_path: {
                projectId,
                path,
            },
        },
        update: {
            content,
            version: { increment: 1 },
        },
        create: {
            projectId,
            path,
            content,
        },
    });
}

export async function getProjectFiles(projectId: string) {
    const files = await db.file.findMany({
        where: {
            projectId,
        },
        select: {
            path: true,
            content: true,
            version: true,
        },
    });

    // Convert flat list to tree structure if needed, or return flat Map
    return files;
}

export async function deleteFile(projectId: string, path: string) {
    return await db.file.delete({
        where: {
            projectId_path: {
                projectId,
                path,
            },
        },
    });
}
