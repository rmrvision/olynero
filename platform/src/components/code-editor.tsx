"use client";

import Editor, { OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useRef } from "react";

interface CodeEditorProps {
    value: string;
    language?: string;
    onChange?: (value: string | undefined) => void;
    path?: string;
}

export function CodeEditor({ value, language = "typescript", onChange, path }: CodeEditorProps) {
    const { theme } = useTheme();
    const editorRef = useRef<any>(null);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    return (
        <div className="h-full w-full bg-background">
            <Editor
                height="100%"
                defaultLanguage={language}
                language={language}
                value={value}
                theme={theme === "dark" ? "vs-dark" : "light"}
                onChange={onChange}
                onMount={handleEditorDidMount}
                path={path} // crucial for monaco model URI
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                }}
            />
        </div>
    );
}
