"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

import { Loader2, Send, Terminal, Bot, User } from "lucide-react";
import { toast } from "sonner";

interface AgentChatProps {
    projectId: string;
    onUpdateFile: (path: string, content: string) => void;
    onCreateFile: (path: string, content: string) => void;
    onDeleteFile: (path: string) => void;
    onRunCommand: (command: string) => void;
    terminalLogs: string[];
}

export function AgentChat({ projectId, onUpdateFile, onCreateFile, onDeleteFile, onRunCommand, terminalLogs }: AgentChatProps) {
    const [input, setInput] = useState("");
    const { messages, sendMessage, status, addToolResult } = useChat({
        api: "/api/agent",
        body: { projectId },
        maxSteps: 5,
        onToolCall: async ({ toolCall }: { toolCall: any }) => {
            console.log("Tool call:", toolCall);
            if (toolCall.toolName === 'updateFile') {
                const { path, content } = toolCall.args;
                toast.info(`Updating ${path}...`);
                onUpdateFile(path, content);
                addToolResult({ tool: toolCall.toolName, toolCallId: toolCall.toolCallId, output: "File updated successfully." });
            }
            if (toolCall.toolName === 'createFile') {
                const { path, content } = toolCall.args;
                toast.info(`Creating ${path}...`);
                onCreateFile(path, content);
                addToolResult({ tool: toolCall.toolName, toolCallId: toolCall.toolCallId, output: "File created successfully." });
            }
            if (toolCall.toolName === 'deleteFile') {
                const { path } = toolCall.args;
                toast.info(`Deleting ${path}...`);
                onDeleteFile(path);
                addToolResult({ tool: toolCall.toolName, toolCallId: toolCall.toolCallId, output: "File deleted successfully." });
            }
            if (toolCall.toolName === 'runCommand') {
                const { command } = toolCall.args;
                toast.info(`Running ${command}...`);
                onRunCommand(command);
                addToolResult({ tool: toolCall.toolName, toolCallId: toolCall.toolCallId, output: "Command executed." });
            }
            if (toolCall.toolName === 'getTerminalLogs') {
                const logs = terminalLogs.join('\n') || "No logs available.";
                addToolResult({ tool: toolCall.toolName, toolCallId: toolCall.toolCallId, output: logs });
            }
        },
    } as any);

    const isLoading = status === 'submitted' || status === 'streaming';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage({ role: 'user', content: input } as any);
        setInput("");
    };

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
                    <div className="flex flex-col items-center justify-center h-full text-neutral-500 opacity-50">
                        <Bot className="w-12 h-12 mb-4" />
                        <p className="text-sm">How can I help you build today?</p>
                    </div>
                )}

                {messages.map((m: any) => (
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
                                <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                            </div>

                            {/* Tool Invocations */}
                            {m.toolInvocations?.map((tool: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-2 text-xs bg-black/40 border border-white/10 rounded-lg overflow-hidden w-full"
                                >
                                    <div className="px-3 py-2 bg-white/5 border-b border-white/5 flex items-center gap-2 text-neutral-400">
                                        <Terminal className="w-3 h-3" />
                                        <span className="font-mono">{tool.toolName}</span>
                                        <span className="ml-auto text-[10px] opacity-50">
                                            {tool.state === 'result' ? 'Completed' : 'Running...'}
                                        </span>
                                    </div>
                                    {tool.args && (
                                        <div className="p-2 font-mono text-neutral-500 truncate opacity-70">
                                            {JSON.stringify(tool.args)}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}

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
                            Thinking...
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="p-4 bg-transparent">
                <form onSubmit={handleSubmit} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity blur" />
                    <div className="relative flex items-center bg-zinc-900 rounded-xl border border-white/10 focus-within:border-white/20 transition-colors overflow-hidden">
                        <Input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Describe changes or ask questions..."
                            className="flex-1 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-neutral-500 h-12 px-4"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={isLoading || !input.trim()}
                            className="mr-1 h-9 w-9 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
