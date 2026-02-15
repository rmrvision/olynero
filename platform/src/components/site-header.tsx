"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const navigation = [
    { name: "Функции", href: "/#features" },
    { name: "Решения", href: "/solutions" },
    { name: "Тарифы", href: "/pricing" },
    { name: "Ресурсы", href: "/resources" },
    { name: "О нас", href: "/about" },
]

export function SiteHeader() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
            <div className="container flex h-16 items-center">
                <div className="mr-8 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <div className="size-6 rounded-md bg-white text-black flex items-center justify-center font-bold">O</div>
                        <span className="hidden font-bold sm:inline-block text-white">
                            Olynero
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "transition-colors hover:text-foreground/80 text-foreground/60",
                                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
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
                                href="/"
                                className="flex items-center"
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="size-6 rounded-md bg-white text-black flex items-center justify-center font-bold mr-2">O</div>
                                <span className="font-bold">Olynero</span>
                            </Link>
                        </div>
                        <div className="flex flex-col gap-4 py-4 px-7 mt-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-lg font-medium text-white/70 hover:text-white transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search or other items */}
                    </div>
                    <nav className="flex items-center space-x-2">
                        <Link href="/login">
                            <Button variant="ghost" className="text-white hover:text-white/80 hover:bg-white/10">Войти</Button>
                        </Link>
                        <Link href="/register">
                            <Button className="bg-white text-black hover:bg-white/90">Начать</Button>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}
