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
import { Search, MoreHorizontal, Shield, UserX, UserCheck, Database, Zap, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getUsersAction, updateUserRoleAction, banUserAction } from "@/actions/admin-actions"

type UserRow = {
    id: string
    name: string | null
    email: string
    role: string
    isActive: boolean
    createdAt: Date
    _count: { projects: number }
    usage?: {
        aiTokensUsed: number
        limitAI: number
        storageUsedBytes: number
        limitStorage: number
    }
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserRow[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserRow[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    const loadUsers = async () => {
        setLoading(true)
        const res = await getUsersAction()
        if (res.success && res.users) {
            // Cast the result to UserRow[] as we know the shape matches from the action
            setUsers(res.users as unknown as UserRow[])
            setFilteredUsers(res.users as unknown as UserRow[])
        } else {
            toast.error(res.error || "Failed to load users")
        }
        setLoading(false)
    }

    useEffect(() => {
        loadUsers()
    }, [])

    // Client-side search for now (simplifies server action)
    useEffect(() => {
        if (!search) {
            setFilteredUsers(users)
        } else {
            const lower = search.toLowerCase()
            setFilteredUsers(users.filter(u =>
                (u.name?.toLowerCase().includes(lower)) ||
                (u.email.toLowerCase().includes(lower))
            ))
        }
    }, [search, users])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
    }

    const toggleActive = async (userId: string, current: boolean) => {
        if (current && !confirm("Are you sure you want to ban this user?")) return

        const res = await banUserAction(userId, !current)
        if (res.success) {
            toast.success(current ? "User banned" : "User activated")
            loadUsers()
        } else {
            toast.error("Failed to update status")
        }
    }

    const toggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN"
        // @ts-ignore
        const res = await updateUserRoleAction(userId, newRole)
        if (res.success) {
            toast.success(`Role changed to ${newRole}`)
            loadUsers()
        } else {
            toast.error("Failed to update role")
        }
    }

    return (
        <div className="p-6 md:p-8 space-y-6 text-white min-h-screen">
            <div>
                <h1 className="text-2xl font-bold mb-1 text-white">Users</h1>
                <p className="text-sm text-neutral-400">Manage platform users ({users.length} total)</p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus-visible:ring-indigo-500/50"
                    />
                </div>
            </form>

            {/* Table */}
            <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="pl-4 h-12 text-neutral-400 font-medium">User</TableHead>
                            <TableHead className="text-neutral-400 font-medium">Role</TableHead>
                            <TableHead className="text-neutral-400 font-medium">Status</TableHead>
                            <TableHead className="text-neutral-400 font-medium">Projects</TableHead>
                            <TableHead className="text-neutral-400 font-medium">Usage</TableHead>
                            <TableHead className="text-neutral-400 font-medium">Registered</TableHead>
                            <TableHead className="w-10"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow className="border-white/5 hover:bg-white/5">
                                <TableCell colSpan={7} className="text-center py-12 text-neutral-400 flex items-center justify-center">
                                    <Loader2 className="animate-spin mr-2" /> Loading...
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow className="border-white/5 hover:bg-white/5">
                                <TableCell colSpan={7} className="text-center py-12 text-neutral-400">No users found</TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="border-white/5 hover:bg-white/5">
                                    <TableCell className="pl-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white">{user.name || "No Name"}</span>
                                            <span className="text-xs text-neutral-400">{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="text-xs">
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.isActive ? "outline" : "destructive"} className="text-xs">
                                            {user.isActive ? "Active" : "Banned"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-neutral-400">{user._count.projects}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-xs text-neutral-400">
                                            <div className="flex items-center gap-1">
                                                <Zap className="size-3 text-yellow-500" />
                                                {user.usage?.aiTokensUsed || 0} / {user.usage?.limitAI || 1000}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Database className="size-3 text-blue-500" />
                                                {((user.usage?.storageUsedBytes || 0) / (1024 * 1024)).toFixed(1)} MB
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-neutral-400 text-sm">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="size-8 text-neutral-400 hover:text-white hover:bg-white/5">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="min-w-48 bg-zinc-950 border-white/10 text-white">
                                                <DropdownMenuItem onClick={() => toggleRole(user.id, user.role)} className="focus:bg-white/5 focus:text-white cursor-pointer">
                                                    <Shield className="mr-2 size-4" />
                                                    {user.role === "ADMIN" ? "Demote to User" : "Promote to Admin"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toggleActive(user.id, user.isActive)} className="focus:bg-white/5 focus:text-white cursor-pointer">
                                                    {user.isActive ? (
                                                        <><UserX className="mr-2 size-4" /> Ban User</>
                                                    ) : (
                                                        <><UserCheck className="mr-2 size-4" /> Activate User</>
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
        </div>
    )
}
