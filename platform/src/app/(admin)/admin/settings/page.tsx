import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Shield, Database, Server } from "lucide-react"
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
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <Database className="size-5 text-green-400" />
                    </div>
                    <div>
                        <h2 className="font-semibold">База данных</h2>
                        <p className="text-xs text-muted-foreground">Информация о хранилище</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">СУБД</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-mono">{dbVersion}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
                            <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{userCount}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

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

function UsersIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
