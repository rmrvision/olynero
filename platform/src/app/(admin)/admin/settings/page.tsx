import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Shield, Database, Server, Users } from "lucide-react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default async function AdminSettingsPage() {
    const session = await auth()

    // Safe query for DB version
    let dbVersion = "PostgreSQL"
    try {
        const dbStats = await db.$queryRaw<{ version: string }[]>`SELECT version()`
        dbVersion = dbStats[0]?.version?.split(",")[0] || "PostgreSQL"
    } catch (e) {
        console.error("Failed to fetch DB version", e)
    }

    const userCount = await db.user.count()

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-3xl text-white">
            <div>
                <h1 className="text-2xl font-bold mb-1 text-white">Настройки</h1>
                <p className="text-sm text-neutral-400">Конфигурация платформы</p>
            </div>

            {/* Admin Account */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Shield className="size-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-semibold">Аккаунт администратора</h2>
                        <p className="text-xs text-neutral-400">Текущая сессия</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-neutral-400">Имя</span>
                        <span className="text-sm font-medium">{session?.user?.name || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-neutral-400">Email</span>
                        <span className="text-sm font-medium">{session?.user?.email || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-neutral-400">Роль</span>
                        <Badge>ADMIN</Badge>
                    </div>
                </div>
            </section>

            {/* Database Info */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <Database className="size-5 text-green-400" />
                    </div>
                    <div>
                        <h2 className="font-semibold">База данных</h2>
                        <p className="text-xs text-neutral-400">Информация о хранилище</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-white/10 bg-white/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-white">СУБД</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-mono">{dbVersion}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-white/10 bg-white/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-white">Пользователи</CardTitle>
                            <Users className="h-4 w-4 text-neutral-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{userCount}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Platform Info */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <Server className="size-5 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="font-semibold">Платформа</h2>
                        <p className="text-xs text-neutral-400">Техническая информация</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-neutral-400">Фреймворк</span>
                        <span className="text-sm font-medium font-mono">Next.js 16</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-neutral-400">ORM</span>
                        <span className="text-sm font-medium font-mono">Prisma 5</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-neutral-400">Аутентификация</span>
                        <span className="text-sm font-medium font-mono">NextAuth v5</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-neutral-400">Среда</span>
                        <span className="text-sm font-medium font-mono">{process.env.NODE_ENV}</span>
                    </div>
                </div>
            </section>
        </div>
    )
}

