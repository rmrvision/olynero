"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    BarChart3,
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
    { title: "Чаты", href: "/admin/chats", icon: MessageSquare },
    { title: "Аналитика", href: "/admin/analytics", icon: BarChart3 },
    { title: "Настройки", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-1">
                    <div className="size-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                        <Shield className="size-3.5" />
                    </div>
                    <span className="font-bold text-lg">Админ</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Навигация</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                const isActive = item.href === "/admin"
                                    ? pathname === "/admin"
                                    : pathname.startsWith(item.href)
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild isActive={isActive}>
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
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/chat">
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
