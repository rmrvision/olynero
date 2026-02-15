"use client"

import { Layers, Terminal, Settings, ChevronDown, User2, LayoutDashboard, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useSession, signOut } from "next-auth/react"

export function AppSidebar() {
    const { data: session } = useSession();
    const pathname = usePathname();

    return (
        <Sidebar className="border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl">
            <SidebarHeader className="border-b border-white/5 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Terminal className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-white">Olynero AI</span>
                        <span className="text-xs text-neutral-500">v1.2.0 Enterprise</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="px-2 py-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-medium uppercase text-neutral-500">Платформа</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === "/dashboard"} className="text-neutral-400 hover:bg-white/5 hover:text-white data-[active=true]:bg-white/5 data-[active=true]:text-white">
                                    <Link href="/dashboard">
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>Дашборд</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === "/dashboard"} className="text-neutral-400 hover:bg-white/5 hover:text-white data-[active=true]:bg-white/5 data-[active=true]:text-white">
                                    <Link href="/dashboard">
                                        <Layers className="h-4 w-4" />
                                        <span>Мои Проекты</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === "/settings"} className="text-neutral-400 hover:bg-white/5 hover:text-white data-[active=true]:bg-white/5 data-[active=true]:text-white">
                                    <Link href="/settings">
                                        <Settings className="h-4 w-4" />
                                        <span>Настройки</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-white/5 p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="h-12 w-full justify-start gap-3 rounded-xl border border-white/5 bg-white/5 px-3 hover:bg-white/10">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
                                        {session?.user?.image ? (
                                            <img src={session.user.image} alt="User" className="h-full w-full rounded-full object-cover" />
                                        ) : (
                                            <User2 className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div className="flex flex-col items-start gap-0.5 overflow-hidden text-left">
                                        <span className="text-sm font-medium text-white truncate w-full">{session?.user?.name || "Пользователь"}</span>
                                        <span className="text-xs text-neutral-500 truncate w-full">{session?.user?.email || "user@olynero.ai"}</span>
                                    </div>
                                    <ChevronDown className="ml-auto h-4 w-4 text-neutral-500" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width] min-w-56 bg-zinc-950 border-white/10 text-white"
                            >
                                <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white">
                                    <Link href="/settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Настройки</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                                    onClick={() => signOut({ callbackUrl: "/login" })}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Выйти</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}


