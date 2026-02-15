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
import { createProjectAction } from "@/actions/project-actions"; // We need to create this

export function CreateProjectButton() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleCreate = async () => {
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
                <Button>
                    <Plus className="size-4 mr-2" />
                    Новый проект
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Создать проект</DialogTitle>
                    <DialogDescription>
                        Дайте имя вашему новому приложению.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Название
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            placeholder="My Awesome App"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleCreate} disabled={!name || isLoading}>
                        {isLoading ? "Создание..." : "Создать"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
