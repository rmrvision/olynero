import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
        redirect("/login")
    }
    const dbUser = await db.user.findUnique({
        where: { id: userId },
        select: { role: true },
    })
    if (dbUser?.role !== "ADMIN") {
        redirect("/dashboard")
    }

    return (
        <SidebarProvider defaultOpen={false}>
            <div className="flex h-screen w-full bg-zinc-950 text-white overflow-hidden">
            <AdminSidebar />
            <main className="flex-1 flex flex-col min-w-0 h-full transition-all duration-300 ease-in-out">
                <header className="flex h-14 shrink-0 items-center gap-2 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl px-4">
                    <SidebarTrigger className="-ml-1 text-neutral-400 hover:text-white" />
                    <Separator orientation="vertical" className="mr-2 h-4 bg-white/10" />
                    <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <Image src="/olynero-logo.png" alt="Olynero" width={24} height={24} className="size-6" />
                        <span className="font-unbounded font-bold text-white">Olynero</span>
                    </Link>
                </header>
                <div className="flex-1 overflow-auto bg-zinc-950">
                    {children}
                </div>
            </main>
            </div>
        </SidebarProvider>
    )
}
