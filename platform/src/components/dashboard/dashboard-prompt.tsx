"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Send, Globe, Lock, Loader2 } from "lucide-react";
import { createProjectFromPromptAction } from "@/actions/project-actions";
import { toast } from "sonner";

const MIN_ROWS = 1;
const MAX_ROWS = 4;

export function DashboardPrompt() {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const router = useRouter();

    const submitPrompt = async () => {
        const trimmed = prompt.trim();
        if (!trimmed || isLoading) return;

        setIsLoading(true);
        try {
            const result = await createProjectFromPromptAction(trimmed, isPublic);
            if (result.success && result.projectId) {
                router.push(`/project/${result.projectId}`);
            }
        } catch (error) {
            console.error("Failed to create project", error);
            toast.error("Не удалось создать проект");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitPrompt();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submitPrompt();
        }
    };

    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        const lineHeight = 24;
        const newHeight = Math.min(
            Math.max(ta.scrollHeight, MIN_ROWS * lineHeight),
            MAX_ROWS * lineHeight
        );
        ta.style.height = `${newHeight}px`;
        if (newHeight >= MAX_ROWS * lineHeight) {
            ta.style.overflowY = "auto";
        } else {
            ta.style.overflowY = "hidden";
        }
    }, [prompt]);

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="relative flex items-start gap-3 px-4 py-3 rounded-2xl bg-zinc-900/80 border border-white/10 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all">
                <div className="flex flex-col gap-1 shrink-0 pt-2.5">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    className="size-9 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <Plus className="size-5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-zinc-900 border-white/10">
                                Добавить файл
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    onClick={() => setIsPublic(!isPublic)}
                                    className={`size-9 rounded-lg flex items-center justify-center transition-colors ${
                                        isPublic
                                            ? "text-indigo-400 bg-indigo-500/10"
                                            : "text-neutral-400 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    {isPublic ? <Globe className="size-4" /> : <Lock className="size-4" />}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-zinc-900 border-white/10">
                                {isPublic ? "Публичный — проект виден всем" : "Приватный — только вы"}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Опишите, что хотите создать — например: дашборд для аналитики продаж..."
                    rows={MIN_ROWS}
                    className="flex-1 min-w-0 bg-transparent text-white placeholder:text-neutral-500 outline-none text-base resize-none py-2.5 leading-6 max-h-24 overflow-y-auto"
                    disabled={isLoading}
                    style={{ minHeight: "24px" }}
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={!prompt.trim() || isLoading}
                    className="shrink-0 mt-1 size-10 rounded-full bg-white text-black hover:bg-neutral-200"
                >
                    {isLoading ? (
                        <Loader2 className="size-5 animate-spin" />
                    ) : (
                        <Send className="size-5" />
                    )}
                </Button>
            </div>
        </form>
    );
}
