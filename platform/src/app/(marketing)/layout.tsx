import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { auth } from "@/auth"

export default async function MarketingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    return (
        <div className="flex min-h-screen flex-col bg-black text-white selection:bg-white/20">
            <SiteHeader user={session?.user} />
            <main className="flex-1">
                {children}
            </main>
            <SiteFooter />
        </div>
    )
}

