"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { login } from "@/actions/auth-actions"
import { useRouter } from "next/navigation"

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
            // Redirect is handled by the server action usually, but if we get here without error
            // it means success (though signIn usually redirects)
            toast.success("Вход выполнен!")
            // router.push("/chat") // Redirect handled by NextAuth
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Вход</CardTitle>
                <CardDescription>
                    Введите ваш email для входа в аккаунт.
                </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input name="email" id="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Пароль</Label>
                        <Input name="password" id="password" type="password" required />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" disabled={isLoading}>
                        {isLoading ? "Вход..." : "Войти"}
                    </Button>
                    <div className="text-center text-sm text-muted-foreground">
                        Нет аккаунта?{" "}
                        <Link href="/register" className="underline hover:text-primary">
                            Зарегистрироваться
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}

