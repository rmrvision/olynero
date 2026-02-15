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
    const { instance, loading: bootLoading, error: bootError } = useWebContainer({ files });

    const handleFileSelect = (path: string) => {
        const file = files.find(f => f.path === path);
        if (file) {
            setSelectedFile(path);
            setFileContent(file.content);
        }
    };

    const handleEditorChange = (value: string | undefined) => {
        // TODO: Save to DB (debounced)
        console.log("Content changed:", value);
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
                        {/* Tab Bar (Pseudo) */}
                        <div className="h-9 border-b flex items-center px-4 bg-muted/10 text-xs text-muted-foreground">
                            {selectedFile || "No file selected"}
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

                {/* Right Panel: Preview */}
                <ResizablePanel defaultSize={40}>
                    <span className="font-semibold">WebContainer Preview (Not Connected)</span>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
