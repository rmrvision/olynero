import { auth } from "@/auth";
import { getProject } from "@/lib/projects";
import { getProjectFiles } from "@/lib/files";
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

    const files = await getProjectFiles(project.id);
    // Determine if read-only
    const isOwner = userId === project.userId;
    const isReadOnly = !isOwner;

    return <ProjectClientPage project={project} files={files} isReadOnly={isReadOnly} />;
}
