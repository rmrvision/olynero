import { db } from "@/lib/db";
import { FileSchema } from "@/lib/validation";

// Centralized Path Sanitization
export function isPathSafe(path: string): boolean {
    // Basic check first, then Zod
    if (path.includes('..') || path.startsWith('/') || path.includes('\0')) return false;

    const result = FileSchema.pick({ path: true }).safeParse({ path });
    return result.success;
}

export async function saveFile(projectId: string, path: string, content: string) {
    if (!isPathSafe(path)) {
        throw new Error(`Invalid file path: ${path}`);
    }

    // Validate content length
    const validation = FileSchema.safeParse({ path, content });
    if (!validation.success) {
        throw new Error(validation.error.issues[0].message);
    }

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
    if (!isPathSafe(path)) {
        throw new Error(`Invalid file path: ${path}`);
    }

    // Use deleteMany with composite filter — single query, no error if not found
    const result = await db.file.deleteMany({
        where: { projectId, path },
    });
    return result.count > 0 ? true : null;
}

// Optimized Fetching Logic for Lazy Loading

export async function getProjectFileTree(projectId: string) {
    return await db.file.findMany({
        where: { projectId },
        select: {
            id: true,
            path: true,
            version: true,
            // Content excluded for performance
        },
    });
}

export async function getFileContent(projectId: string, path: string) {
    const file = await db.file.findUnique({
        where: {
            projectId_path: {
                projectId,
                path,
            },
        },
        select: {
            content: true,
        },
    });
    return file?.content || null;
}

export async function getProjectFilesBatch(projectId: string) {
    // Used for background hydration of WebContainer
    return await db.file.findMany({
        where: { projectId },
        select: {
            path: true,
            content: true,
        },
    });
}
