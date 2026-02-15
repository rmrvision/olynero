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

interface ProjectClientPageProps {
    project: any; // Type this properly later
    files: { path: string; content: string }[];
}

export default function ProjectClientPage({ project, files }: ProjectClientPageProps) {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [fileContent, setFileContent] = useState<string>("// Select a file to view content");

    // Convert flat files to tree
    const fileTree = buildFileTree(files);

    const handleFileSelect = (path: string) => {
        setSelectedFile(path);
        const file = files.find(f => f.path === path);
        if (file) {
            setFileContent(file.content);
        }
    };

    const handleEditorChange = (value: string | undefined) => {
        // TODO: Save to DB (debounced)
        console.log("Content changed:", value);
    };

    return (
        <ResizablePanelGroup direction="horizontal" className="h-full w-full bg-background">
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
                <div className="flex h-full items-center justify-center p-6 text-muted-foreground bg-muted/20">
                    <span className="font-semibold">WebContainer Preview (Not Connected)</span>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
