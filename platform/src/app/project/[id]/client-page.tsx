"use client";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useState, useEffect, useRef } from "react";
import { FileTree, FileNode } from "@/components/file-tree";
import { CodeEditor as Editor } from "@/components/code-editor";
import { buildFileTree } from "@/lib/file-utils";
import { useWebContainer } from "@/hooks/use-webcontainer";
import { useDebouncedCallback } from "use-debounce";
import { saveFileAction, deleteFileAction } from "@/actions/file-actions";
import { toast } from "sonner";
import { Loader2, Check, ArrowLeft, Code2, Settings, FileIcon, Sparkles } from "lucide-react";
import { Preview as PreviewPanel } from "@/components/preview/preview-panel";
import { AgentChat } from "@/components/agent-chat";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShareDialog } from "@/components/share-dialog";
import { GitHubSyncButton } from "@/components/github-sync-button";
import { DeployDialog } from "@/components/deploy-dialog";

const getLanguageFromPath = (path: string) => {
    if (path.endsWith(".tsx") || path.endsWith(".ts")) return "typescript";
    if (path.endsWith(".jsx") || path.endsWith(".js")) return "javascript";
    if (path.endsWith(".css")) return "css";
    if (path.endsWith(".html")) return "html";
    if (path.endsWith(".json")) return "json";
    return "plaintext";
};

interface ProjectClientPageProps {
    project: any;
    files: any[];
    isReadOnly?: boolean;
}

export default function ProjectClientPage({ project, files, isReadOnly = false }: ProjectClientPageProps) {
    const [fileList, setFileList] = useState(files);
    // Convert flat files to tree
    const fileTree = buildFileTree(fileList);

    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [fileContent, setFileContent] = useState<string>("// Выберите файл для редактирования");

    const { instance, loading: bootLoading, error: bootError, serverUrl, terminalLogs } = useWebContainer({ files });

    const connected = !!instance && !bootLoading;
    const [previewKey, setPreviewKey] = useState(0);

    const editorRef = useRef<any>(null);
    const handleEditorDidMount = (editor: any, monaco: any) => {
        editorRef.current = editor;
    };

    const handleFileSelect = (path: string) => {
        const file = fileList.find(f => f.path === path);
        if (file) {
            setSelectedFile(path);
            setFileContent(file.content);
        }
    };

    const [isSaving, setIsSaving] = useState(false);

    // Debounced save to DB
    const debouncedSave = useDebouncedCallback(async (projectId: string, path: string, content: string) => {
        if (isReadOnly) return;
        setIsSaving(true);
        try {
            await saveFileAction(projectId, path, content);
            setIsSaving(false);
        } catch (error) {
            console.error("Failed to save file:", error);
            setIsSaving(false);
            toast.error("Ошибка сохранения");
        }
    }, 1000);

    const handleEditorChange = (value: string | undefined) => {
        if (value === undefined || !selectedFile) return;

        setFileContent(value);

        if (isReadOnly) return;

        // Update fileList to keep tree in sync
        setFileList(prev => prev.map(f => f.path === selectedFile ? { ...f, content: value } : f));

        // Update WebContainer
        if (instance) {
            const cleanPath = selectedFile.startsWith('/') ? selectedFile.slice(1) : selectedFile;
            instance.fs.writeFile(cleanPath, value).catch((err: any) => {
                console.error("Failed to write to WebContainer:", err);
            });
        }

        // Queue Save to DB
        setIsSaving(true);
        debouncedSave(project.id, selectedFile, value);
    };

    // --- Agent Tools Handlers ---

    const handleFileUpdate = async (path: string, content: string) => {
        if (isReadOnly) { toast.error("Режим только для чтения"); return; }
        // 1. Write to WebContainer
        if (instance) {
            const cleanPath = path.startsWith('/') ? path.slice(1) : path;
            try {
                await instance.fs.writeFile(cleanPath, content);
            } catch (e) {
                console.error("WC Write Error", e);
            }
        }

        // 2. Save to DB
        await saveFileAction(project.id, path, content);

        // 3. Update State
        setFileList(prev => {
            const exists = prev.find(f => f.path === path);
            if (exists) {
                return prev.map(f => f.path === path ? { ...f, content } : f);
            }
            return [...prev, { path, content }];
        });

        // 4. Update Editor if active
        if (selectedFile === path) {
            setFileContent(content);
        }
    };

    const handleFileCreate = async (path: string, content: string) => {
        if (isReadOnly) { toast.error("Режим только для чтения"); return; }
        await handleFileUpdate(path, content);
        toast.success(`Создан файл ${path}`);
    };

    const handleFileDelete = async (path: string) => {
        if (isReadOnly) { toast.error("Режим только для чтения"); return; }
        // 1. Remove from WebContainer
        if (instance) {
            const cleanPath = path.startsWith('/') ? path.slice(1) : path;
            try {
                await instance.fs.rm(cleanPath);
            } catch (e) {
                console.error("WC Delete Error", e);
            }
        }

        // 2. Remove from DB
        await deleteFileAction(project.id, path);

        // 3. Update State
        setFileList(prev => prev.filter(f => f.path !== path));

        // 4. Clear Editor if active
        if (selectedFile === path) {
            setSelectedFile(null);
            setFileContent("// Выберите файл для редактирования");
        }
    };

    const handleRunCommand = async (command: string) => {
        if (isReadOnly) { toast.error("Режим только для чтения"); return; }
        if (!instance) {
            toast.error("Окружение не готово");
            return;
        }

        try {
            const process = await instance.spawn('jsh', ['-c', command]);

            process.output.pipeTo(new WritableStream({
                write(data) {
                    console.log(`[${command}]`, data);
                }
            }));

            await process.exit;
            toast.success(`Выполнено: ${command}`);
        } catch (e) {
            console.error("Command failed", e);
            toast.error("Ошибка выполнения команды");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black pointer-events-none" />

            <header className="relative z-10 h-14 border-b border-white/5 flex items-center justify-between px-4 bg-white/5 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-neutral-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-indigo-400" />
                        <span className="font-semibold text-sm">{project.name}</span>
                        {isReadOnly && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase font-bold tracking-wider">
                                Только чтение
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/5">
                        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                        <span className="text-xs text-neutral-400 font-medium">
                            {connected ? 'Подключено' : 'Отключено'}
                        </span>
                    </div>
                    {/* Share Dialog */}
                    {!isReadOnly && (
                        <>
                            <GitHubSyncButton projectId={project.id} githubRepo={project.githubRepo} />
                            <DeployDialog project={project} />
                            <ShareDialog project={project} userId={project.userId} />
                        </>
                    )}
                </div>
            </header>

            <main className="relative z-10 flex-1 overflow-hidden p-2">
                <ResizablePanelGroup direction="horizontal" className="h-full rounded-2xl border border-white/5 overflow-hidden shadow-2xl bg-black/40">

                    {/* LEFT: File Explorer */}
                    <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-black/20 backdrop-blur-sm flex flex-col border-r border-white/5">
                        <div className="p-3 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Файлы</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {bootLoading ? (
                                <div className="space-y-2 animate-pulse">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-6 bg-white/5 rounded mx-2" />
                                    ))}
                                </div>
                            ) : (
                                <FileTree
                                    data={fileTree}
                                    onSelect={handleFileSelect}
                                    selectedPath={selectedFile || undefined}
                                />
                            )}
                        </div>
                    </ResizablePanel>

                    <ResizableHandle className="w-px bg-white/5 hover:bg-indigo-500/50 transition-colors" />

                    {/* MIDDLE: Editor */}
                    <ResizablePanel defaultSize={40} minSize={30} className="bg-zinc-950/50 flex flex-col">
                        {/* File Tabs */}
                        <div className="h-9 flex items-center bg-black/40 border-b border-white/5 overflow-x-auto no-scrollbar">
                            {selectedFile ? (
                                <div className="px-4 py-2 text-xs text-indigo-300 bg-indigo-500/10 border-r border-t border-indigo-500/20 font-medium flex items-center gap-2 min-w-[120px]">
                                    <FileIcon className="w-3 h-3" />
                                    {selectedFile}
                                </div>
                            ) : (
                                <div className="px-4 py-2 text-xs text-neutral-500 italic">Файл не выбран</div>
                            )}
                        </div>
                        <div className="flex-1 relative">
                            <Editor
                                path={selectedFile || undefined}
                                language={selectedFile ? getLanguageFromPath(selectedFile) : 'typescript'}
                                value={fileContent}
                                onChange={handleEditorChange}
                            />
                        </div>
                        {/* Status Bar */}
                        <div className="h-6 bg-indigo-600 text-white text-[10px] px-3 flex items-center justify-between select-none">
                            <div className="flex items-center gap-3">
                                <span>main*</span>
                                <span className="opacity-50">|</span>
                                <span>{isSaving ? "Сохранение..." : "Сохранено"}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span>UTF-8</span>
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle className="w-px bg-white/5 hover:bg-indigo-500/50 transition-colors" />

                    {/* RIGHT: Agent & Preview */}
                    <ResizablePanel defaultSize={40} minSize={30} className="flex flex-col bg-black/20 backdrop-blur-sm border-l border-white/5">
                        <div className="flex-1 flex flex-col h-full">
                            {/* Preview */}
                            <div className="h-1/2 border-b border-white/5 flex flex-col">
                                <div className="h-9 border-b border-white/5 flex items-center justify-between px-3 bg-white/5">
                                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Предпросмотр</span>
                                    {serverUrl && (
                                        <a href={serverUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline truncate max-w-[200px]">
                                            {serverUrl}
                                        </a>
                                    )}
                                </div>
                                <div className="flex-1 relative bg-white">
                                    <PreviewPanel
                                        webContainer={instance}
                                        serverUrl={serverUrl}
                                        key={previewKey}
                                    />
                                    {bootLoading && (
                                        <div className="absolute inset-0 bg-zinc-900/90 backdrop-blur flex flex-col items-center justify-center text-center p-4">
                                            <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                                            <p className="text-indigo-300 font-medium">Запуск окружения...</p>
                                            <p className="text-neutral-500 text-xs mt-2">Установка пакетов и старт сервера</p>
                                        </div>
                                    )}
                                    {bootError && (
                                        <div className="absolute inset-0 bg-red-950/90 backdrop-blur flex items-center justify-center p-6 text-center">
                                            <div>
                                                <p className="text-red-400 font-medium mb-2">Ошибка запуска</p>
                                                <p className="text-red-300/70 text-sm">{bootError}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Agent Chat */}
                            <div className="h-1/2 flex flex-col bg-zinc-900/30">
                                <div className="h-9 border-b border-white/5 flex items-center px-3 bg-white/5">
                                    <Sparkles className="w-3 h-3 text-purple-400 mr-2" />
                                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">AI Ассистент</span>
                                </div>
                                <div className="flex-1 overflow-hidden relative">
                                    {isReadOnly ? (
                                        <div className="flex items-center justify-center h-full text-neutral-500 text-sm">
                                            AI Ассистент недоступен в режиме чтения
                                        </div>
                                    ) : (
                                        <AgentChat
                                            projectId={project.id}
                                            terminalLogs={terminalLogs || []}
                                            onUpdateFile={handleFileUpdate}
                                            onCreateFile={handleFileCreate}
                                            onDeleteFile={handleFileDelete}
                                            onRunCommand={handleRunCommand}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </ResizablePanel>

                </ResizablePanelGroup>
            </main>
        </div>
    );
}
