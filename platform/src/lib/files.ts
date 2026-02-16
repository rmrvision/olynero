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

    // S3 Upload Strategy (Hybrid)
    const s3Key = `projects/${projectId}/${path}`;
    try {
        const { s3Client, BUCKET_NAME } = await import("@/lib/s3");
        const { PutObjectCommand } = await import("@aws-sdk/client-s3");

        await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: content,
            ContentType: "text/plain", // simplify for now
        }));
    } catch (e) {
        console.error("S3 Upload Failed:", e);
        // If S3 fails, we might want to throw or continue. 
        // For hybrid, let's continue to save to DB but NOT set s3Key? 
        // Or set s3Key and retry? 
        // Safest: Throw, so user knows save failed.
        throw new Error("Failed to save file to storage.");
    }

    return await db.file.upsert({
        where: {
            projectId_path: {
                projectId,
                path,
            },
        },
        update: {
            content, // Keep content in DB for now (Hybrid)
            s3Key,   // Record that we have it in S3
            version: { increment: 1 },
        },
        create: {
            projectId,
            path,
            content, // Keep content in DB
            s3Key,
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

    // Cleanup S3
    try {
        const file = await db.file.findUnique({
            where: { projectId_path: { projectId, path } },
            select: { s3Key: true }
        });

        if (file?.s3Key) {
            const { s3Client, BUCKET_NAME } = await import("@/lib/s3");
            const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
            await s3Client.send(new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: file.s3Key,
            }));
        }
    } catch (e) {
        console.warn("S3 Delete Warning:", e);
        // Continue to delete from DB even if S3 fails
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
            s3Key: true,
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
            s3Key: true,
        },
    });

    if (!file) return null;

    // S3 Read Strategy
    if (file.s3Key) {
        try {
            const { s3Client, BUCKET_NAME } = await import("@/lib/s3");
            const { GetObjectCommand } = await import("@aws-sdk/client-s3");

            const command = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: file.s3Key,
            });

            const response = await s3Client.send(command);
            // Helper to convert stream to string
            const str = await response.Body?.transformToString();
            if (str) return str;
        } catch (e) {
            console.error("S3 Read Error, falling back to DB:", e);
        }
    }

    return file.content || null;
}

export async function getProjectFilesBatch(projectId: string) {
    // Used for background hydration of WebContainer
    // For Migration Phase: We rely on DB 'content' being present (Hybrid approach)
    // which effectively makes this fast.
    // In future (S3-only), this would need parallel S3 fetches or a zip download.
    return await db.file.findMany({
        where: { projectId },
        select: {
            path: true,
            content: true,
        },
    });
}

