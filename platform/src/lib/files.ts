import { db } from "@/lib/db";

export async function saveFile(projectId: string, path: string, content: string) {
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

// Alias for backwards compatibility — both names call the same upsert logic
export const updateFile = saveFile;

export async function getProjectFiles(projectId: string) {
    return await db.file.findMany({
        where: { projectId },
        select: {
            path: true,
            content: true,
            version: true,
        },
    });
}

export async function deleteFile(fileId: string) {
    return await db.file.delete({
        where: { id: fileId },
    });
}

export async function deleteFileByPath(projectId: string, path: string) {
    // Use deleteMany with composite filter — single query, no error if not found
    const result = await db.file.deleteMany({
        where: { projectId, path },
    });
    return result.count > 0 ? true : null;
}
