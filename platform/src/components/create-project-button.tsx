"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProjectAction } from "@/actions/project-actions";

export function CreateProjectButton() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleCreate = async () => {
        if (!name.trim()) return;
        setIsLoading(true);
        try {
            const result = await createProjectAction(name);
            if (result.success && result.projectId) {
                setOpen(false);
                router.push(`/project/${result.projectId}`);
            }
        } catch (error) {
            console.error("Failed to create project", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-white text-black hover:bg-neutral-200">
                    <Plus className="size-4 mr-2" />
                    Новый проект
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Создать проект</DialogTitle>
                    <DialogDescription className="text-neutral-400">
                        Дайте имя вашему новому приложению.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-white">
                            Название
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-indigo-500/50"
                            placeholder="Например: Мой супер стартап"
                            autoComplete="off"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleCreate}
                        disabled={!name.trim() || isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                    >
                        {isLoading ? "Создание..." : "Создать проект"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

