"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    User,
    Mail,
    Settings,
    FolderKanban,
    LogOut,
    Camera,
    Loader2,
    Edit3,
    ChevronRight,
    Sparkles,
    Zap,
    Crown,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { getProjectCount } from "./actions";

function getAvatarUrl(user: { image?: string | null; email?: string | null; id?: string | null }) {
    if (user.image) return user.image;
    return `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(user.email || user.id || "user")}`;
}

// TODO: заменить на реальные данные из БД когда будет система токенов
const MOCK_TOKEN_LIMIT = 100000;
const MOCK_TOKENS_USED = 42350;
const MOCK_TOKENS_REMAINING = MOCK_TOKEN_LIMIT - MOCK_TOKENS_USED;

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [projectCount, setProjectCount] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (session?.user?.name) setDisplayName((prev) => prev || session.user.name);
    }, [session?.user?.name]);

    useEffect(() => {
        if (!session?.user?.id) return;
        getProjectCount().then(setProjectCount).catch(() => setProjectCount(0));
    }, [session?.user?.id]);

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-[400px] py-20">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
            </div>
        );
    }
    if (!session?.user) {
        redirect("/login");
    }

    const user = session.user;
    const avatarUrl = getAvatarUrl(user);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await new Promise((r) => setTimeout(r, 800));
            toast.success("Профиль обновлён");
            setIsEditing(false);
        } catch {
            toast.error("Не удалось сохранить");
        } finally {
            setIsSaving(false);
        }
    };

    const usedPercent = Math.round((MOCK_TOKENS_USED / MOCK_TOKEN_LIMIT) * 100);

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto text-white">
            {/* Cover / Banner */}
            <div className="relative h-32 md:h-40 -mx-6 md:-mx-10 -mt-6 md:-mt-6 mb-8 rounded-b-2xl overflow-hidden bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-transparent">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
            </div>

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 -mt-20 relative z-10">
                <div className="relative group">
                    <Avatar className="h-24 w-24 md:h-28 md:w-28 border-4 border-zinc-900 shadow-2xl ring-2 ring-indigo-500/30">
                        <AvatarImage src={avatarUrl} alt={user.name || "Avatar"} />
                        <AvatarFallback className="bg-indigo-500/20 text-indigo-300 text-2xl">
                            {(user.name || user.email || "?")[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 size-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="size-3.5 text-neutral-400" />
                    </div>
                </div>

                <div className="flex-1 pt-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                        {user.name || "Пользователь"}
                    </h1>
                    <p className="text-neutral-400 flex items-center gap-2 mb-4">
                        <Mail className="size-4" />
                        {user.email}
                    </p>

                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                            <FolderKanban className="size-4 text-indigo-400" />
                            <span className="text-sm">
                                <span className="font-semibold text-white">{projectCount ?? "—"}</span>
                                <span className="text-neutral-400 ml-1">проектов</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-white/10 text-white hover:bg-white/10"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <Edit3 className="mr-2 size-4" />
                            {isEditing ? "Отмена" : "Редактировать профиль"}
                        </Button>
                        <Link href="/settings">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-white/10 text-white hover:bg-white/10"
                            >
                                <Settings className="mr-2 size-4" />
                                Настройки
                                <ChevronRight className="ml-1 size-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Тариф */}
            <section className="mt-8 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="size-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <Crown className="size-6 text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Тарифный план</h2>
                        <p className="text-sm text-neutral-400">Текущая подписка и лимиты</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-500/10">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <Zap className="size-5 text-amber-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">Бесплатный</p>
                            <p className="text-xs text-neutral-400">100 000 токенов в месяц</p>
                        </div>
                    </div>
                    <Link href="/pricing" className="ml-auto">
                        <Button variant="outline" size="sm" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                            Сменить тариф
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Токены */}
            <section className="mt-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl p-6 md:p-8 overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                    <div className="size-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <Sparkles className="size-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Баланс токенов</h2>
                        <p className="text-sm text-neutral-400">Использование в текущем периоде</p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 mb-6">
                    <div className="rounded-xl bg-black/30 border border-white/5 p-5">
                        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">Всего</p>
                        <p className="text-2xl font-bold text-white tabular-nums">
                            {MOCK_TOKEN_LIMIT.toLocaleString("ru-RU")}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">токенов в этом месяце</p>
                    </div>
                    <div className="rounded-xl bg-black/30 border border-white/5 p-5">
                        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">Использовано</p>
                        <p className="text-2xl font-bold text-amber-400 tabular-nums">
                            {MOCK_TOKENS_USED.toLocaleString("ru-RU")}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">{usedPercent}% от лимита</p>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-5">
                        <p className="text-xs font-medium text-emerald-400/80 uppercase tracking-wider mb-1">Осталось</p>
                        <p className="text-2xl font-bold text-emerald-400 tabular-nums">
                            {MOCK_TOKENS_REMAINING.toLocaleString("ru-RU")}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">до конца периода</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-neutral-400">
                        <span>Использовано</span>
                        <span>{usedPercent}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-black/40 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-amber-500 to-amber-400 transition-all duration-500"
                            style={{ width: `${Math.min(usedPercent, 100)}%` }}
                        />
                    </div>
                </div>
            </section>

            {/* Edit Profile Form */}
            {isEditing && (
                <section className="mt-8 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl p-6 md:p-8">
                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <User className="size-5 text-indigo-400" />
                        Редактирование профиля
                    </h2>
                    <div className="max-w-xl space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="displayName" className="text-neutral-300">
                                Отображаемое имя
                            </Label>
                            <Input
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="h-11 bg-black/40 border-white/10 text-white"
                                placeholder="Ваше имя"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-neutral-300">Email</Label>
                            <Input
                                value={user.email || ""}
                                disabled
                                className="h-11 bg-white/5 border-white/5 text-neutral-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-neutral-500">
                                Email управляется провайдером авторизации.
                            </p>
                        </div>
                        <Button
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="bg-white text-black hover:bg-neutral-200 font-medium px-6"
                        >
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Сохранить изменения
                        </Button>
                    </div>
                </section>
            )}

            {/* Quick Links */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Link
                    href="/dashboard"
                    className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group"
                >
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <FolderKanban className="size-6 text-indigo-400" />
                        </div>
                        <div>
                            <p className="font-medium text-white">Мои проекты</p>
                            <p className="text-sm text-neutral-400">Управление проектами</p>
                        </div>
                    </div>
                    <ChevronRight className="size-5 text-neutral-500 group-hover:text-white transition-colors" />
                </Link>

                <Link
                    href="/settings"
                    className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group"
                >
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Settings className="size-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="font-medium text-white">Настройки</p>
                            <p className="text-sm text-neutral-400">API ключи, безопасность</p>
                        </div>
                    </div>
                    <ChevronRight className="size-5 text-neutral-500 group-hover:text-white transition-colors" />
                </Link>
            </div>

            {/* Sign Out */}
            <section className="mt-8 rounded-2xl border border-white/5 bg-white/5 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-neutral-500/10 border border-white/5 flex items-center justify-center">
                            <LogOut className="size-6 text-neutral-400" />
                        </div>
                        <div>
                            <p className="font-medium text-white">Выйти из аккаунта</p>
                            <p className="text-sm text-neutral-400">Завершить текущую сессию</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="border-white/10 text-white hover:bg-white/10 shrink-0"
                    >
                        <LogOut className="mr-2 size-4" />
                        Выйти
                    </Button>
                </div>
            </section>
        </div>
    );
}
