import { db } from "@/lib/db";
import { Project } from "@prisma/client";

import { TEMPLATES } from "@/lib/templates";

export async function createProject(userId: string, name: string, description?: string, templateName: string = "react-vite") {
    const project = await db.project.create({
        data: {
            userId,
            name,
            description,
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
        include: {
            files: true,
        },
    });

    if (!project) return null;

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
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
}

export async function deleteProject(projectId: string, userId: string) {
    return await db.project.delete({
        where: {
            id: projectId,
            userId,
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
