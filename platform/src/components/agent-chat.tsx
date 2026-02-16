"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

import { Loader2, Send, Terminal, Bot, User, Paperclip, X } from "lucide-react";
import { toast } from "sonner";

interface AgentChatProps {
    projectId: string;
    onUpdateFile: (path: string, content: string) => void;
    onCreateFile: (path: string, content: string) => void;
    onDeleteFile: (path: string) => void;
    onRunCommand: (command: string) => void;
    terminalLogs: string[];
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ACCEPTED_FILE_TYPES = [
    ...ACCEPTED_IMAGE_TYPES,
    "application/pdf",
    "text/plain",
    "application/json",
    "text/css",
    "text/html",
    "application/javascript",
];

export function AgentChat({ projectId, onUpdateFile, onCreateFile, onDeleteFile, onRunCommand, terminalLogs }: AgentChatProps) {
    const [input, setInput] = useState("");
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { messages, sendMessage, status, addToolResult } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/agent",
            body: { projectId },
        }),
        maxSteps: 5,
        onToolCall: async ({ toolCall }: { toolCall: any }) => {
            if (toolCall.toolName === 'updateFile') {
                const { path, content } = toolCall.args;
                toast.info(`Обновление ${path}...`);
                onUpdateFile(path, content);
                addToolResult({ tool: toolCall.toolName, toolCallId: toolCall.toolCallId, output: "Файл обновлён." });
            }
            if (toolCall.toolName === 'createFile') {
                const { path, content } = toolCall.args;
                toast.info(`Создание ${path}...`);
                onCreateFile(path, content);
                addToolResult({ tool: toolCall.toolName, toolCallId: toolCall.toolCallId, output: "Файл создан." });
            }
            if (toolCall.toolName === 'deleteFile') {
                const { path } = toolCall.args;
                toast.info(`Удаление ${path}...`);
                onDeleteFile(path);
                addToolResult({ tool: toolCall.toolName, toolCallId: toolCall.toolCallId, output: "Файл удалён." });
            }
            if (toolCall.toolName === 'runCommand') {
                const { command } = toolCall.args;
                toast.info(`Выполнение ${command}...`);
                onRunCommand(command);
                addToolResult({ tool: toolCall.toolName, toolCallId: toolCall.toolCallId, output: "Команда выполнена." });
            }
            if (toolCall.toolName === 'getTerminalLogs') {
                const logs = terminalLogs.join('\n') || "Логи отсутствуют.";
                addToolResult({ tool: toolCall.toolName, toolCallId: toolCall.toolCallId, output: logs });
            }
        },
    } as any);

    const isLoading = status === 'submitted' || status === 'streaming';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = input.trim();
        if (!text && attachedFiles.length === 0) return;
        const dt = new DataTransfer();
        attachedFiles.forEach((f) => dt.items.add(f));
        const filesToSend = attachedFiles.length > 0 ? dt.files : undefined;
        if (text && filesToSend) {
            sendMessage({ text, files: filesToSend } as any);
        } else if (text) {
            sendMessage({ text } as any);
        } else {
            sendMessage({ files: filesToSend! } as any);
        }
        setInput("");
        setAttachedFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;
        const valid = Array.from(files).filter((f) =>
            ACCEPTED_FILE_TYPES.some((t) => f.type === t || f.type.startsWith("image/"))
        );
        if (valid.length < files.length) {
            toast.error("Некоторые файлы не поддерживаются. Разрешены: изображения, PDF, текст, JSON, CSS, HTML, JS");
        }
        setAttachedFiles((prev) => [...prev, ...valid].slice(0, 5));
    };

    const removeFile = (index: number) => {
        setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // Cache blob URLs and revoke on change to prevent memory leaks
    const previewUrls = useMemo(() => {
        return attachedFiles.map((f) =>
            ACCEPTED_IMAGE_TYPES.includes(f.type) ? URL.createObjectURL(f) : null
        );
    }, [attachedFiles]);

    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => { if (url) URL.revokeObjectURL(url); });
        };
    }, [previewUrls]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-transparent w-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-400">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
                            <Bot className="w-8 h-8 text-indigo-400" />
                        </div>
                        <p className="text-sm font-medium text-white mb-1">Чем могу помочь?</p>
                        <p className="text-xs text-neutral-500">Опишите изменения или задайте вопрос ниже</p>
                    </div>
                )}

                {messages.map((m: any) => {
                    const parts = m.parts ?? (m.content ? [{ type: "text", text: m.content }] : []);
                    const textParts = parts.filter((p: any) => p.type === "text");
                    const fileParts = parts.filter((p: any) => p.type === "file");
                    const toolParts = parts.filter((p: any) => typeof p.type === "string" && p.type.startsWith("tool-"));
                    const textContent = textParts.map((p: any) => p.text).join("");
                    const toolInvocations = m.toolInvocations ?? toolParts;
                    return (
                    <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                            {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>

                        <div className={`flex flex-col max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`px-4 py-3 rounded-2xl text-sm ${m.role === 'user'
                                ? 'bg-indigo-600/20 text-indigo-100 border border-indigo-500/20 rounded-tr-sm'
                                : 'bg-white/5 text-neutral-200 border border-white/5 rounded-tl-sm'
                                }`}>
                                {textContent && <div className="whitespace-pre-wrap leading-relaxed">{textContent}</div>}
                                {fileParts.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {fileParts.map((part: any, i: number) =>
                                            part.mediaType?.startsWith("image/") ? (
                                                <img
                                                    key={i}
                                                    src={part.url}
                                                    alt={part.filename || "Image"}
                                                    className="max-w-48 max-h-32 rounded-lg object-cover border border-white/10"
                                                />
                                            ) : (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-xs"
                                                >
                                                    <Paperclip className="w-3 h-3 opacity-60" />
                                                    <span className="truncate max-w-32">{part.filename || "Файл"}</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Tool Invocations */}
                            {toolInvocations?.map((tool: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-2 text-xs bg-black/40 border border-white/10 rounded-lg overflow-hidden w-full"
                                >
                                    <div className="px-3 py-2 bg-white/5 border-b border-white/5 flex items-center gap-2 text-neutral-400">
                                        <Terminal className="w-3 h-3" />
                                        <span className="font-mono">{tool.toolName ?? tool.type?.replace("tool-", "")}</span>
                                        <span className="ml-auto text-[10px] opacity-50">
                                            {tool.state === 'result' || tool.state === 'output-available' || tool.state === 'output-error' ? 'Завершено' : 'Выполняется...'}
                                        </span>
                                    </div>
                                    {(tool.args ?? tool.input) && (
                                        <div className="p-2 font-mono text-neutral-500 truncate opacity-70">
                                            {JSON.stringify(tool.args ?? tool.input)}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                );})}

                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-4"
                    >
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                        </div>
                        <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/5 border border-white/5 text-sm text-neutral-400 flex items-center gap-2">
                            Думаю...
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="p-4 bg-transparent">
                <form onSubmit={handleSubmit} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity blur" />
                    <div className="relative bg-zinc-900 rounded-xl border border-white/10 focus-within:border-white/20 transition-colors overflow-hidden">
                        {attachedFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-2 border-b border-white/5">
                                {attachedFiles.map((file, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs group/item"
                                    >
                                        {previewUrls[i] ? (
                                            <img
                                                src={previewUrls[i]!}
                                                alt={file.name}
                                                className="w-10 h-10 rounded object-cover"
                                            />
                                        ) : (
                                            <Paperclip className="w-4 h-4 text-neutral-400" />
                                        )}
                                        <span className="truncate max-w-24">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className="p-0.5 rounded hover:bg-white/10 opacity-60 hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex items-center">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={ACCEPTED_FILE_TYPES.join(",")}
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => fileInputRef.current?.click()}
                                className="h-9 w-9 shrink-0 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg"
                            >
                                <Paperclip className="w-4 h-4" />
                            </Button>
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Опишите изменения или прикрепите изображение/файл..."
                                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-neutral-500 h-12 px-2"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isLoading || (!input.trim() && attachedFiles.length === 0)}
                                className="mr-1 h-9 w-9 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
