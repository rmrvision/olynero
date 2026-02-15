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
    const [serverUrl, setServerUrl] = useState<string | null>(null);
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

                    files.forEach(file => {
                        const parts = file.path.split('/').filter(Boolean);
                        let currentLevel: any = fileSystemTree;

                        parts.forEach((part, index) => {
                            const isFile = index === parts.length - 1;
                            if (isFile) {
                                currentLevel[part] = {
                                    file: {
                                        contents: file.content
                                    }
                                };
                            } else {
                                if (!currentLevel[part]) {
                                    currentLevel[part] = { directory: {} };
                                }
                                currentLevel = currentLevel[part].directory;
                            }
                        });
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

                    console.log("Starting dev server...");
                    const devProcess = await webcontainer.spawn('npm', ['run', 'dev']);
                    devProcess.output.pipeTo(new WritableStream({
                        write(data) {
                            console.log('[dev server]', data);
                        }
                    }));

                    webcontainer.on('server-ready', (port, url) => {
                        console.log('Server ready:', port, url);
                        setServerUrl(url);
                    });

                    console.log("WebContainer ready.");
                }
            } catch (err) {
                console.error("Failed to boot WebContainer:", err);
                if (isMounted) setError(err instanceof Error ? err.message : "Failed to boot");
            } finally {
                setLoading(false);
            }
        }

        boot();

        return () => {
            isMounted = false;
        };
    }, []); // Boot once

    return { instance, loading, error, serverUrl, mountFile: instance?.fs.writeFile };
}
