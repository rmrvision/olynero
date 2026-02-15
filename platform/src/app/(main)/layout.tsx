import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-zinc-950 text-white overflow-hidden">
                <AppSidebar />
                <main className="flex-1 flex flex-col min-w-0 h-full transition-all duration-300 ease-in-out">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl px-4 sticky top-0 z-10">
                        <SidebarTrigger className="-ml-1 text-neutral-400 hover:text-white" />
                        <Separator orientation="vertical" className="mr-2 h-4 bg-white/10" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/dashboard" className="text-neutral-400 hover:text-white transition-colors">
                                        Olynero AI
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block text-neutral-600" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-white font-medium">Рабочая область</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </header>
                    <div className="flex-1 overflow-auto relative bg-zinc-950">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}

