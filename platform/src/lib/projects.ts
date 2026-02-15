import { db } from "@/lib/db";
import { Project } from "@prisma/client";

export async function createProject(userId: string, name: string, description?: string) {
    return await db.project.create({
        data: {
            userId,
            name,
            description,
        },
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
