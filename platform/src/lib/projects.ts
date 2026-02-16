import { db } from "@/lib/db";

import { TEMPLATES } from "@/lib/templates";

export async function createProject(userId: string, name: string, description?: string, templateName: string = "react-vite", isPublic: boolean = false) {
    const project = await db.project.create({
        data: {
            userId,
            name,
            description,
            isPublic,
        },
    });

    await seedProjectFiles(project.id, templateName);

    return project;
}

async function seedProjectFiles(projectId: string, templateName: string) {
    const template = TEMPLATES[templateName] || TEMPLATES["react-vite"];

    // Batch insert files
    // Prisma createMany is supported in most SQL dbs
    await db.file.createMany({
        data: template.map(file => ({
            projectId,
            path: file.path,
            content: file.content
        }))
    });
}

export async function getProject(projectId: string, userId?: string) {
    const project = await db.project.findUnique({
        where: {
            id: projectId,
        },
        // Files are now fetched separately via getProjectFileTree
    });

    if (!project || project.deletedAt) return null;

    // Access control:
    // 1. Owner can access
    // 2. Public project can be accessed by anyone
    const isOwner = userId && project.userId === userId;
    const isPublic = project.isPublic;

    if (isOwner || isPublic) {
        return project;
    }

    return null;
}

export async function getUserProjects(userId: string) {
    return await db.project.findMany({
        where: {
            userId,
            deletedAt: null,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
}

export async function deleteProject(projectId: string, userId: string) {
    // Soft delete
    return await db.project.update({
        where: {
            id: projectId,
            userId,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

export async function updateProjectVisibility(projectId: string, userId: string, isPublic: boolean) {
    return await db.project.update({
        where: {
            id: projectId,
            userId, // Ensure owner
        },
        data: {
            isPublic,
        },
    });
}

export async function updateProject(projectId: string, userId: string, data: { name?: string; description?: string }) {
    return await db.project.update({
        where: {
            id: projectId,
            userId,
        },
        data: {
            ...data,
        },
    });
}
