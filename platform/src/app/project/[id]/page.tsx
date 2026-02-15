import { auth } from "@/auth";
import { getProject } from "@/lib/projects";
import { getProjectFiles } from "@/lib/files";
import { redirect, notFound } from "next/navigation";
import ProjectClientPage from "./client-page";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const project = await getProject(id, session.user.id);

    if (!project) {
        notFound();
    }

    const files = await getProjectFiles(project.id);

    return <ProjectClientPage project={project} files={files} />;
}
