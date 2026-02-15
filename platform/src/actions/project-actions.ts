"use server";

import { auth } from "@/auth";
import { createProject } from "@/lib/projects";
import { revalidatePath } from "next/cache";

export async function createProjectAction(name: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const project = await createProject(session.user.id, name);

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
