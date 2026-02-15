"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
    LayoutDashboard,
    Users,
    Settings,
    ArrowLeft,
    Shield,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navItems = [
    { title: "Дашборд", href: "/admin", icon: LayoutDashboard },
    { title: "Пользователи", href: "/admin/users", icon: Users },
    { title: "Настройки", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar className="border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl">
            <SidebarHeader className="border-b border-white/5 p-4">
                <div className="flex items-center gap-2 px-2 py-1">
                    <div className="size-6 rounded-md bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Shield className="size-3.5" />
                    </div>
                    <span className="font-bold text-lg text-white">Админ</span>
                </div>
            </SidebarHeader>
            <SidebarContent className="px-2 py-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-medium uppercase text-neutral-500">Навигация</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                const isActive = item.href === "/admin"
                                    ? pathname === "/admin"
                                    : pathname.startsWith(item.href)
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild isActive={isActive} className="text-neutral-400 hover:bg-white/5 hover:text-white data-[active=true]:bg-white/5 data-[active=true]:text-white">
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-white/5 p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="text-neutral-400 hover:bg-white/5 hover:text-white">
                            <Link href="/dashboard">
                                <ArrowLeft />
                                <span className="text-sm">Вернуться в приложение</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
