import { db } from "@/lib/db"
import { Users, MessageSquare, MessagesSquare, UserCheck, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

async function getStats() {
    const [totalUsers, activeUsers, totalChats, totalMessages, recentUsers, recentChats] = await Promise.all([
        db.user.count(),
        db.user.count({ where: { isActive: true } }),
        db.chat.count(),
        db.message.count(),
        db.user.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            select: { id: true, name: true, email: true, role: true, createdAt: true, isActive: true },
        }),
        db.chat.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                user: { select: { name: true, email: true } },
                _count: { select: { messages: true } },
            },
        }),
    ])

    return { totalUsers, activeUsers, totalChats, totalMessages, recentUsers, recentChats }
}

export default async function AdminDashboard() {
    const stats = await getStats()

    const statCards = [
        { label: "Всего пользователей", value: stats.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
        { label: "Активные пользователи", value: stats.activeUsers, icon: UserCheck, color: "text-green-400", bg: "bg-green-500/10" },
        { label: "Всего чатов", value: stats.totalChats, icon: MessageSquare, color: "text-indigo-400", bg: "bg-indigo-500/10" },
        { label: "Всего сообщений", value: stats.totalMessages, icon: MessagesSquare, color: "text-pink-400", bg: "bg-pink-500/10" },
    ]

    return (
        <div className="p-6 md:p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-1">Дашборд</h1>
                <p className="text-sm text-muted-foreground">Обзор платформы Olynero AI</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <div key={i} className="rounded-2xl border bg-card p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-muted-foreground">{card.label}</span>
                            <div className={`size-9 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                                <card.icon className="size-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold">{card.value}</div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="rounded-2xl border bg-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold">Новые пользователи</h2>
                        <Link href="/admin/users" className="text-sm text-primary hover:underline">Все</Link>
                    </div>
                    {stats.recentUsers.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-8 text-center">Пользователей пока нет.</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.recentUsers.map((user) => (
                                <Link
                                    key={user.id}
                                    href={`/admin/users/${user.id}`}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                                        {(user.name?.[0] || user.email[0]).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">{user.name || "Без имени"}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="size-3" />
                                        {user.createdAt.toLocaleDateString("ru-RU")}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Chats */}
                <div className="rounded-2xl border bg-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold">Последние чаты</h2>
                        <Link href="/admin/chats" className="text-sm text-primary hover:underline">Все</Link>
                    </div>
                    {stats.recentChats.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-8 text-center">Чатов пока нет.</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.recentChats.map((chat) => (
                                <Link
                                    key={chat.id}
                                    href={`/admin/chats/${chat.id}`}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="size-9 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                                        <MessageSquare className="size-4 text-indigo-400" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">{chat.title}</p>
                                        <p className="text-xs text-muted-foreground truncate">{chat.user.name || chat.user.email}</p>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {chat._count.messages} сообщ.
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
