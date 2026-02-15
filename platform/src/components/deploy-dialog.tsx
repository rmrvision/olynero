"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, Cloud, Box } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateDockerfileAction } from "@/actions/deployment-actions";

interface DeployDialogProps {
    project: {
        id: string;
        githubRepo?: string | null;
        name: string;
    };
}

export function DeployDialog({ project }: DeployDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleVercel = () => {
        if (!project.githubRepo) return;
        const url = `https://vercel.com/import/project?repository-url=https://github.com/${project.githubRepo}`;
        window.open(url, '_blank');
    };

    const handleNetlify = () => {
        if (!project.githubRepo) return;
        const url = `https://app.netlify.com/start/deploy?repository=https://github.com/${project.githubRepo}`;
        window.open(url, '_blank');
    };

    const handleDocker = async () => {
        setIsLoading(true);
        try {
            const result = await generateDockerfileAction(project.id);
            if (result.success) {
                toast.success("Dockerfile успешно создан!");
            } else {
                toast.error(result.message || "Ошибка при создании Dockerfile");
            }
        } catch (error) {
            toast.error("Произошла ошибка");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-white/5 gap-2">
                    <Rocket className="w-4 h-4" />
                    Деплой
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Развернуть проект</DialogTitle>
                    <DialogDescription className="text-neutral-400">
                        Выберите провайдера для деплоя вашего приложения. Для Vercel/Netlify требуется подключенный репозиторий GitHub.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Button
                        disabled={!project.githubRepo}
                        onClick={handleVercel}
                        className="w-full justify-start bg-black border border-white/10 hover:bg-white/5 text-white"
                    >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 1155 1000" fill="currentColor">
                            <path d="M577.344 0L1154.69 1000H0L577.344 0Z" />
                        </svg>
                        Деплой на Vercel
                    </Button>
                    <Button
                        disabled={!project.githubRepo}
                        onClick={handleNetlify}
                        className="w-full justify-start bg-[#00ad9f]/10 border border-[#00ad9f]/20 text-[#00ad9f] hover:bg-[#00ad9f]/20"
                    >
                        <Cloud className="mr-2 h-4 w-4" />
                        Деплой на Netlify
                    </Button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-zinc-950 px-2 text-neutral-500">Self-Hosting</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleDocker}
                        disabled={isLoading}
                        className="w-full justify-start border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white"
                    >
                        <Box className="mr-2 h-4 w-4" />
                        Сгенерировать Dockerfile
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

