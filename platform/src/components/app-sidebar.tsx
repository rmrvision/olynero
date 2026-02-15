"use client"

import { Calendar, Home, Inbox, MessageSquare, Plus, Search, Settings } from "lucide-react"

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
import { Button } from "@/components/ui/button"

// Menu items.
const items = [
    {
        title: "Проект Альфа",
        url: "#",
        icon: MessageSquare,
    },
    {
        title: "Маркетинг Копия",
        url: "#",
        icon: MessageSquare,
    },
    {
        title: "React Компонент",
        url: "#",
        icon: MessageSquare,
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-1">
                    <div className="size-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">O</div>
                    <span className="font-bold text-lg">Olynero</span>
                </div>
                <SidebarGroup>
                    <SidebarGroupLabel>Меню</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="/">
                                        <Home />
                                        <span>Проекты</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarHeader>
            <SidebarContent>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href="/settings">
                                <Settings />
                                <span className="text-sm">Настройки</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
