"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Key, AlertTriangle, Loader2, LogOut, Plus, Trash2, Copy } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { updateProfile, deleteAccount } from "@/actions/auth-actions";
import { createApiKey, getApiKeys, deleteApiKey } from "@/actions/apikey-actions";

type ApiKeyInfo = {
    id: string;
    name: string;
    prefix: string;
    lastUsedAt: Date | null;
    createdAt: Date;
};

import { getUserUsageAction } from "@/actions/usage-actions";
import { Progress } from "@/components/ui/progress";
import { Database, Zap } from "lucide-react";

function UsageSection() {
    const [usage, setUsage] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserUsageAction().then((res) => {
            if (res.success) {
                setUsage(res.usage);
            }
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center text-neutral-500">Загрузка статистики...</div>;
    if (!usage) return null;

    const aiPercent = Math.min(100, (usage.aiTokensUsed / usage.limitAI) * 100);
    const storagePercent = Math.min(100, (usage.storageUsedBytes / usage.limitStorage) * 100);
    const storageUsedMB = (usage.storageUsedBytes / (1024 * 1024)).toFixed(2);
    const limitStorageMB = (usage.limitStorage / (1024 * 1024)).toFixed(0);

    return (
        <section className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl p-6 md:p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Database className="size-6 text-amber-400" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-white">Лимиты и Квоты</h2>
                    <p className="text-sm text-neutral-400">Использование ресурсов платформы.</p>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-neutral-300 flex items-center gap-2">
                            <Zap className="size-4 text-yellow-400" /> AI Токены
                        </span>
                        <span className="text-neutral-400">{usage.aiTokensUsed} / {usage.limitAI}</span>
                    </div>
                    <Progress value={aiPercent} className="h-2 bg-black/40" indicatorClassName={aiPercent > 90 ? "bg-red-500" : "bg-indigo-500"} />
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-neutral-300 flex items-center gap-2">
                            <Database className="size-4 text-blue-400" /> Хранилище
                        </span>
                        <span className="text-neutral-400">{storageUsedMB} MB / {limitStorageMB} MB</span>
                    </div>
                    <Progress value={storagePercent} className="h-2 bg-black/40" indicatorClassName={storagePercent > 90 ? "bg-red-500" : "bg-emerald-500"} />
                </div>
            </div>
        </section>
    );
}

export default function SettingsPage() {
    const { data: session, update: updateSession } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

    // API Keys state
    const [apiKeys, setApiKeys] = useState<ApiKeyInfo[]>([]);
    const [isCreatingKey, setIsCreatingKey] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [showNewKeyForm, setShowNewKeyForm] = useState(false);
    const [revealedKey, setRevealedKey] = useState<string | null>(null);

    useEffect(() => {
        getApiKeys().then((keys) => setApiKeys(keys as ApiKeyInfo[])).catch(() => { });
    }, []);

    const handleSave = async () => {
        const newName = nameInputRef.current?.value?.trim();
        if (!newName) {
            toast.error("Имя не может быть пустым");
            return;
        }

        setIsLoading(true);
        try {
            const result = await updateProfile(newName);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Настройки профиля обновлены");
                await updateSession({ name: newName });
            }
        } catch {
            toast.error("Произошла ошибка");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateKey = async () => {
        if (!newKeyName.trim()) {
            toast.error("Введите название ключа");
            return;
        }
        setIsCreatingKey(true);
        try {
            const result = await createApiKey(newKeyName.trim());
            if (result.error) {
                toast.error(result.error);
            } else if (result.key) {
                setRevealedKey(result.key);
                setNewKeyName("");
                setShowNewKeyForm(false);
                // Refresh list
                const keys = await getApiKeys();
                setApiKeys(keys as ApiKeyInfo[]);
                toast.success("API-ключ создан! Скопируйте его — он больше не будет показан.");
            }
        } catch {
            toast.error("Ошибка создания ключа");
        } finally {
            setIsCreatingKey(false);
        }
    };

    const handleDeleteKey = async (keyId: string) => {
        try {
            await deleteApiKey(keyId);
            setApiKeys((prev) => prev.filter((k) => k.id !== keyId));
            toast.success("Ключ удалён");
        } catch {
            toast.error("Ошибка удаления");
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteAccount();
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Аккаунт удалён");
                signOut({ callbackUrl: "/" });
            }
        } catch {
            toast.error("Произошла ошибка при удалении");
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
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
                                ref={nameInputRef}
                                id="name"
                                defaultValue={session?.user?.name || ""}
                                className="h-11 bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-indigo-500/50"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-neutral-300">Email</Label>
                            <Input
                                id="email"
                                defaultValue={session?.user?.email || ""}
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

                {/* Usage Section */}
                <UsageSection />

                {/* API Keys Section */}
                <section className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <Key className="size-6 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">API Ключи</h2>
                                <p className="text-sm text-neutral-400">Управление доступом к Olynero SDK.</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowNewKeyForm(true)}
                            className="border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white"
                        >
                            <Plus className="mr-2 size-4" />
                            Новый ключ
                        </Button>
                    </div>

                    {/* Revealed key banner */}
                    {revealedKey && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <p className="text-sm text-emerald-400 mb-2 font-medium">Ваш новый API-ключ (скопируйте сейчас — он больше не будет показан):</p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 text-xs bg-black/40 p-3 rounded-lg text-white font-mono break-all">{revealedKey}</code>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        navigator.clipboard.writeText(revealedKey);
                                        toast.success("Скопировано");
                                    }}
                                    className="shrink-0 text-emerald-400 hover:bg-emerald-500/10"
                                >
                                    <Copy className="size-4" />
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setRevealedKey(null)}
                                className="mt-2 text-xs text-neutral-400"
                            >
                                Скрыть
                            </Button>
                        </div>
                    )}

                    {/* Create key form */}
                    {showNewKeyForm && (
                        <div className="mb-6 p-4 rounded-xl bg-black/20 border border-white/10">
                            <Label className="text-neutral-300 mb-2 block">Название ключа</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                    placeholder="Например: My App"
                                    className="h-10 bg-black/40 border-white/10 text-white flex-1"
                                />
                                <Button
                                    onClick={handleCreateKey}
                                    disabled={isCreatingKey}
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4"
                                >
                                    {isCreatingKey ? <Loader2 className="size-4 animate-spin" /> : "Создать"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { setShowNewKeyForm(false); setNewKeyName(""); }}
                                    className="text-neutral-400"
                                >
                                    Отмена
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Keys list */}
                    {apiKeys.length === 0 && !showNewKeyForm ? (
                        <div className="rounded-xl border border-dashed border-white/10 bg-black/20 p-8 flex flex-col items-center justify-center text-center">
                            <div className="size-10 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <Key className="size-5 text-neutral-500" />
                            </div>
                            <p className="text-sm text-neutral-400">У вас пока нет активных API ключей.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {apiKeys.map((key) => (
                                <div key={key.id} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5">
                                    <div>
                                        <p className="font-medium text-white text-sm">{key.name}</p>
                                        <p className="text-xs text-neutral-500 font-mono mt-1">{key.prefix}</p>
                                        <p className="text-xs text-neutral-500 mt-1">
                                            Создан {new Date(key.createdAt).toLocaleDateString("ru-RU")}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteKey(key.id)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
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
                        {!showDeleteConfirm ? (
                            <Button
                                variant="destructive"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/30"
                            >
                                Удалить аккаунт
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="border-white/10 text-neutral-300"
                                >
                                    Отмена
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Да, удалить навсегда
                                </Button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
