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
        <div className="min-h-full p-8 w-full max-w-[1600px] mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-400">
                        <Sparkles className="size-3" />
                        <span>AI-Native Workspace</span>
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Добро пожаловать, {session.user.name?.split(' ')[0]}
                        </h1>
                        <p className="text-neutral-400 max-w-lg">
                            Готовы создать что-то невероятное сегодня?
                        </p>
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <CreateProjectButton />
                </div>
            </header>

            <main className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                        Недавние проекты
                        <span className="flex h-5 items-center rounded-full bg-white/10 px-2 text-xs font-medium text-white">
                            {projects.length}
                        </span>
                    </h2>
                </div>

                {projects.length > 0 ? (
                    <ProjectGrid projects={projects} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-white/10 bg-white/5">
                        <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                            <Sparkles className="h-6 w-6 text-neutral-500" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-1">Нет проектов</h3>
                        <p className="text-neutral-400 mb-6">Создайте свой первый проект, чтобы начать работу</p>
                        <CreateProjectButton />
                    </div>
                )}
            </main>
        </div>
    );
}

