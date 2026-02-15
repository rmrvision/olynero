"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Search, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react"

type ChatRow = {
    id: string
    title: string
    createdAt: string
    updatedAt: string
    user: { name: string | null; email: string }
    _count: { messages: number }
}

export default function AdminChatsPage() {
    const [chats, setChats] = useState<ChatRow[]>([])
    const [total, setTotal] = useState(0)
    const [pages, setPages] = useState(1)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)

    const fetchChats = async () => {
        setLoading(true)
        const params = new URLSearchParams()
        if (search) params.set("search", search)
        params.set("page", String(page))
        const res = await fetch(`/api/admin/chats?${params}`)
        const data = await res.json()
        setChats(data.chats)
        setTotal(data.total)
        setPages(data.pages)
        setLoading(false)
    }

    useEffect(() => { fetchChats() }, [page])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        fetchChats()
    }

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-1">Чаты</h1>
                <p className="text-sm text-muted-foreground">Все чаты на платформе ({total} всего)</p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Поиск по названию..."
                        className="pl-9"
                    />
                </div>
                <Button type="submit" variant="outline">Найти</Button>
            </form>

            <div className="rounded-xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-4">Название</TableHead>
                            <TableHead>Пользователь</TableHead>
                            <TableHead>Сообщений</TableHead>
                            <TableHead>Создан</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Загрузка...</TableCell>
                            </TableRow>
                        ) : chats.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Чаты не найдены</TableCell>
                            </TableRow>
                        ) : (
                            chats.map((chat) => (
                                <TableRow key={chat.id}>
                                    <TableCell className="pl-4">
                                        <Link href={`/admin/chats/${chat.id}`} className="flex items-center gap-2 hover:underline">
                                            <MessageSquare className="size-4 text-muted-foreground shrink-0" />
                                            <span className="font-medium">{chat.title}</span>
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm">{chat.user.name || "Без имени"}</p>
                                        <p className="text-xs text-muted-foreground">{chat.user.email}</p>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{chat._count.messages}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(chat.createdAt).toLocaleDateString("ru-RU")}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

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
