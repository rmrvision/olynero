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

export async function getProject(projectId: string, userId: string) {
    return await db.project.findUnique({
        where: {
            id: projectId,
            userId, // Security: Ensure user owns the project
        },
        include: {
            files: true,
        },
    });
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
