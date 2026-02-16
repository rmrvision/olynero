import { auth } from "@/auth";
import { getProject } from "@/lib/projects";
import { getProjectFileTree } from "@/lib/files";
import { redirect, notFound } from "next/navigation";
import ProjectClientPage from "./client-page";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    const project = await getProject(id, userId);

    if (!project) {
        if (!userId) {
            redirect("/login");
        }
        notFound();
    }

    const fileTree = await getProjectFileTree(project.id);
    // Determine if read-only
    const isOwner = userId === project.userId;
    const isReadOnly = !isOwner;

    return <ProjectClientPage project={project} initialFileTree={fileTree} isReadOnly={isReadOnly} />;
}
