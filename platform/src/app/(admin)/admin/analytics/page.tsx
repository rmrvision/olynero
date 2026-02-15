import { db } from "@/lib/db"
import { Users, MessageSquare, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react"

async function getAnalytics() {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    const [
        totalUsers,
        totalChats,
        totalMessages,
        newUsersThisMonth,
        newUsersPrevMonth,
        newUsersThisWeek,
        newChatsThisMonth,
        newChatsPrevMonth,
        newChatsThisWeek,
        newMessagesThisMonth,
        newMessagesThisWeek,
    ] = await Promise.all([
        db.user.count(),
        db.chat.count(),
        db.message.count(),
        db.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        db.user.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
        db.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
        db.chat.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        db.chat.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
        db.chat.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
        db.message.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        db.message.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    ])

    const userGrowth = newUsersPrevMonth > 0
        ? Math.round(((newUsersThisMonth - newUsersPrevMonth) / newUsersPrevMonth) * 100)
        : newUsersThisMonth > 0 ? 100 : 0

    const chatGrowth = newChatsPrevMonth > 0
        ? Math.round(((newChatsThisMonth - newChatsPrevMonth) / newChatsPrevMonth) * 100)
        : newChatsThisMonth > 0 ? 100 : 0

    return {
        totalUsers, totalChats, totalMessages,
        newUsersThisMonth, newUsersThisWeek, userGrowth,
        newChatsThisMonth, newChatsThisWeek, chatGrowth,
        newMessagesThisMonth, newMessagesThisWeek,
    }
}

export default async function AdminAnalyticsPage() {
    const data = await getAnalytics()

    const metrics = [
        {
            label: "Пользователи",
            total: data.totalUsers,
            thisMonth: data.newUsersThisMonth,
            thisWeek: data.newUsersThisWeek,
            growth: data.userGrowth,
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
        },
        {
            label: "Чаты",
            total: data.totalChats,
            thisMonth: data.newChatsThisMonth,
            thisWeek: data.newChatsThisWeek,
            growth: data.chatGrowth,
            icon: MessageSquare,
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
        },
        {
            label: "Сообщения",
            total: data.totalMessages,
            thisMonth: data.newMessagesThisMonth,
            thisWeek: data.newMessagesThisWeek,
            growth: 0,
            icon: TrendingUp,
            color: "text-green-400",
            bg: "bg-green-500/10",
        },
    ]

    return (
        <div className="p-6 md:p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-1">Аналитика</h1>
                <p className="text-sm text-muted-foreground">Статистика использования платформы</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.map((m, i) => (
                    <div key={i} className="rounded-2xl border bg-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`size-10 rounded-xl ${m.bg} flex items-center justify-center ${m.color}`}>
                                <m.icon className="size-5" />
                            </div>
                            {m.growth !== 0 && (
                                <div className={`flex items-center gap-1 text-sm font-medium ${m.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {m.growth > 0 ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                                    {Math.abs(m.growth)}%
                                </div>
                            )}
                        </div>
                        <p className="text-3xl font-bold mb-1">{m.total}</p>
                        <p className="text-sm text-muted-foreground">{m.label} всего</p>
                    </div>
                ))}
            </div>

            {/* Period Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border bg-card p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar className="size-4 text-muted-foreground" />
                        <h2 className="font-semibold">За последние 30 дней</h2>
                    </div>
                    <div className="space-y-4">
                        {metrics.map((m, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                <div className="flex items-center gap-3">
                                    <div className={`size-8 rounded-lg ${m.bg} flex items-center justify-center ${m.color}`}>
                                        <m.icon className="size-4" />
                                    </div>
                                    <span className="text-sm">Новых {m.label.toLowerCase()}</span>
                                </div>
                                <span className="font-semibold">{m.thisMonth}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border bg-card p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar className="size-4 text-muted-foreground" />
                        <h2 className="font-semibold">За последние 7 дней</h2>
                    </div>
                    <div className="space-y-4">
                        {metrics.map((m, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                <div className="flex items-center gap-3">
                                    <div className={`size-8 rounded-lg ${m.bg} flex items-center justify-center ${m.color}`}>
                                        <m.icon className="size-4" />
                                    </div>
                                    <span className="text-sm">Новых {m.label.toLowerCase()}</span>
                                </div>
                                <span className="font-semibold">{m.thisWeek}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Averages */}
            <div className="rounded-2xl border bg-card p-6">
                <h2 className="font-semibold mb-4">Средние показатели</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-muted/30 text-center">
                        <p className="text-2xl font-bold">{data.totalUsers > 0 ? (data.totalChats / data.totalUsers).toFixed(1) : 0}</p>
                        <p className="text-xs text-muted-foreground mt-1">Чатов на пользователя</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30 text-center">
                        <p className="text-2xl font-bold">{data.totalChats > 0 ? (data.totalMessages / data.totalChats).toFixed(1) : 0}</p>
                        <p className="text-xs text-muted-foreground mt-1">Сообщений на чат</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30 text-center">
                        <p className="text-2xl font-bold">{data.totalUsers > 0 ? (data.totalMessages / data.totalUsers).toFixed(1) : 0}</p>
                        <p className="text-xs text-muted-foreground mt-1">Сообщений на пользователя</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
