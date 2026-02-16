"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
// import { User } from "next-auth" // Importing from next-auth in client component might be tricky if not careful with types, better to use any or define simple shape
// Actually User type is safe.

interface SiteHeaderProps {
    user?: {
        id?: string | null
        name?: string | null
        email?: string | null
        image?: string | null
    } | null
}

const navigation = [
    { name: "Функции", href: "/#features" },
    { name: "Решения", href: "/solutions" },
    { name: "Тарифы", href: "/pricing" },
    { name: "Ресурсы", href: "/resources" },
    { name: "FAQ", href: "/faq" },
    { name: "О нас", href: "/about" },
]

export function SiteHeader({ user }: SiteHeaderProps) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center relative">
                <Link href="/" className="flex items-center space-x-2 shrink-0">
                    <Image src="/olynero-logo.png" alt="Olynero" width={28} height={28} className="size-7" priority />
                    <span className="hidden font-unbounded font-bold sm:inline-block text-white">
                        Olynero
                    </span>
                </Link>

                <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-6 text-sm font-medium">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href === "/#features" && pathname === "/")
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "transition-colors hover:text-white",
                                    isActive ? "text-white" : "text-neutral-400"
                                )}
                            >
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* Mobile Menu */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden text-white"
                        >
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="pr-0 bg-black border-white/10 text-white">
                        <div className="px-7">
                            <Link
                                href="/"
                                className="flex items-center"
                                onClick={() => setIsOpen(false)}
                            >
                                <Image src="/olynero-logo.png" alt="Olynero" width={28} height={28} className="size-7 mr-2" />
                                <span className="font-unbounded font-bold">Olynero</span>
                            </Link>
                        </div>
                        <div className="flex flex-col gap-2 py-4 px-7 mt-4">
                            {navigation.map((item) => {
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="py-3 text-base font-medium text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg px-3 -mx-1 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="flex flex-1 items-center justify-end gap-2 ml-auto">
                    <nav className="flex items-center gap-2">
                        {user ? (
                            <>
                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm" className="text-white hover:text-white/90 hover:bg-white/10 font-medium">
                                        Дашборд
                                    </Button>
                                </Link>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-2 py-1 pr-3 hover:bg-white/10 transition-colors"
                                >
                                    <Avatar className="h-8 w-8 ring-1 ring-white/10">
                                        <AvatarImage
                                            src={
                                                user.image ??
                                                `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(user.email || user.id || "user")}`
                                            }
                                            alt={user.name || "Avatar"}
                                        />
                                        <AvatarFallback className="bg-indigo-500/20 text-indigo-300 text-sm">
                                            {(user.name || user.email || "?")[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium text-white hidden sm:inline">
                                        {user.name || user.email || "Профиль"}
                                    </span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="text-white hover:text-white/80 hover:bg-white/10">Войти</Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="bg-white text-black hover:bg-white/90">Начать</Button>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}

