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

export async function updateFile(projectId: string, path: string, content: string) {
    // Upsert: Create if not exists, update if exists
    // We use findFirst to find by composite key (projectId + path) if strictly enforcing one file per path per project
    // But since we don't have a unique constraint on (projectId, path) in schema yet (checked previously), 
    // we should validly use findFirst and update, or create.

    const existingFile = await db.file.findFirst({
        where: {
            projectId,
            path
        }
    });

    if (existingFile) {
        return await db.file.update({
            where: { id: existingFile.id },
            data: { content, updatedAt: new Date() }
        });
    } else {
        return await db.file.create({
            data: {
                projectId,
                path,
                content
            }
        });
    }
}

export async function deleteFile(fileId: string) {
    return await db.file.delete({
        where: {
            id: fileId,
        },
    });
}

export async function deleteFileByPath(projectId: string, path: string) {
    const file = await db.file.findFirst({
        where: { projectId, path }
    });
    if (file) {
        return await db.file.delete({ where: { id: file.id } });
    }
    return null;
}
