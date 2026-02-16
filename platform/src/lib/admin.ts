import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function requireAdmin() {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 403 }), session: null }
    }
    // Проверяем роль напрямую из БД (сессия может кэшироваться)
    const dbUser = await db.user.findUnique({
        where: { id: userId },
        select: { role: true },
    })
    if (dbUser?.role !== "ADMIN") {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 403 }), session: null }
    }
    return { error: null, session }
}
