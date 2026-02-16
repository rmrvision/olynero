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
import { saveFileAction, deleteFileAction, getFileContentAction, getProjectFilesBatchAction } from "@/actions/file-actions";
import { toast } from "sonner";
import { ArrowLeft, Code2, FileIcon, FolderOpen, Monitor, Bot, Loader2 } from "lucide-react";
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
    initialFileTree: any[]; // Changed from files to initialFileTree
    isReadOnly?: boolean;
}

export default function ProjectClientPage({ project, initialFileTree, isReadOnly = false }: ProjectClientPageProps) {
    // 1. Initialize with lightweight tree
    const [fileList, setFileList] = useState<any[]>(initialFileTree);
    const [webContainerFiles, setWebContainerFiles] = useState<any[]>([]); // For WC boot

    // Convert flat files to tree
    const fileTree = buildFileTree(fileList);

    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [fileContent, setFileContent] = useState<string>("// Выберите файл для редактирования");
    const [isLoadingFile, setIsLoadingFile] = useState(false);

    // 2. Background Hydration of full content
    useEffect(() => {
        async function hydrate() {
            try {
                const result = await getProjectFilesBatchAction(project.id);
                if (result.success && result.files) {
                    // Update file list with content so Editor access is fast
                    setFileList(prev => {
                        // Merge content into existing tree (preserving any local changes if any?? no, just overwrite for now as we are just mounting)
                        return result.files;
                    });
                    // Trigger WebContainer boot
                    setWebContainerFiles(result.files);
                }
            } catch (e) {
                console.error("Hydration failed", e);
                toast.error("Ошибка загрузки файлов");
            }
        }
        hydrate();
    }, [project.id]);

    // 3. WebContainer now waits for webContainerFiles to be populated
    const { instance, loading: bootLoading, error: bootError, serverUrl, terminalLogs } = useWebContainer({ files: webContainerFiles });

    const connected = !!instance && !bootLoading;
    const [previewKey, setPreviewKey] = useState(0);
    const [activeTab, setActiveTab] = useState<"code" | "preview">("code");

    const editorRef = useRef<any>(null);
    const handleEditorDidMount = (editor: any, monaco: any) => {
        editorRef.current = editor;
    };

    const handleFileSelect = async (path: string) => {
        setSelectedFile(path);

        // Optimistic check: do we have content?
        const file = fileList.find(f => f.path === path);
        if (file && file.content !== undefined) {
            setFileContent(file.content);
            return;
        }

        // Lazy load content
        setIsLoadingFile(true);
        setFileContent("// Загрузка...");
        try {
            const result = await getFileContentAction(project.id, path);
            if (result.success && result.content) {
                setFileContent(result.content);
                // Cache it
                setFileList(prev => prev.map(f => f.path === path ? { ...f, content: result.content } : f));
            } else {
                setFileContent("// Ошибка загрузки файла");
            }
        } catch (e) {
            setFileContent("// Ошибка загрузки файла");
        } finally {
            setIsLoadingFile(false);
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
                    // output captured by WebContainer
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
        <div className="flex-1 min-h-0 bg-black text-white flex flex-col overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black pointer-events-none" />

            <header className="relative z-10 h-14 border-b border-white/10 flex items-center justify-between px-6 bg-zinc-950/95 backdrop-blur-md">
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
                        {/* Loading Indicator for Background Hydration */}
                        {!connected && webContainerFiles.length === 0 && (
                            <span className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px]">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Загрузка файлов...
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/10">
                        {/* Status Dot */}
                        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                        <span className="text-xs text-neutral-400 font-medium">
                            {connected ? 'Подключено' : (webContainerFiles.length > 0 ? 'Запуск...' : 'Ожидание файлов')}
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

            <main className="relative z-10 flex-1 min-h-0 overflow-hidden p-4 flex flex-col">
                <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0 rounded-xl overflow-hidden border border-white/10 bg-zinc-950/80 shadow-2xl">

                    {/* LEFT: AI Agent Chat */}
                    <ResizablePanel defaultSize={28} minSize={24} maxSize={40} className="flex flex-col bg-zinc-950 border-r border-white/10">
                        <div className="h-11 px-4 flex items-center gap-2 border-b border-white/10 bg-zinc-900/80">
                            <Bot className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm font-semibold text-white">Olynero AI</span>
                        </div>
                        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                            {isReadOnly ? (
                                <div className="flex items-center justify-center h-full text-neutral-500 text-sm p-4">
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
                    </ResizablePanel>

                    <ResizableHandle className="w-1.5 bg-white/5 hover:bg-indigo-500/30 transition-colors cursor-col-resize" />

                    {/* RIGHT: Tabs (Code / Preview) */}
                    <ResizablePanel defaultSize={72} minSize={50} className="flex flex-col bg-zinc-950 min-w-0">
                        {/* Tab Switcher */}
                        <div className="h-11 px-3 flex items-center gap-1 border-b border-white/10 bg-zinc-900/80">
                            <button
                                onClick={() => setActiveTab("code")}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${activeTab === "code"
                                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Code2 className="w-4 h-4" />
                                Код
                            </button>
                            <button
                                onClick={() => setActiveTab("preview")}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${activeTab === "preview"
                                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Monitor className="w-4 h-4" />
                                Предпросмотр
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                            {activeTab === "code" ? (
                                <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
                                    {/* File Tree */}
                                    <ResizablePanel defaultSize={22} minSize={15} maxSize={35} className="flex flex-col bg-zinc-950 border-r border-white/10">
                                        <div className="h-9 px-3 flex items-center gap-2 border-b border-white/5 bg-zinc-900/50">
                                            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                                            <span className="text-xs font-semibold text-neutral-300">Файлы</span>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-2 bg-zinc-950/50">
                                            {/* Show Tree immediately using props; no loading state needed here */}
                                            <FileTree
                                                data={fileTree}
                                                onSelect={handleFileSelect}
                                                selectedPath={selectedFile || undefined}
                                            />
                                        </div>
                                    </ResizablePanel>
                                    <ResizableHandle className="w-1 bg-white/5 hover:bg-indigo-500/20 cursor-col-resize" />
                                    {/* Editor */}
                                    <ResizablePanel defaultSize={78} minSize={50} className="flex flex-col bg-zinc-900">
                                        <div className="h-9 flex items-center gap-1 px-3 border-b border-white/5 bg-zinc-900/50 overflow-x-auto no-scrollbar">
                                            {selectedFile ? (
                                                <div className="px-3 py-1.5 text-xs text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 rounded font-medium flex items-center gap-2">
                                                    <FileIcon className="w-3 h-3" />
                                                    <span className="truncate max-w-[200px]">{selectedFile}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-neutral-500">Выберите файл</span>
                                            )}
                                        </div>
                                        <div className="flex-1 relative bg-zinc-900 min-h-0">
                                            {/* Editor Loading State */}
                                            {isLoadingFile && (
                                                <div className="absolute inset-0 z-10 bg-zinc-900/50 flex items-center justify-center">
                                                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                                                </div>
                                            )}
                                            <Editor
                                                path={selectedFile || undefined}
                                                language={selectedFile ? getLanguageFromPath(selectedFile) : 'typescript'}
                                                value={fileContent}
                                                onChange={handleEditorChange}
                                            />
                                        </div>
                                        <div className="h-6 bg-zinc-800 border-t border-white/5 text-zinc-400 text-[10px] px-3 flex items-center justify-between">
                                            <span>{isSaving ? "Сохранение..." : "Сохранено"}</span>
                                            <span>UTF-8</span>
                                        </div>
                                    </ResizablePanel>
                                </ResizablePanelGroup>
                            ) : (
                                /* Preview Tab */
                                <div className="flex-1 flex flex-col min-h-0 bg-white">
                                    <div className="h-8 px-3 flex items-center justify-between border-b border-white/10 bg-zinc-100">
                                        {serverUrl && (
                                            <a href={serverUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate max-w-[300px]">
                                                {serverUrl}
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex-1 relative min-h-0">
                                        <PreviewPanel
                                            webContainer={instance}
                                            serverUrl={serverUrl}
                                            key={previewKey}
                                        />
                                        {bootLoading && (
                                            <div className="absolute inset-0 bg-zinc-900/95 backdrop-blur flex flex-col items-center justify-center text-center p-4">
                                                <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                                                <p className="text-indigo-300 font-medium">Запуск окружения...</p>
                                                <p className="text-neutral-500 text-xs mt-2">Установка пакетов и старт сервера</p>
                                            </div>
                                        )}
                                        {bootError && (
                                            <div className="absolute inset-0 bg-red-950/95 backdrop-blur flex items-center justify-center p-6 text-center">
                                                <div>
                                                    <p className="text-red-400 font-medium mb-2">Ошибка запуска</p>
                                                    <p className="text-red-300/70 text-sm">{bootError}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </ResizablePanel>

                </ResizablePanelGroup>
            </main>
        </div>
    );
}
