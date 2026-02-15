"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Bot, User, Trash2, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type ChatDetail = {
    id: string
    title: string
    createdAt: string
    updatedAt: string
    user: { id: string; name: string | null; email: string }
    messages: { id: string; content: string; role: string; createdAt: string }[]
}

export default function AdminChatDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [chat, setChat] = useState<ChatDetail | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchChat = async () => {
            const res = await fetch(`/api/admin/chats/${params.id}`)
            if (!res.ok) {
                toast.error("Чат не найден")
                router.push("/admin/chats")
                return
            }
            setChat(await res.json())
            setLoading(false)
        }
        fetchChat()
    }, [params.id])

    const deleteChat = async () => {
        if (!chat || !confirm("Удалить этот чат? Это действие необратимо.")) return
        const res = await fetch(`/api/admin/chats/${chat.id}`, { method: "DELETE" })
        if (res.ok) {
            toast.success("Чат удалён")
            router.push("/admin/chats")
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Загрузка...</div>
    }

    if (!chat) return null

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/admin/chats")}>
                    <ArrowLeft className="size-4" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">{chat.title}</h1>
                    <p className="text-sm text-muted-foreground">
                        {chat.messages.length} сообщений
                    </p>
                </div>
                <Button variant="destructive" size="sm" onClick={deleteChat}>
                    <Trash2 className="size-4 mr-2" /> Удалить чат
                </Button>
            </div>

            {/* Chat info */}
            <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="size-4 text-primary" />
                </div>
                <div>
                    <Link href={`/admin/users/${chat.user.id}`} className="font-medium hover:underline">
                        {chat.user.name || "Без имени"}
                    </Link>
                    <p className="text-xs text-muted-foreground">{chat.user.email}</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                    {new Date(chat.createdAt).toLocaleString("ru-RU")}
                </div>
            </div>

            <Separator />

            {/* Messages */}
            <div className="space-y-4">
                <h2 className="font-semibold">Сообщения</h2>
                {chat.messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center border rounded-xl">В этом чате нет сообщений.</p>
                ) : (
                    <div className="space-y-3 max-w-3xl">
                        {chat.messages.map((msg) => (
                            <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                                {msg.role !== "user" && (
                                    <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                        <Bot className="size-3.5 text-primary" />
                                    </div>
                                )}
                                <div className={cn(
                                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                                    msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-br-sm"
                                        : msg.role === "system"
                                            ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 rounded-bl-sm"
                                            : "bg-muted/50 border rounded-bl-sm"
                                )}>
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                    <p className={cn(
                                        "text-[10px] mt-1 opacity-60",
                                        msg.role === "user" ? "text-right" : "text-left"
                                    )}>
                                        {new Date(msg.createdAt).toLocaleString("ru-RU")}
                                    </p>
                                </div>
                                {msg.role === "user" && (
                                    <div className="size-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                                        <User className="size-3.5 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
