import { Button } from "@/components/ui/button"
import { Book, LifeBuoy, Users } from "lucide-react"

export default function ResourcesPage() {
    return (
        <div className="container py-24 md:py-32">
            <div className="text-center mb-20">
                <h1 className="text-4xl font-bold mb-6">Resources & Support</h1>
                <p className="text-xl text-neutral-400">Everything you need to succeed with Olynero.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl border border-white/10 bg-white/5 text-center">
                    <div className="mx-auto size-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                        <Book className="size-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Documentation</h3>
                    <p className="text-neutral-400 mb-8">Detailed guides, API references, and tutorials to get you up to speed.</p>
                    <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/10 text-white">Read Docs</Button>
                </div>

                <div className="p-8 rounded-3xl border border-white/10 bg-white/5 text-center">
                    <div className="mx-auto size-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                        <Users className="size-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Community</h3>
                    <p className="text-neutral-400 mb-8">Join our Discord server to connect with other developers and share ideas.</p>
                    <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/10 text-white">Join Discord</Button>
                </div>

                <div className="p-8 rounded-3xl border border-white/10 bg-white/5 text-center">
                    <div className="mx-auto size-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mb-6">
                        <LifeBuoy className="size-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Help Center</h3>
                    <p className="text-neutral-400 mb-8">Need help? Browse our knowledge base or contact our support team.</p>
                    <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/10 text-white">Contact Support</Button>
                </div>
            </div>
        </div>
    )
}
