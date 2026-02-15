import { auth } from "@/auth";
import { getUserProjects } from "@/lib/projects";
import { redirect } from "next/navigation";
import { ProjectGrid } from "@/components/dashboard/project-grid";
import { CreateProjectButton } from "@/components/create-project-button";
import { Sparkles } from "lucide-react";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const projects = await getUserProjects(session.user.id);

    return (
        <div className="min-h-screen bg-black">
            {/* Background Gradients */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black pointer-events-none" />

            <div className="relative z-10 p-8 max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 pt-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-4">
                            <Sparkles className="size-3" />
                            <span>AI-Native Workspace</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-3">
                            Welcome back, {session.user.name?.split(' ')[0]}
                        </h1>
                        <p className="text-lg text-neutral-400 max-w-lg">
                            Ready to build something extraordinary immediately?
                        </p>
                    </div>
                    <div>
                        <CreateProjectButton />
                    </div>
                </header>

                <main>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            Recent Projects
                            <span className="text-sm font-normal text-neutral-500 bg-white/5 px-2 py-0.5 rounded-full">
                                {projects.length}
                            </span>
                        </h2>
                    </div>

                    <ProjectGrid projects={projects} />
                </main>
            </div>
        </div>
    );
}
