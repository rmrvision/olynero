import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Separator } from "@/components/ui/separator"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-zinc-950 text-white overflow-hidden">
            <AdminSidebar />
            <main className="flex-1 flex flex-col min-w-0 h-full transition-all duration-300 ease-in-out">
                <header className="flex h-14 shrink-0 items-center gap-2 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl px-4">
                    <SidebarTrigger className="-ml-1 text-neutral-400 hover:text-white" />
                    <Separator orientation="vertical" className="mr-2 h-4 bg-white/10" />
                    <span className="text-sm font-medium text-neutral-400">Панель администратора</span>
                </header>
                <div className="flex-1 overflow-auto bg-zinc-950">
                    {children}
                </div>
            </main>
            </div>
        </SidebarProvider>
    )
}
