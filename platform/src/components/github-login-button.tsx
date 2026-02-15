"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { loginWithGithub } from "@/actions/auth-actions";
import { useState } from "react";

export function GithubLoginButton() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Button
            variant="outline"
            type="button"
            className="w-full h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white relative"
            onClick={async () => {
                setIsLoading(true);
                await loginWithGithub();
                // No need to set loading false as we redirect
            }}
            disabled={isLoading}
        >
            <Github className="mr-2 h-4 w-4" />
            {isLoading ? "Подключение..." : "Войти через GitHub"}
        </Button>
    );
}
