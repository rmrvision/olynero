"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { login } from "@/actions/auth-actions"
import { useRouter } from "next/navigation"
import { GithubLoginButton } from "@/components/github-login-button"

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await login(formData)

        setIsLoading(false)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success("Вход выполнен!")
        }
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">С возвращением</h1>
                <p className="text-neutral-400">
                    Введите ваш email для входа в аккаунт.
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-neutral-300">Email</Label>
                    <Input
                        name="email"
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-neutral-300">Пароль</Label>
                    <Input
                        name="password"
                        id="password"
                        type="password"
                        required
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50"
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full h-12 bg-white text-black hover:bg-white/90 font-semibold text-base rounded-xl"
                    disabled={isLoading}
                >
                    {isLoading ? "Вход..." : "Войти"}
                </Button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-neutral-500">Билет в будущее</span>
                </div>
            </div>

            <GithubLoginButton />

            <div className="mt-8 text-center text-sm text-neutral-500">
                Нет аккаунта?{" "}
                <Link href="/register" className="text-white hover:text-indigo-400 transition-colors font-medium">
                    Зарегистрироваться
                </Link>
            </div>
        </div>
    )
}
