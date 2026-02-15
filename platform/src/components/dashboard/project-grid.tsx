"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Folder, Clock, ArrowRight, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { CreateProjectButton } from "@/components/create-project-button";

interface Project {
    id: string;
    name: string;
    description: string | null;
    updatedAt: Date;
    createdAt: Date;
}

interface ProjectGridProps {
    projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
    if (projects.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5"
            >
                <div className="mx-auto size-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ring-1 ring-white/10">
                    <Folder className="size-8 text-neutral-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Нет проектов</h3>
                <p className="text-neutral-400 mb-8 max-w-sm mx-auto">
                    Создайте первый проект, чтобы начать разработку ИИ-приложений.
                </p>
                <CreateProjectButton />
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Link href={`/project/${project.id}`}>
                        <div className="group relative h-full glass-card rounded-3xl p-6 flex flex-col hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <div className="size-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                    <Folder className="size-6" />
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="size-5 text-neutral-500 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                </div>
                            </div>

                            <h3 className="text-lg font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                {project.name}
                            </h3>

                            <p className="text-sm text-neutral-500 line-clamp-2 mb-6 flex-1">
                                {project.description || "Описание не добавлено."}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium pt-4 border-t border-white/5">
                                <Clock className="size-3.5" />
                                <span>Изменён {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true, locale: ru })}</span>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
