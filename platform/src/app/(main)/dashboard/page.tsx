import { auth } from "@/auth";
import { getUserProjects, createProject } from "@/lib/projects";
import { redirect } from "next/navigation";
import { Plus, Folder } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CreateProjectButton } from "@/components/create-project-button";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const projects = await getUserProjects(session.user.id);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Мои Проекты</h1>
                    <p className="text-muted-foreground">Управляйте своими AI-приложениями.</p>
                </div>
                <CreateProjectButton />
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-20 border border-dashed rounded-xl bg-muted/30">
                    <div className="mx-auto size-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Folder className="size-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Нет проектов</h3>
                    <p className="text-muted-foreground mb-6">Создайте свой первый проект, чтобы начать.</p>
                    <CreateProjectButton />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Link key={project.id} href={`/project/${project.id}`}>
                            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer group">
                                <CardHeader>
                                    <CardTitle className="group-hover:text-primary transition-colors">{project.name}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {project.description || "Без описания"}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="text-xs text-muted-foreground">
                                    Обновлено: {new Date(project.updatedAt).toLocaleDateString()}
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
