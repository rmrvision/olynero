import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        await db.$connect();
        const userCount = await db.user.count();
        return NextResponse.json({
            status: "success",
            message: "Connected to Database",
            userCount,
            databaseUrlConfigured: !!process.env.DATABASE_URL
        });
    } catch (error: any) {
        console.error("DB Connection Error:", error);
        return NextResponse.json({
            status: "error",
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
