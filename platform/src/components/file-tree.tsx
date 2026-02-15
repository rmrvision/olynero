"use client";

import { cn } from "@/lib/utils";
import { File, Folder, ChevronRight, ChevronDown, FileJson, FileCode, FileType, FileImage } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const getFileIcon = (name: string) => {
    if (name.endsWith('.tsx') || name.endsWith('.ts')) return <FileCode className="size-4 text-blue-400" />;
    if (name.endsWith('.css')) return <FileCode className="size-4 text-sky-300" />;
    if (name.endsWith('.json')) return <FileJson className="size-4 text-yellow-400" />;
    if (name.endsWith('.md')) return <FileType className="size-4 text-slate-400" />;
    if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.svg')) return <FileImage className="size-4 text-purple-400" />;
    return <File className="size-4 text-neutral-500" />;
};

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
                    "flex items-center py-1 px-2 cursor-pointer text-sm select-none transition-colors border-l-2 border-transparent",
                    isSelected
                        ? "bg-indigo-500/10 text-indigo-300 border-indigo-500 font-medium"
                        : "hover:bg-white/5 text-neutral-400 hover:text-neutral-200"
                )}
                style={{ paddingLeft: `${level * 12 + 12}px` }}
                onClick={handleClick}
            >
                <div className="mr-1.5 size-4 shrink-0 flex items-center justify-center opacity-70">
                    {node.type === "folder" && (
                        <motion.div
                            initial={false}
                            animate={{ rotate: isOpen ? 90 : 0 }}
                            transition={{ duration: 0.1 }}
                        >
                            <ChevronRight className="size-3" />
                        </motion.div>
                    )}
                </div>
                {node.type === "folder" ? (
                    <Folder className={cn("mr-2 size-4", isOpen ? "text-indigo-400 fill-indigo-400/20" : "text-indigo-500/70 fill-indigo-500/10")} />
                ) : (
                    <div className="mr-2">
                        {getFileIcon(node.name)}
                    </div>
                )}
                <span className="truncate">{node.name}</span>
            </div>
            <AnimatePresence initial={false}>
                {isOpen && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        {node.children?.map((child) => (
                            <TreeItem key={child.path} node={child} level={level + 1} onSelect={onSelect} selectedPath={selectedPath} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function FileTree({ data, onSelect, selectedPath }: FileTreeProps) {
    return (
        <div className="h-full overflow-y-auto py-2 custom-scrollbar">
            {data.map((node) => (
                <TreeItem key={node.path} node={node} level={0} onSelect={onSelect} selectedPath={selectedPath} />
            ))}
        </div>
    );
}
