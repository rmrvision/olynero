"use client";

import { Button } from "@/components/ui/button";
import { Github, Loader2, GitCommit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface GitHubSyncButtonProps {
    projectId: string;
    githubRepo?: string | null;
}

export function GitHubSyncButton({ projectId, githubRepo }: GitHubSyncButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSync = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/projects/${projectId}/github`, {
                method: "POST",
            });

            if (!response.ok) {
                const text = await response.text();
                // Check if it's an auth issue
                if (response.status === 400 && text.includes("account")) {
                    toast.error("Please sign in with GitHub to sync projects");
                    // Optional: Redirect to login or show link instructions
                    return;
                }
                throw new Error(text || "Failed to sync");
            }

            const data = await response.json();
            toast.success(`Synced to ${data.repoName}`);
            router.refresh();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className="text-neutral-400 hover:text-white hover:bg-white/5 gap-2"
            onClick={handleSync}
            disabled={isLoading}
        >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
            {githubRepo ? "Push Changes" : "Connect GitHub"}
        </Button>
    );
}
