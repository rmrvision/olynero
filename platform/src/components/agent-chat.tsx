"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Loader2, Send, Terminal, Bot, User } from "lucide-react";
import { toast } from "sonner";

interface AgentChatProps {
    projectId: string;
    onUpdateFile: (path: string, content: string) => void;
    onCreateFile: (path: string, content: string) => void;
}

export function AgentChat({ projectId, onUpdateFile, onCreateFile }: AgentChatProps) {
    const [input, setInput] = useState("");
    const { messages, sendMessage, status } = useChat({
        api: "/api/agent",
        body: {
            projectId,
        },
        maxSteps: 5,
        onToolCall: async ({ toolCall }: { toolCall: any }) => {
            console.log("Tool call:", toolCall);
            if (toolCall.toolName === 'updateFile') {
                const { path, content } = toolCall.args as { path: string, content: string };
                toast.info(`Updating ${path}...`);
                onUpdateFile(path, content);
            }
            if (toolCall.toolName === 'createFile') {
                const { path, content } = toolCall.args as { path: string, content: string };
                toast.info(`Creating ${path}...`);
                onCreateFile(path, content);
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

    return (
        <div className="flex flex-col h-full bg-background border-l w-full">
            <div className="p-3 border-b text-sm font-semibold flex items-center gap-2">
                <Bot className="w-4 h-4" />
                AI Assistant
            </div>

            <div className="flex-1 p-4 overflow-auto">
                <div className="space-y-4">
                    {messages.map((m: any) => (
                        <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {m.role !== 'user' && (
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Bot className="w-4 h-4 text-primary" />
                                </div>
                            )}
                            <div className={`rounded-lg px-4 py-2 max-w-[85%] text-sm ${m.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                                }`}>
                                <div className="whitespace-pre-wrap">{m.content}</div>
                                {m.toolInvocations?.map((toolInvocation: any, index: number) => (
                                    <div key={index} className="mt-2 p-2 bg-background/50 rounded text-xs font-mono border">
                                        <div className="font-semibold text-muted-foreground flex items-center gap-1">
                                            <Terminal className="w-3 h-3" />
                                            Tool: {toolInvocation.toolName}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me to modify code..."
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={isLoading}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
