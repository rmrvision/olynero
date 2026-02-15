"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Send, Sparkles, Bot, User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Привет! Я Olynero AI. Что мы будем создавать сегодня?" }
    ]);
    const [input, setInput] = useState("");

    const mutation = useMutation({
        mutationFn: async (userPrompt: string) => {
            const response = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userPrompt })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to generate');
            return data;
        },
        onSuccess: (data) => {
            // Assuming the API returns a message or artifacts
            // For this prototype, we'll extract a simple response or use a default one
            const responseContent = processResponse(data);
            setMessages(prev => [...prev, { role: "assistant", content: responseContent }]);
        },
        onError: (error) => {
            toast.error("Ошибка агента: " + error.message);
            setMessages(prev => [...prev, { role: "assistant", content: "Извините, что-то пошло не так. Пожалуйста, попробуйте еще раз." }]);
        }
    });

    const processResponse = (data: any) => {
        if (data.artifacts && data.artifacts.length > 0) {
            return "Я сгенерировал код для вас. Проверьте панель артефактов (скоро)!";
        }
        return data.message || "Задача выполнена.";
    }

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setInput("");

        mutation.mutate(userMessage);
    };

    const isPending = mutation.isPending;

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && (
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Bot className="size-5 text-primary" />
                            </div>
                        )}

                        <div className={cn(
                            "max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm",
                            msg.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-muted/50 border text-foreground rounded-bl-none'
                        )}>
                            {msg.content}
                        </div>

                        {msg.role === 'user' && (
                            <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                <User className="size-5 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                ))}
                {isPending && (
                    <div className="flex gap-3 justify-start">
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Bot className="size-5 text-primary" />
                        </div>
                        <div className="bg-muted/50 border text-foreground rounded-2xl rounded-bl-none px-5 py-3 flex items-center gap-2">
                            <Sparkles className="size-4 animate-pulse text-primary" />
                            <span className="text-sm text-muted-foreground">Думаю...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-background/80 backdrop-blur-md">
                <div className="max-w-3xl mx-auto relative cursor-text rounded-3xl border bg-muted/30 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                    <Input
                        className="border-none shadow-none bg-transparent h-14 pl-6 pr-14 focus-visible:ring-0 text-base placeholder:text-muted-foreground/60"
                        placeholder="Сообщение Olynero..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isPending && handleSend()}
                        disabled={isPending}
                    />
                    <Button
                        size="icon"
                        className={cn(
                            "absolute right-2 top-2 rounded-full size-10 transition-all",
                            input.trim() ? "opacity-100 scale-100" : "opacity-0 scale-90"
                        )}
                        onClick={handleSend}
                        disabled={!input.trim() || isPending}
                    >
                        <Send className="size-4" />
                    </Button>
                </div>
                <div className="text-center mt-3">
                    <span className="text-xs text-muted-foreground/60 flex items-center justify-center gap-1">
                        <Sparkles className="size-3" /> ИИ может ошибаться. Пожалуйста, проверяйте результат.
                    </span>
                </div>
            </div>
        </div>
    );
}
