"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Key, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="p-6 md:p-10 max-w-3xl mx-auto overflow-y-auto h-full">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Настройки</h1>
                <p className="text-muted-foreground text-sm">Управление аккаунтом и предпочтениями.</p>
            </div>

            <div className="space-y-8">
                {/* Profile Section */}
                <section className="rounded-2xl border bg-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <User className="size-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-semibold">Профиль</h2>
                            <p className="text-xs text-muted-foreground">Основная информация о вашем аккаунте.</p>
                        </div>
                    </div>
                    <div className="grid gap-4 max-w-md">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Отображаемое имя</Label>
                            <Input id="name" defaultValue="John Doe" className="h-11" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" defaultValue="john@example.com" disabled className="h-11" />
                            <p className="text-xs text-muted-foreground">Email управляется вашим провайдером.</p>
                        </div>
                        <Button className="w-fit">Сохранить изменения</Button>
                    </div>
                </section>

                {/* API Keys Section */}
                <section className="rounded-2xl border bg-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                            <Key className="size-5 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="font-semibold">API Ключи</h2>
                            <p className="text-xs text-muted-foreground">Управление ключами для доступа к Olynero SDK.</p>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-muted/30 p-4 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">У вас пока нет API ключей.</p>
                        <Button variant="outline" size="sm">Создать ключ</Button>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                            <AlertTriangle className="size-5 text-destructive" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-destructive">Опасная зона</h2>
                            <p className="text-xs text-muted-foreground">Необратимые действия с аккаунтом.</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-sm">Удалить аккаунт</p>
                            <p className="text-xs text-muted-foreground">Навсегда удалить аккаунт и все данные.</p>
                        </div>
                        <Button variant="destructive" size="sm">Удалить</Button>
                    </div>
                </section>
            </div>
        </div>
    )
}
