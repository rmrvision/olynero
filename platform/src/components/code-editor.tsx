"use client";

import React from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface CodeEditorProps {
    initialValue?: string;
    language?: string;
    onChange?: (value: string | undefined) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
    initialValue = "// Start coding...",
    language = "typescript",
    onChange,
}) => {
    const { theme } = useTheme();

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        // Determine theme based on system preference or next-themes
        // Monaco themes: "vs-dark" or "light"
    };

    return (
        <div className="h-full w-full border rounded-md overflow-hidden">
            <Editor
                height="100%"
                defaultLanguage={language}
                defaultValue={initialValue}
                theme={theme === "dark" ? "vs-dark" : "light"}
                onChange={onChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
        </div>
    );
};
