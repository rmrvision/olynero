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

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault()
        setIsLoading(true)

        // Simulate registration delay
        setTimeout(() => {
            setIsLoading(false)
            toast.success("Аккаунт успешно создан!")
        }, 1000)
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Регистрация</CardTitle>
                <CardDescription>
                    Создайте аккаунт, чтобы начать работу с Olynero AI.
                </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Полное имя</Label>
                        <Input id="name" placeholder="Иван Иванов" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Пароль</Label>
                        <Input id="password" type="password" required />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" disabled={isLoading}>
                        {isLoading ? "Создание аккаунта..." : "Создать аккаунт"}
                    </Button>
                    <div className="text-center text-sm text-muted-foreground">
                        Уже есть аккаунт?{" "}
                        <Link href="/login" className="underline hover:text-primary">
                            Войти
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}
