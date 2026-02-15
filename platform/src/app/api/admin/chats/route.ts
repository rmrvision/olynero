import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/admin"

export async function GET(request: NextRequest) {
    const { error } = await requireAdmin()
    if (error) return error

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where = search
        ? { title: { contains: search, mode: "insensitive" as const } }
        : {}

    const [chats, total] = await Promise.all([
        db.chat.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { name: true, email: true } },
                _count: { select: { messages: true } },
            },
        }),
        db.chat.count({ where }),
    ])

    return NextResponse.json({ chats, total, page, limit, pages: Math.ceil(total / limit) })
}
