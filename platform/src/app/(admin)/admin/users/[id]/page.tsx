"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, MessageSquare, MoreHorizontal, Shield, UserX, UserCheck, Trash2, Calendar } from "lucide-react"
import { toast } from "sonner"

type UserDetail = {
    id: string
    name: string | null
    email: string
    role: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    chats: { id: string; title: string; createdAt: string; _count: { messages: number } }[]
}

export default function AdminUserDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [user, setUser] = useState<UserDetail | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchUser = async () => {
        const res = await fetch(`/api/admin/users/${params.id}`)
        if (!res.ok) {
            toast.error("Пользователь не найден")
            router.push("/admin/users")
            return
        }
        setUser(await res.json())
        setLoading(false)
    }

    useEffect(() => { fetchUser() }, [params.id])

    const toggleActive = async () => {
        if (!user) return
        const res = await fetch(`/api/admin/users/${user.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !user.isActive }),
        })
        if (res.ok) {
            toast.success(user.isActive ? "Пользователь заблокирован" : "Пользователь разблокирован")
            fetchUser()
        }
    }

    const toggleRole = async () => {
        if (!user) return
        const newRole = user.role === "ADMIN" ? "USER" : "ADMIN"
        const res = await fetch(`/api/admin/users/${user.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: newRole }),
        })
        if (res.ok) {
            toast.success(`Роль изменена на ${newRole}`)
            fetchUser()
        }
    }

    const deleteUser = async () => {
        if (!user || !confirm("Вы уверены? Это действие необратимо.")) return
        const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" })
        if (res.ok) {
            toast.success("Пользователь удалён")
            router.push("/admin/users")
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-neutral-400">Загрузка...</div>
    }

    if (!user) return null

    return (
        <div className="p-6 md:p-8 space-y-6 text-white">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/admin/users")} className="text-neutral-400 hover:text-white hover:bg-white/5">
                    <ArrowLeft className="size-4" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">{user.name || "Без имени"}</h1>
                    <p className="text-sm text-neutral-400">{user.email}</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Действия <MoreHorizontal className="ml-2 size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={toggleRole}>
                            <Shield className="mr-2 size-4" />
                            {user.role === "ADMIN" ? "Убрать роль админа" : "Сделать админом"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={toggleActive}>
                            {user.isActive ? (
                                <><UserX className="mr-2 size-4" /> Заблокировать</>
                            ) : (
                                <><UserCheck className="mr-2 size-4" /> Разблокировать</>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={deleteUser} className="text-destructive">
                            <Trash2 className="mr-2 size-4" /> Удалить пользователя
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Shield className="size-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400">Роль</p>
                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                            {user.role === "ADMIN" ? "Админ" : "Пользователь"}
                        </Badge>
                    </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                        {user.isActive ? <UserCheck className="size-4 text-green-400" /> : <UserX className="size-4 text-red-400" />}
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400">Статус</p>
                        <Badge variant={user.isActive ? "outline" : "destructive"}>
                            {user.isActive ? "Активен" : "Заблокирован"}
                        </Badge>
                    </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <MessageSquare className="size-4 text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400">Чатов</p>
                        <p className="font-semibold">{user.chats.length}</p>
                    </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                        <Calendar className="size-4 text-yellow-400" />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400">Регистрация</p>
                        <p className="font-semibold text-sm">{new Date(user.createdAt).toLocaleDateString("ru-RU")}</p>
                    </div>
                </div>
            </div>

            <Separator />

            {/* User Chats */}
            <div>
                <h2 className="font-semibold mb-4">Чаты пользователя ({user.chats.length})</h2>
                {user.chats.length === 0 ? (
                    <p className="text-sm text-neutral-400 py-8 text-center border border-white/10 rounded-xl bg-white/5">У этого пользователя нет чатов.</p>
                ) : (
                    <div className="rounded-xl border border-white/10 bg-white/5">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-4">Название</TableHead>
                                    <TableHead>Сообщений</TableHead>
                                    <TableHead>Создан</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {user.chats.map((chat) => (
                                    <TableRow key={chat.id}>
                                        <TableCell className="pl-4">
                                            <Link href={`/admin/chats/${chat.id}`} className="font-medium hover:underline">
                                                {chat.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-neutral-400">{chat._count.messages}</TableCell>
                                        <TableCell className="text-neutral-400 text-sm">
                                            {new Date(chat.createdAt).toLocaleDateString("ru-RU")}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    )
}
