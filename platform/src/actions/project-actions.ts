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
