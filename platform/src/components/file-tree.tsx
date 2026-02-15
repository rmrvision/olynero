"use client";

import { cn } from "@/lib/utils";
import { File, Folder, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";

export interface FileNode {
    id: string;
    name: string;
    type: "file" | "folder";
    children?: FileNode[];
    path: string;
}

interface FileTreeProps {
    data: FileNode[];
    onSelect: (path: string) => void;
    selectedPath?: string;
}

// Recursive Tree Item
function TreeItem({ node, level, onSelect, selectedPath }: { node: FileNode, level: number, onSelect: (path: string) => void, selectedPath?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = node.type === "folder" && node.children && node.children.length > 0;
    const isSelected = node.path === selectedPath;

    const handleClick = () => {
        if (node.type === "folder") {
            setIsOpen(!isOpen);
        } else {
            onSelect(node.path);
        }
    };

    return (
        <div>
            <div
                className={cn(
                    "flex items-center py-1 px-2 cursor-pointer hover:bg-accent/50 text-sm select-none",
                    isSelected && "bg-accent text-accent-foreground font-medium"
                )}
                style={{ paddingLeft: `${level * 12 + 12}px` }}
                onClick={handleClick}
            >
                <div className="mr-1.5 size-4 shrink-0 flex items-center justify-center text-muted-foreground">
                    {node.type === "folder" && (
                        isOpen ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />
                    )}
                </div>
                {node.type === "folder" ? (
                    <Folder className="mr-2 size-4 text-sky-500 fill-sky-500/20" />
                ) : (
                    <File className="mr-2 size-4 text-muted-foreground" />
                )}
                <span className="truncate">{node.name}</span>
            </div>
            {isOpen && hasChildren && node.children?.map((child) => (
                <TreeItem key={child.path} node={child} level={level + 1} onSelect={onSelect} selectedPath={selectedPath} />
            ))}
        </div>
    );
}

export function FileTree({ data, onSelect, selectedPath }: FileTreeProps) {
    return (
        <div className="h-full overflow-y-auto py-2">
            {data.map((node) => (
                <TreeItem key={node.path} node={node} level={0} onSelect={onSelect} selectedPath={selectedPath} />
            ))}
        </div>
    );
}
