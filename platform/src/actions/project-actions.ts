"use server";

import { auth } from "@/auth";
import { createProject } from "@/lib/projects";
import { revalidatePath } from "next/cache";

export async function createProjectAction(name: string, description?: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const project = await createProject(session.user.id, name, description);

    revalidatePath("/dashboard");

    return { success: true, projectId: project.id };
}

export async function createProjectFromPromptAction(prompt: string, isPublic: boolean = false) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const name = prompt.trim().slice(0, 80) || "Новый проект";
    const project = await createProject(session.user.id, name, prompt.trim(), "react-vite", isPublic);

    revalidatePath("/dashboard");

    return { success: true, projectId: project.id };
}

export async function updateProjectVisibilityAction(projectId: string, isPublic: boolean) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const { updateProjectVisibility } = await import("@/lib/projects");
    await updateProjectVisibility(projectId, session.user.id, isPublic);

    revalidatePath(`/project/${projectId}`);
    return { success: true };
}

export async function updateProjectAction(projectId: string, data: { name?: string; description?: string }) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const { ProjectUpdateSchema } = await import("@/lib/validation");
    const validation = ProjectUpdateSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0].message };
    }

    const { updateProject } = await import("@/lib/projects");
    await updateProject(projectId, session.user.id, validation.data);

    revalidatePath("/dashboard");
    revalidatePath(`/project/${projectId}`);
    return { success: true };
}

export async function deleteProjectAction(projectId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const { deleteProject } = await import("@/lib/projects");
    await deleteProject(projectId, session.user.id);

    revalidatePath("/dashboard");
    return { success: true };
}
