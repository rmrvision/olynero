import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function promote(email: string) {
    if (!email) {
        console.error("Please provide an email: npx tsx scripts/promote-admin.ts <email>");
        process.exit(1);
    }

    console.log(`Promoting ${email} to ADMIN...`);

    try {
        const user = await db.user.update({
            where: { email },
            data: { role: "ADMIN" },
        });
        console.log(`Success: User ${user.email} is now ${user.role}`);
    } catch (e) {
        console.error("Failed to promote user:", e);
    }
}

const email = process.argv[2];
promote(email)
    .catch(console.error)
    .finally(() => db.$disconnect());
