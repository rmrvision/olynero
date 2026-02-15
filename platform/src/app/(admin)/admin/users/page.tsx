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
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Поиск по имени или email..."
                        className="pl-9"
                    />
                </div>
                <Button type="submit" variant="outline">Найти</Button>
            </form>

            {/* Table */}
            <div className="rounded-xl border border-white/10 bg-white/5">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-4">Пользователь</TableHead>
                            <TableHead>Роль</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Чатов</TableHead>
                            <TableHead>Регистрация</TableHead>
                            <TableHead className="w-10"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Загрузка...</TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Пользователи не найдены</TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="pl-4">
                                        <Link href={`/admin/users/${user.id}`} className="hover:underline">
                                            <div>
                                                <p className="font-medium">{user.name || "Без имени"}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
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
                                    <TableCell className="text-muted-foreground">{user._count.chats}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="size-8">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/users/${user.id}`}>Подробнее</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toggleRole(user.id, user.role)}>
                                                    <Shield className="mr-2 size-4" />
                                                    {user.role === "ADMIN" ? "Убрать админ" : "Сделать админом"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toggleActive(user.id, user.isActive)}>
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
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Страница {page} из {pages}</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                            <ChevronLeft className="size-4 mr-1" /> Назад
                        </Button>
                        <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>
                            Далее <ChevronRight className="size-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
