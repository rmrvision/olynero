"use client";

import React, { useEffect, useRef, useState } from 'react';
import { getWebContainerInstance } from '@/lib/webcontainer';
import { TerminalView } from './terminal';
import { Terminal } from 'xterm';
import { WebContainer } from '@webcontainer/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PreviewProps {
    files: any[]; // Array of file objects from the agent
}

export const Preview: React.FC<PreviewProps> = ({ files }) => {
    const [url, setUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const terminalRef = useRef<Terminal | null>(null);
    const webContainerRef = useRef<WebContainer | null>(null);
    const hasBooted = useRef(false);

    // Boot WebContainer
    useEffect(() => {
        const boot = async () => {
            if (hasBooted.current) return;
            hasBooted.current = true;

            try {
                const terminal = terminalRef.current;
                terminal?.writeln('\x1b[33m[System] Booting WebContainer...\x1b[0m');

                const webcontainer = await getWebContainerInstance();
                webContainerRef.current = webcontainer;

                webcontainer.on('server-ready', (port: number, url: string) => {
                    terminal?.writeln(`\x1b[32m[System] Server ready on port ${port}: ${url}\x1b[0m`);
                    setUrl(url); // Fixed: was setIframeUrl
                    setIsLoading(false);
                });

                terminal?.writeln('\x1b[32m[System] WebContainer booted successfully!\x1b[0m');

                // Mount initial files if any
                if (files.length > 0) {
                    await mountFiles(files);
                }

                // Start the dev server
                await startDevServer();

            } catch (error) {
                console.error('Failed to boot WebContainer:', error);
                terminalRef.current?.writeln('\x1b[31m[System] Failed to boot WebContainer\x1b[0m');
            }
        };

        boot();
    }, []);

    // Update files when they change
    useEffect(() => {
        if (webContainerRef.current && files.length > 0) {
            mountFiles(files);
        }
    }, [files]);

    const mountFiles = async (fileList: any[]) => {
        const terminal = terminalRef.current;
        const webcontainer = webContainerRef.current;
        if (!webcontainer) return;

        terminal?.writeln('\x1b[33m[System] Mounting files...\x1b[0m');

        const fileTree: any = {};

        // Convert flat file list to WebContainer tree format
        // Simple implementation for flat structure for now
        fileList.forEach(f => {
            // Basic handling: if path has slashes, we need recursive logic.
            // For now, assuming standard vite project structure
            if (f.path === 'package.json') {
                fileTree['package.json'] = { file: { contents: f.content } };
            } else if (f.path === 'index.html') {
                fileTree['index.html'] = { file: { contents: f.content } };
            } else if (f.path.startsWith('src/')) {
                // Ensure src dir exists
                if (!fileTree.src) fileTree.src = { directory: {} };
                const fileName = f.path.replace('src/', '');
                fileTree.src.directory[fileName] = { file: { contents: f.content } };
            } else {
                // Fallback for root files
                fileTree[f.path] = { file: { contents: f.content } };
            }
        });

        // Also ensure we have a basic package.json if not provided
        if (!fileTree['package.json']) {
            fileTree['package.json'] = {
                file: {
                    contents: JSON.stringify({
                        name: "vite-project",
                        private: true,
                        version: "0.0.0",
                        type: "module",
                        scripts: {
                            "dev": "vite",
                            "build": "vite build",
                            "preview": "vite preview"
                        },
                        dependencies: {
                            "react": "^18.2.0",
                            "react-dom": "^18.2.0"
                        },
                        devDependencies: {
                            "@types/react": "^18.2.66",
                            "@types/react-dom": "^18.2.22",
                            "@vitejs/plugin-react": "^4.2.1",
                            "vite": "^5.2.0"
                        }
                    }, null, 2)
                }
            };
        }

        // Ensure index.html
        if (!fileTree['index.html']) {
            fileTree['index.html'] = {
                file: {
                    contents: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
                }
            };
        }

        // Ensure main.tsx entry point if we have App.tsx but no main.tsx
        if (fileTree.src && fileTree.src.directory['App.tsx'] && !fileTree.src.directory['main.tsx']) {
            fileTree.src.directory['main.tsx'] = {
                file: {
                    contents: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
                }
            };
        }

        await webcontainer.mount(fileTree);
        terminal?.writeln('\x1b[32m[System] Files mounted.\x1b[0m');
    };

    const startDevServer = async () => {
        const terminal = terminalRef.current;
        const webcontainer = webContainerRef.current;
        if (!webcontainer) return;

        // Install dependencies
        terminal?.writeln('\x1b[33m[System] Installing dependencies...\x1b[0m');
        const installProcess = await webcontainer.spawn('npm', ['install']);

        installProcess.output.pipeTo(new WritableStream({
            write(data) {
                terminal?.write(data);
            }
        }));

        const installExitCode = await installProcess.exit;

        if (installExitCode !== 0) {
            terminal?.writeln('\x1b[31m[Error] npm install failed.\x1b[0m');
            return;
        }

        terminal?.writeln('\x1b[32m[System] Dependencies installed.\x1b[0m');

        // Start Dev Server
        terminal?.writeln('\x1b[33m[System] Starting dev server...\x1b[0m');
        const devProcess = await webcontainer.spawn('npm', ['run', 'dev']);

        devProcess.output.pipeTo(new WritableStream({
            write(data) {
                terminal?.write(data);
            }
        }));
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 border-l border-slate-700">
            {/* Toolbar */}
            <div className="h-10 border-b border-slate-700 bg-slate-900 flex items-center px-4 justify-between">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${url ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                    {url || "Booting environment..."}
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 relative bg-white">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-500 gap-2">
                        <Loader2 className="animate-spin w-4 h-4" />
                        <span>Initializing WebContainer...</span>
                    </div>
                )}
                {url && (
                    <iframe src={url} className="w-full h-full border-none" />
                )}
            </div>

            {/* Terminal Panel */}
            <div className="h-48 border-t border-slate-700 bg-black p-2">
                <TerminalView onTerminalReady={(term) => { terminalRef.current = term; }} />
            </div>
        </div>
    );
};
