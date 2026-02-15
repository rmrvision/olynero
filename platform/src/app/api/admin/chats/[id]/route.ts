import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/admin"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await requireAdmin()
    if (error) return error

    const { id } = await params

    const chat = await db.chat.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, name: true, email: true } },
            messages: {
                orderBy: { createdAt: "asc" },
            },
        },
    })

    if (!chat) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    return NextResponse.json(chat)
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await requireAdmin()
    if (error) return error

    const { id } = await params

    await db.chat.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
