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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Copy, Download, Share2, Globe, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateProjectVisibilityAction } from "@/actions/project-actions";

interface ShareDialogProps {
    project: {
        id: string;
        isPublic: boolean;
        userId?: string; // Optional for type safety, but needed logic
    };
    userId: string;
}

export function ShareDialog({ project, userId }: ShareDialogProps) {
    const [isPublic, setIsPublic] = useState(project.isPublic);
    const [isLoading, setIsLoading] = useState(false);

    const publicUrl = typeof window !== "undefined"
        ? `${window.location.origin}/project/${project.id}`
        : `/project/${project.id}`;

    const handleVisibilityChange = async (checked: boolean) => {
        setIsPublic(checked); // Optimistic update
        setIsLoading(true);
        try {
            const result = await updateProjectVisibilityAction(project.id, checked);
            if (result.success) {
                toast.success(checked ? "Project is now Public" : "Project is now Private");
            } else {
                throw new Error("Failed to update visibility");
            }
        } catch (error) {
            setIsPublic(!checked); // Revert
            toast.error("Failed to update visibility");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(publicUrl);
        toast.success("Link copied to clipboard");
    };

    const handleExport = () => {
        // Trigger download
        window.location.href = `/api/projects/${project.id}/export`;
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-white/5 gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Share Project</DialogTitle>
                    <DialogDescription className="text-neutral-400">
                        Manage implementation details for sharing access and exporting your project.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    {/* Visibility Toggle */}
                    <div className="flex items-center justify-between space-x-4 rounded-lg border border-white/10 p-4 bg-white/5">
                        <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-full ${isPublic ? 'bg-green-500/20 text-green-400' : 'bg-neutral-500/20 text-neutral-400'}`}>
                                {isPublic ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="public-mode" className="text-sm font-medium leading-none text-white">
                                    Public Access
                                </Label>
                                <p className="text-xs text-neutral-400">
                                    {isPublic
                                        ? "Anyone with the link can view this project."
                                        : "Only you can access this project."}
                                </p>
                            </div>
                        </div>
                        <Switch
                            id="public-mode"
                            checked={isPublic}
                            onCheckedChange={handleVisibilityChange}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Copy Link */}
                    {isPublic && (
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="link" className="sr-only">
                                    Link
                                </Label>
                                <Input
                                    id="link"
                                    defaultValue={publicUrl}
                                    readOnly
                                    className="h-9 bg-black/40 border-white/10 text-neutral-300"
                                />
                            </div>
                            <Button type="button" size="sm" className="px-3" onClick={copyToClipboard}>
                                <span className="sr-only">Copy</span>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    <div className="border-t border-white/10 pt-4">
                        <Button variant="outline" className="w-full border-white/10 text-neutral-300 hover:bg-white/5 hover:text-white" onClick={handleExport}>
                            <Download className="mr-2 h-4 w-4" />
                            Export as ZIP
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
