import { auth } from "@/auth";
import { getUserProjects } from "@/lib/projects";
import { redirect } from "next/navigation";
import { ProjectGrid } from "@/components/dashboard/project-grid";
import { DashboardPrompt } from "@/components/dashboard/dashboard-prompt";
import { DashboardHeroHeading } from "@/components/dashboard/dashboard-hero-heading";
import { DashboardAnimatedBackground } from "@/components/dashboard/dashboard-animated-background";

export default async function DashboardPage() {
    let session;
    try {
        session = await auth();
    } catch (e) {
        console.error("[Dashboard] auth() failed:", e);
        redirect("/login");
    }
    if (!session?.user?.id) {
        redirect("/login");
    }

    let projects: Awaited<ReturnType<typeof getUserProjects>>;
    try {
        projects = await getUserProjects(session.user.id);
    } catch (e) {
        console.error("[Dashboard] getUserProjects failed:", e);
        projects = [];
    }

    return (
        <div className="min-h-full w-full flex flex-col">
            {/* Hero section with animated gradient */}
            <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24 overflow-hidden">
                <DashboardAnimatedBackground />

                <div className="relative z-10 text-center max-w-3xl mx-auto mb-12">
                    <DashboardHeroHeading />
                    <p className="text-lg md:text-xl text-neutral-400 mb-10">
                        Создавайте приложения и сайты, общаясь с ИИ
                    </p>
                    <DashboardPrompt />
                </div>
            </div>

            {/* Projects section - "From the Community" style */}
            <div className="border-t border-white/5 bg-zinc-950/50">
                <div className="max-w-[1600px] mx-auto px-6 py-10">
                    <h2 className="text-xl font-semibold text-white mb-6">
                        Мои проекты
                    </h2>
                    <ProjectGrid projects={projects} />
                </div>
            </div>
        </div>
    );
}
