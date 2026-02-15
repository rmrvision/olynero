"use client";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useState, useEffect } from "react";
import { FileTree, FileNode } from "@/components/file-tree";
import { CodeEditor } from "@/components/code-editor";
import { buildFileTree } from "@/lib/file-utils";
import { useWebContainer } from "@/hooks/use-webcontainer"; // NEW
import { useDebouncedCallback } from "use-debounce";
import { saveFileAction, deleteFileAction } from "@/actions/file-actions";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";
import { Preview as PreviewPanel } from "@/components/preview/preview-panel";
import { AgentChat } from "@/components/agent-chat";

interface ProjectClientPageProps {
    project: any; // Type this properly later
    files: any[];
}

export default function ProjectClientPage({ project, files }: ProjectClientPageProps) {
    const [fileList, setFileList] = useState(files);
    // Convert flat files to tree
    const fileTree = buildFileTree(fileList);

    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [fileContent, setFileContent] = useState<string>("// Select a file to edit");

    // Boot WebContainer
    const { instance, loading: bootLoading, error: bootError, serverUrl } = useWebContainer({ files });

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
        setIsSaving(true);
        try {
            await saveFileAction(projectId, path, content);
            setIsSaving(false);
        } catch (error) {
            console.error("Failed to save file:", error);
            setIsSaving(false);
            toast.error("Failed to save changes");
        }
    }, 1000);

    const handleEditorChange = (value: string | undefined) => {
        if (value === undefined || !selectedFile) return;

        // 1. Update local state
        setFileContent(value);

        // Update fileList to keep tree in sync (optional but good for consistency)
        setFileList(prev => prev.map(f => f.path === selectedFile ? { ...f, content: value } : f));

        // 2. Update WebContainer (Immediate)
        if (instance) {
            const cleanPath = selectedFile.startsWith('/') ? selectedFile.slice(1) : selectedFile;
            instance.fs.writeFile(cleanPath, value).catch(err => {
                console.error("Failed to write to WebContainer:", err);
            });
        }

        // 3. Queue Save to DB
        setIsSaving(true);
        debouncedSave(project.id, selectedFile, value);
    };

    // --- Agent Tools Handlers ---

    const handleFileUpdate = async (path: string, content: string) => {
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

        // Force refresh tree (handled by fileList change)
    };

    const handleFileCreate = async (path: string, content: string) => {
        await handleFileUpdate(path, content);
        toast.success(`Created ${path}`);
    };

    const handleFileDelete = async (path: string) => {
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
            setFileContent("// Select a file to edit");
        }
    };

    const handleRunCommand = async (command: string) => {
        if (!instance) {
            toast.error("Environment not ready");
            return;
        }

        // Simply spawn 'jsh' (shell) to execute the command string
        // This handles args parsing automatically
        try {
            const process = await instance.spawn('jsh', ['-c', command]);

            process.output.pipeTo(new WritableStream({
                write(data) {
                    console.log(`[${command}]`, data);
                    // Could stream to a terminal or toast, for now console + simple toast
                }
            }));

            await process.exit;
            toast.success(`Executed: ${command}`);
        } catch (e) {
            console.error("Command failed", e);
            toast.error("Command failed execution");
        }
    };

    return (
        <div className="h-full w-full bg-background overflow-hidden">
            <ResizablePanelGroup direction="horizontal" className="h-full w-full">
                {/* Left Panel: File Tree */}
                <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="border-r bg-muted/10">
                    <div className="flex h-full flex-col">
                        <div className="p-3 border-b text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Files
                        </div>
                        <div className="flex-1 overflow-auto">
                            <FileTree data={fileTree} onSelect={handleFileSelect} selectedPath={selectedFile || undefined} />
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Center Panel: Code Editor */}
                <ResizablePanel defaultSize={40}>
                    <div className="flex h-full flex-col">
                        <div className="h-9 border-b flex items-center px-4 bg-muted/10 text-xs text-muted-foreground justify-between">
                            <span>{selectedFile || "No file selected"}</span>
                            {selectedFile && (
                                <span className="flex items-center gap-1">
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-3 h-3 text-green-500" />
                                            Saved
                                        </>
                                    )}
                                </span>
                            )}
                        </div>
                        <div className="flex-1">
                            <CodeEditor
                                value={fileContent}
                                language="typescript" // Detect based on extension later
                                onChange={handleEditorChange}
                                path={selectedFile || undefined}
                            />
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Panel: Preview & Chat */}
                <ResizablePanel defaultSize={40}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={70}>
                            {/* Preview Panel (WebContainer + Terminal) */}
                            <PreviewPanel
                                webContainer={instance}
                                serverUrl={serverUrl} // We need to expose this from useWebContainer
                            />
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        <ResizablePanel defaultSize={30}>
                            {/* Agent Chat */}
                            <AgentChat
                                projectId={project.id}
                                onUpdateFile={handleFileUpdate}
                                onCreateFile={handleFileCreate}
                                onDeleteFile={handleFileDelete}
                                onRunCommand={handleRunCommand}
                            />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
