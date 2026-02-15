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
import { saveFileAction } from "@/actions/file-actions";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";
import { Preview as PreviewPanel } from "@/components/preview/preview-panel";
import { AgentChat } from "@/components/agent-chat";

interface ProjectClientPageProps {
    project: any; // Type this properly later
    files: any[];
}

export default function ProjectClientPage({ project, files }: ProjectClientPageProps) {
    // Convert flat files to tree
    const fileTree = buildFileTree(files);

    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [fileContent, setFileContent] = useState<string>("// Select a file to edit");

    // Boot WebContainer
    // Boot WebContainer
    const { instance, loading: bootLoading, error: bootError, serverUrl } = useWebContainer({ files });

    const handleFileSelect = (path: string) => {
        const file = files.find(f => f.path === path);
        if (file) {
            setSelectedFile(path);
            setFileContent(file.content);
        }
    };



    // ... inside component

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
                                onUpdateFile={(path, content) => handleEditorChange(content)} // This overwrites current editor? Needs smarter logic.
                                onCreateFile={(path, content) => {
                                    // Create file in FS and DB
                                    if (instance) {
                                        instance.fs.writeFile(path, content);
                                    }
                                    saveFileAction(project.id, path, content);
                                    // Force refresh file tree? 
                                    // Ideally we update `files` prop or locally mutate `fileTree`.
                                    toast.success(`Created ${path}`);
                                }}
                            />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
