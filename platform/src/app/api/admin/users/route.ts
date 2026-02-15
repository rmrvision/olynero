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
        ? {
            OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { email: { contains: search, mode: "insensitive" as const } },
            ],
        }
        : {}

    const [users, total] = await Promise.all([
        db.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,

            },
        }),
        db.user.count({ where }),
    ])

    return NextResponse.json({ users, total, page, limit, pages: Math.ceil(total / limit) })
}
