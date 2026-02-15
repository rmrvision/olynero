"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { register } from "@/actions/auth-actions"
import { useRouter } from "next/navigation"
import { GithubLoginButton } from "@/components/github-login-button"

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        try {
            const form = event.currentTarget
            const result = await register({
                name: (form.elements.namedItem("name") as HTMLInputElement).value,
                email: (form.elements.namedItem("email") as HTMLInputElement).value,
                password: (form.elements.namedItem("password") as HTMLInputElement).value,
            })

            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Аккаунт создан! Теперь войдите.")
                router.push("/login")
            }
        } catch (error) {
            toast.error("Произошла ошибка. Попробуйте ещё раз.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Создать аккаунт</h1>
                <p className="text-neutral-400">
                    Начните работу с Olynero AI бесплатно.
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-neutral-300">Полное имя</Label>
                    <Input
                        name="name"
                        id="name"
                        placeholder="Иван Иванов"
                        required
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50"
                    />
                </div>
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
                        placeholder="Минимум 6 символов"
                        required
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50"
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full h-12 bg-white text-black hover:bg-white/90 font-semibold text-base rounded-xl"
                    disabled={isLoading}
                >
                    {isLoading ? "Создание..." : "Создать аккаунт"}
                </Button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-neutral-500">Или</span>
                </div>
            </div>

            <GithubLoginButton />

            <div className="mt-8 text-center text-sm text-neutral-500">
                Уже есть аккаунт?{" "}
                <Link href="/login" className="text-white hover:text-indigo-400 transition-colors font-medium">
                    Войти
                </Link>
            </div>
        </div>
    )
}
