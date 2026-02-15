import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Database, Server, Key } from "lucide-react"

export default async function AdminSettingsPage() {
    const session = await auth()

    const dbStats = await db.$queryRaw<{ version: string }[]>`SELECT version()`
    const dbVersion = dbStats[0]?.version?.split(",")[0] || "PostgreSQL"

    const userCount = await db.user.count()
    const chatCount = await db.chat.count()
    const messageCount = await db.message.count()

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold mb-1">Настройки</h1>
                <p className="text-sm text-muted-foreground">Конфигурация платформы</p>
            </div>

            {/* Admin Account */}
            <section className="rounded-2xl border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Shield className="size-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-semibold">Аккаунт администратора</h2>
                        <p className="text-xs text-muted-foreground">Текущая сессия</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-muted-foreground">Имя</span>
                        <span className="text-sm font-medium">{session?.user?.name || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-muted-foreground">Email</span>
                        <span className="text-sm font-medium">{session?.user?.email || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-muted-foreground">Роль</span>
                        <Badge>ADMIN</Badge>
                    </div>
                </div>
            </section>

            {/* Database Info */}
            <section className="rounded-2xl border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <Database className="size-5 text-green-400" />
                    </div>
                    <div>
                        <h2 className="font-semibold">База данных</h2>
                        <p className="text-xs text-muted-foreground">Информация о хранилище</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-muted-foreground">СУБД</span>
                        <span className="text-sm font-medium font-mono">{dbVersion}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-muted-foreground">Пользователей</span>
                        <span className="text-sm font-medium">{userCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-muted-foreground">Чатов</span>
                        <span className="text-sm font-medium">{chatCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-muted-foreground">Сообщений</span>
                        <span className="text-sm font-medium">{messageCount}</span>
                    </div>
                </div>
            </section>

            {/* Platform Info */}
            <section className="rounded-2xl border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <Server className="size-5 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="font-semibold">Платформа</h2>
                        <p className="text-xs text-muted-foreground">Техническая информация</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-muted-foreground">Фреймворк</span>
                        <span className="text-sm font-medium font-mono">Next.js 16</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-muted-foreground">ORM</span>
                        <span className="text-sm font-medium font-mono">Prisma 5</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-muted-foreground">Аутентификация</span>
                        <span className="text-sm font-medium font-mono">NextAuth v5</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-muted-foreground">Среда</span>
                        <span className="text-sm font-medium font-mono">{process.env.NODE_ENV}</span>
                    </div>
                </div>
            </section>
        </div>
    )
}
