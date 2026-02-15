import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
    return (
        <div className="container py-24 md:py-32">
            <div className="max-w-3xl mx-auto text-center mb-20">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">Building the intelligence layer of the internet.</h1>
                <p className="text-xl text-neutral-400 leading-relaxed">
                    Olynero is on a mission to democratize access to advanced artificial intelligence.
                    We believe that by providing the best tools, we can empower a new generation of builders to solve the world's hardest problems.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-xl font-bold mb-4">Speed is everything</h3>
                    <p className="text-neutral-400">We obsess over latency. From our edge network to our inference engine, every millisecond counts.</p>
                </div>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-xl font-bold mb-4">Developer First</h3>
                    <p className="text-neutral-400">Our APIs are designed by developers, for developers. Clean, typed, and intuitive.</p>
                </div>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-xl font-bold mb-4">Privacy by Design</h3>
                    <p className="text-neutral-400">Your data is yours. We employ state-of-the-art encryption and never train on customer data without consent.</p>
                </div>
            </div>

            {/* Team Section Placeholder */}
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-12">Meet the Team</h2>
                <div className="flex flex-wrap justify-center gap-8">
                    <div className="size-24 rounded-full bg-neutral-800" />
                    <div className="size-24 rounded-full bg-neutral-800" />
                    <div className="size-24 rounded-full bg-neutral-800" />
                    <div className="size-24 rounded-full bg-neutral-800" />
                </div>
                <div className="mt-12">
                    <Link href="/careers">
                        <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/10 text-white">View Open Roles</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
