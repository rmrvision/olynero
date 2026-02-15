import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Users, UserCheck } from "lucide-react";

async function getStats() {
    // Only fetch user stats for now
    const [totalUsers, activeUsers, recentUsers] = await Promise.all([
        db.user.count(),
        db.user.count({ where: { isActive: true } }),
        db.user.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            select: { id: true, name: true, email: true, role: true, createdAt: true, isActive: true },
        }),
    ]);

    return { totalUsers, activeUsers, recentUsers };
}

export default async function AdminDashboard() {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        redirect("/");
    }

    const stats = await getStats();

    const statCards = [
        { label: "Всего пользователей", value: stats.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
        { label: "Активные пользователи", value: stats.activeUsers, icon: UserCheck, color: "text-green-400", bg: "bg-green-500/10" },
    ];

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Панель управления</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className="p-6 rounded-2xl border border-white/10 bg-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`size-6 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold">{stat.value}</h3>
                            <p className="text-sm text-neutral-400">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                    <h3 className="text-xl font-bold mb-6">Новые пользователи</h3>
                    <div className="space-y-4">
                        {stats.recentUsers.map((user: any) => (
                            <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold">
                                        {user.name?.[0] || "U"}
                                    </div>
                                    <div>
                                        <p className="font-medium">{user.name || "User"}</p>
                                        <p className="text-xs text-neutral-400">{user.email}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-neutral-500">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                        {stats.recentUsers.length === 0 && (
                            <p className="text-neutral-500 text-center py-4">Нет пользователей</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
