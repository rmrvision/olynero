"use server";

import { auth } from "@/auth";
import { updateFile, deleteFileByPath } from "@/lib/files";
import { revalidatePath } from "next/cache";

export async function saveFileAction(projectId: string, path: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    // TODO: Verify project ownership here for better security
    // const project = await getProject(projectId, session.user.id);
    // if (!project) throw new Error("Unauthorized");

    await updateFile(projectId, path, content);

    // Optional: Revalidate if we want server-side refreshes, but for IDE we mostly rely on client state
    // revalidatePath(`/project/${projectId}`); 

    return { success: true };
}

export async function deleteFileAction(projectId: string, path: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    await deleteFileByPath(projectId, path);
    return { success: true };
}
