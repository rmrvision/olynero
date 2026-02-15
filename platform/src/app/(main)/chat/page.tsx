"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User, ArrowUp } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            const responseContent = processResponse(data);
            setMessages(prev => [...prev, { role: "assistant", content: responseContent }]);
        },
        onError: (error) => {
            toast.error("Ошибка: " + error.message);
            setMessages(prev => [...prev, { role: "assistant", content: "Извините, что-то пошло не так. Попробуйте ещё раз." }]);
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

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        mutation.mutate(userMessage);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && !mutation.isPending) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        const el = e.target;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    };

    const isPending = mutation.isPending;
    const isEmpty = messages.length === 0;

    return (
        <div className="flex flex-col h-full bg-background">
            {isEmpty ? (
                /* Empty state */
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center max-w-lg">
                        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="size-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Olynero AI</h2>
                        <p className="text-muted-foreground mb-8">
                            Опишите, что вы хотите создать, и я помогу вам с кодом, дизайном или идеями.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                            {[
                                "Создай лендинг для SaaS-продукта",
                                "Напиши API для аутентификации",
                                "Сделай дашборд с графиками",
                                "Помоги с React-компонентом",
                            ].map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setInput(suggestion);
                                        textareaRef.current?.focus();
                                    }}
                                    className="rounded-xl border bg-card p-3 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all text-left"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* Chat messages */
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="max-w-3xl mx-auto space-y-6">
                        {messages.map((msg, i) => (
                            <div key={i} className={cn("flex gap-3", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                                {msg.role === 'assistant' && (
                                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                        <Bot className="size-4 text-primary" />
                                    </div>
                                )}

                                <div className={cn(
                                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                                        : 'bg-muted/50 border rounded-bl-sm'
                                )}>
                                    {msg.content}
                                </div>

                                {msg.role === 'user' && (
                                    <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                                        <User className="size-4 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isPending && (
                            <div className="flex gap-3 justify-start">
                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Bot className="size-4 text-primary" />
                                </div>
                                <div className="bg-muted/50 border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <span className="size-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0ms]" />
                                        <span className="size-2 bg-primary/60 rounded-full animate-bounce [animation-delay:150ms]" />
                                        <span className="size-2 bg-primary/60 rounded-full animate-bounce [animation-delay:300ms]" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t bg-background">
                <div className="max-w-3xl mx-auto">
                    <div className="relative rounded-2xl border bg-card shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40">
                        <textarea
                            ref={textareaRef}
                            className="w-full resize-none bg-transparent px-4 py-3 pr-14 text-sm focus:outline-none placeholder:text-muted-foreground/50 min-h-[48px] max-h-[200px]"
                            placeholder="Сообщение Olynero..."
                            value={input}
                            onChange={handleTextareaInput}
                            onKeyDown={handleKeyDown}
                            disabled={isPending}
                            rows={1}
                        />
                        <Button
                            size="icon"
                            className={cn(
                                "absolute right-2 bottom-2 rounded-xl size-9 transition-all",
                                input.trim() ? "opacity-100 scale-100" : "opacity-40 scale-95"
                            )}
                            onClick={handleSend}
                            disabled={!input.trim() || isPending}
                        >
                            <ArrowUp className="size-4" />
                        </Button>
                    </div>
                    <p className="text-center mt-2 text-xs text-muted-foreground/50">
                        ИИ может ошибаться. Проверяйте результат.
                    </p>
                </div>
            </div>
        </div>
    );
}
