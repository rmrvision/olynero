import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/admin"

export async function GET() {
    const { error } = await requireAdmin()
    if (error) return error

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [
        totalUsers,
        activeUsers,
        totalChats,
        totalMessages,
        newUsersThisMonth,
        newUsersThisWeek,
        newChatsThisMonth,
        newChatsThisWeek,
    ] = await Promise.all([
        db.user.count(),
        db.user.count({ where: { isActive: true } }),
        db.chat.count(),
        db.message.count(),
        db.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        db.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
        db.chat.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        db.chat.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    ])

    return NextResponse.json({
        totalUsers,
        activeUsers,
        totalChats,
        totalMessages,
        newUsersThisMonth,
        newUsersThisWeek,
        newChatsThisMonth,
        newChatsThisWeek,
    })
}
