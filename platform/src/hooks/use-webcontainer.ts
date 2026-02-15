"use client";

import { useEffect, useState, useRef } from "react";
import { WebContainer } from "@webcontainer/api";
import { getWebContainerInstance } from "@/lib/webcontainer";

interface UseWebContainerProps {
    files: Array<{ path: string; content: string }>;
}

export function useWebContainer({ files }: UseWebContainerProps) {
    const [instance, setInstance] = useState<WebContainer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const mountedRef = useRef(false);

    useEffect(() => {
        let isMounted = true;

        async function boot() {
            if (mountedRef.current) return;
            mountedRef.current = true;

            try {
                setLoading(true);
                console.log("Booting WebContainer...");
                const webcontainer = await getWebContainerInstance();

                if (isMounted) {
                    setInstance(webcontainer);

                    const fileSystemTree: any = {};

                    // Simple flat to tree conversion for now
                    // TODO: Use a proper recursive builder if we support folders
                    files.forEach(file => {
                        // sanitize path
                        const cleanPath = file.path.startsWith('/') ? file.path.slice(1) : file.path;
                        // For MVP, just mount at root. 
                        // In reality we need to mkdir recursively.
                        fileSystemTree[cleanPath] = {
                            file: {
                                contents: file.content
                            }
                        };
                    });

                    console.log("Mounting files:", fileSystemTree);
                    await webcontainer.mount(fileSystemTree);

                    // Install dependencies if package.json exists
                    if (fileSystemTree['package.json']) {
                        console.log("Installing dependencies...");
                        const installProcess = await webcontainer.spawn('npm', ['install']);
                        installProcess.output.pipeTo(new WritableStream({
                            write(data) {
                                console.log('[npm install]', data);
                            }
                        }));
                        await installProcess.exit;
                    }

                    setLoading(false);
                    console.log("WebContainer ready.");
                }
            } catch (err) {
                console.error("Failed to boot WebContainer:", err);
                if (isMounted) setError(err instanceof Error ? err.message : "Failed to boot");
                setLoading(false);
            }
        }

        boot();

        return () => {
            isMounted = false;
        };
    }, []); // Boot once

    return { instance, loading, error };
}
