"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Zap, Lightbulb, CreditCard, BookOpen, HelpCircle, Info } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
// import { User } from "next-auth" // Importing from next-auth in client component might be tricky if not careful with types, better to use any or define simple shape
// Actually User type is safe.

interface SiteHeaderProps {
    user?: {
        name?: string | null
        email?: string | null
        image?: string | null
    } | null
}

const navigation = [
    { name: "Функции", href: "/#features", icon: Zap },
    { name: "Решения", href: "/solutions", icon: Lightbulb },
    { name: "Тарифы", href: "/pricing", icon: CreditCard },
    { name: "Ресурсы", href: "/resources", icon: BookOpen },
    { name: "FAQ", href: "/faq", icon: HelpCircle },
    { name: "О нас", href: "/about", icon: Info },
]

export function SiteHeader({ user }: SiteHeaderProps) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
            <div className="container flex h-16 items-center">
                <div className="mr-8 hidden md:flex items-center">
                    <Link href={user ? "/dashboard" : "/"} className="mr-6 flex items-center space-x-2">
                        <div className="size-6 rounded-md bg-white text-black flex items-center justify-center font-bold">O</div>
                        <span className="hidden font-bold sm:inline-block text-white">
                            Olynero
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || (item.href === "/#features" && pathname === "/")
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-1.5 transition-colors hover:text-white",
                                        isActive ? "text-white" : "text-neutral-400"
                                    )}
                                >
                                    <Icon className="size-3.5 opacity-70" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

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
                                href={user ? "/dashboard" : "/"}
                                className="flex items-center"
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="size-6 rounded-md bg-white text-black flex items-center justify-center font-bold mr-2">O</div>
                                <span className="font-bold">Olynero</span>
                            </Link>
                        </div>
                        <div className="flex flex-col gap-2 py-4 px-7 mt-4">
                            {navigation.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-3 py-3 text-base font-medium text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg px-3 -mx-1 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Icon className="size-4 text-indigo-400" />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search or other items */}
                    </div>
                    <nav className="flex items-center space-x-2">
                        {user ? (
                            <Link href="/dashboard">
                                <Button size="sm" className="bg-white text-black hover:bg-white/90 font-medium">В консоль</Button>
                            </Link>
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

