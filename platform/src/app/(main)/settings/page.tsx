"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Key, AlertTriangle, Loader2, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    // Mock save function
    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Настройки профиля обновлены");
        }, 1000);
    };

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto overflow-y-auto h-full text-white">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-white">Настройки</h1>
                <p className="text-neutral-400">Управление профилем, API-ключами и настройками аккаунта.</p>
            </div>

            <div className="space-y-8">
                {/* Profile Section */}
                <section className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="size-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <User className="size-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Профиль</h2>
                            <p className="text-sm text-neutral-400">Личная информация и отображение.</p>
                        </div>
                    </div>

                    <div className="max-w-xl space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-neutral-300">Отображаемое имя</Label>
                            <Input
                                id="name"
                                defaultValue={session?.user?.name || "Пользователь"}
                                className="h-11 bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-indigo-500/50"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-neutral-300">Email</Label>
                            <Input
                                id="email"
                                defaultValue={session?.user?.email || "user@example.com"}
                                disabled
                                className="h-11 bg-white/5 border-white/5 text-neutral-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-neutral-500">Email управляется вашим провайдером авторизации.</p>
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="bg-white text-black hover:bg-neutral-200 font-medium px-6"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Сохранить изменения
                        </Button>
                    </div>
                </section>

                {/* API Keys Section */}
                <section className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Key className="size-6 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">API Ключи</h2>
                            <p className="text-sm text-neutral-400">Управление доступом к Olynero SDK.</p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-dashed border-white/10 bg-black/20 p-8 flex flex-col items-center justify-center text-center">
                        <div className="size-10 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Key className="size-5 text-neutral-500" />
                        </div>
                        <p className="text-sm text-neutral-400 mb-4">У вас пока нет активных API ключей.</p>
                        <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white">
                            Создать новый ключ
                        </Button>
                    </div>
                </section>

                {/* Sign Out */}
                <section className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl p-6 md:p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-neutral-500/10 border border-white/5 flex items-center justify-center">
                                <LogOut className="size-6 text-neutral-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Выйти из аккаунта</h2>
                                <p className="text-sm text-neutral-400">Завершить текущую сессию</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })} className="border-white/10 text-white hover:bg-white/10">
                            <LogOut className="mr-2 size-4" />
                            Выйти
                        </Button>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="rounded-2xl border border-red-500/10 bg-red-500/5 backdrop-blur-xl p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="size-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <AlertTriangle className="size-6 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-red-400">Опасная зона</h2>
                            <p className="text-sm text-red-500/70">Действия, которые нельзя отменить.</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                        <div>
                            <p className="font-medium text-white mb-1">Удалить аккаунт</p>
                            <p className="text-sm text-neutral-400">Безвозвратно удалить аккаунт и все связанные проекты.</p>
                        </div>
                        <Button variant="destructive" className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/30">
                            Удалить аккаунт
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
}
