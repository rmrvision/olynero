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

    const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

    const addLog = (data: string) => {
        setTerminalLogs(prev => {
            const newLogs = [...prev, data];
            if (newLogs.length > 100) {
                return newLogs.slice(newLogs.length - 100);
            }
            return newLogs;
        });
    };

    useEffect(() => {
        let isMounted = true;

        async function boot() {
            if (mountedRef.current) return;
            mountedRef.current = true;

            try {
                setLoading(true);
                const webcontainer = await getWebContainerInstance();

                if (!isMounted) return;

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

                await webcontainer.mount(fileSystemTree);

                // Install dependencies if package.json exists
                if (fileSystemTree['package.json']) {
                    addLog("[System] Installing dependencies...\n");
                    const installProcess = await webcontainer.spawn('npm', ['install']);
                    installProcess.output.pipeTo(new WritableStream({
                        write(data) {
                            addLog(data);
                        }
                    }));
                    await installProcess.exit;
                }

                addLog("[System] Starting dev server...\n");
                const devProcess = await webcontainer.spawn('npm', ['run', 'dev']);
                devProcess.output.pipeTo(new WritableStream({
                    write(data) {
                        addLog(data);
                    }
                }));

                // Listen for server-ready — only then mark loading as false
                webcontainer.on('server-ready', (port, url) => {
                    if (isMounted) {
                        setServerUrl(url);
                        setLoading(false);
                        addLog(`[System] Server ready at ${url}\n`);
                    }
                });

                // Fallback timeout: if server doesn't start within 60s, stop loading anyway
                setTimeout(() => {
                    if (isMounted) {
                        setLoading(false);
                    }
                }, 60000);

            } catch (err) {
                console.error("Failed to boot WebContainer:", err);
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Failed to boot");
                    setLoading(false);
                }
            }
        }

        boot();

        return () => {
            isMounted = false;
        };
    }, []); // Boot once

    return { instance, loading, error, serverUrl, mountFile: instance?.fs.writeFile, terminalLogs };
}
