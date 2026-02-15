"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, ChevronLeft, ChevronRight, Shield, UserX, UserCheck } from "lucide-react"
import { toast } from "sonner"

type UserRow = {
    id: string
    name: string | null
    email: string
    role: string
    isActive: boolean
    createdAt: string
    _count: { chats: number }
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserRow[]>([])
    const [total, setTotal] = useState(0)
    const [pages, setPages] = useState(1)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        setLoading(true)
        const params = new URLSearchParams()
        if (search) params.set("search", search)
        params.set("page", String(page))
        const res = await fetch(`/api/admin/users?${params}`)
        const data = await res.json()
        setUsers(data.users)
        setTotal(data.total)
        setPages(data.pages)
        setLoading(false)
    }

    useEffect(() => {
        fetchUsers()
    }, [page])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        fetchUsers()
    }

    const toggleActive = async (userId: string, current: boolean) => {
        const res = await fetch(`/api/admin/users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !current }),
        })
        if (res.ok) {
            toast.success(current ? "Пользователь деактивирован" : "Пользователь активирован")
            fetchUsers()
        }
    }

    const toggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN"
        const res = await fetch(`/api/admin/users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: newRole }),
        })
        if (res.ok) {
            toast.success(`Роль изменена на ${newRole}`)
            fetchUsers()
        }
    }

    return (
        <div className="p-6 md:p-8 space-y-6 text-white">
            <div>
                <h1 className="text-2xl font-bold mb-1 text-white">Пользователи</h1>
                <p className="text-sm text-neutral-400">Управление пользователями платформы ({total} всего)</p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Поиск по имени или email..."
                        className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus-visible:ring-indigo-500/50"
                    />
                </div>
                <Button type="submit" variant="outline" className="border-white/10 hover:bg-white/10 text-white">Найти</Button>
            </form>

            {/* Table */}
            <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="pl-4 h-12 text-neutral-400 font-medium">Пользователь</TableHead>
                            <TableHead className="text-neutral-400 font-medium">Роль</TableHead>
                            <TableHead className="text-neutral-400 font-medium">Статус</TableHead>
                            <TableHead className="text-neutral-400 font-medium">Чатов</TableHead>
                            <TableHead className="text-neutral-400 font-medium">Регистрация</TableHead>
                            <TableHead className="w-10"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow className="border-white/5 hover:bg-white/5">
                                <TableCell colSpan={6} className="text-center py-12 text-neutral-400">Загрузка...</TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow className="border-white/5 hover:bg-white/5">
                                <TableCell colSpan={6} className="text-center py-12 text-neutral-400">Пользователи не найдены</TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id} className="border-white/5 hover:bg-white/5">
                                    <TableCell className="pl-4">
                                        <Link href={`/admin/users/${user.id}`} className="hover:underline">
                                            <div>
                                                <p className="font-medium text-white">{user.name || "Без имени"}</p>
                                                <p className="text-xs text-neutral-400">{user.email}</p>
                                            </div>
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="text-xs">
                                            {user.role === "ADMIN" ? "Админ" : "Пользователь"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.isActive ? "outline" : "destructive"} className="text-xs">
                                            {user.isActive ? "Активен" : "Заблокирован"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-neutral-400">{user._count.chats}</TableCell>
                                    <TableCell className="text-neutral-400 text-sm">
                                        {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="size-8 text-neutral-400 hover:text-white hover:bg-white/5">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="min-w-48 bg-zinc-950 border-white/10 text-white">
                                                <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white cursor-pointer">
                                                    <Link href={`/admin/users/${user.id}`}>Подробнее</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toggleRole(user.id, user.role)} className="focus:bg-white/5 focus:text-white cursor-pointer">
                                                    <Shield className="mr-2 size-4" />
                                                    {user.role === "ADMIN" ? "Убрать админ" : "Сделать админом"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toggleActive(user.id, user.isActive)} className="focus:bg-white/5 focus:text-white cursor-pointer">
                                                    {user.isActive ? (
                                                        <><UserX className="mr-2 size-4" /> Заблокировать</>
                                                    ) : (
                                                        <><UserCheck className="mr-2 size-4" /> Разблокировать</>
                                                    )}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pages > 1 && (
                <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-neutral-400">Страница {page} из {pages}</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="border-white/10 text-white hover:bg-white/10 disabled:opacity-50">
                            <ChevronLeft className="size-4 mr-1" /> Назад
                        </Button>
                        <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="border-white/10 text-white hover:bg-white/10 disabled:opacity-50">
                            Далее <ChevronRight className="size-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
