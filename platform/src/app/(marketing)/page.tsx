import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Code2, Cpu, Globe, Rocket, Shield, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center">
            {/* Hero Section */}
            <section className="relative w-full overflow-hidden pt-32 pb-40 md:pt-48 md:pb-52">
                <div className="absolute top-0 left-1/2 -ml-[50%] w-[200%] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-background to-background opacity-70 blur-3xl pointer-events-none" />

                <div className="container relative z-10 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-neutral-300 backdrop-blur-md mb-8 transition-colors hover:bg-white/10">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        Olynero v2.0 is now live
                    </div>

                    <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 sm:text-7xl md:text-8xl max-w-4xl mb-6">
                        Build AI Apps <br />
                        <span className="text-white">At Warp Speed.</span>
                    </h1>

                    <p className="max-w-2xl text-lg text-neutral-400 mb-10 leading-relaxed md:text-xl">
                        The all-in-one platform for developing, testing, and deploying advanced AI agents.
                        Experience the future of coding with Olynero.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link href="/register">
                            <Button size="lg" className="h-12 px-8 text-base bg-white text-black hover:bg-white/90 rounded-full font-semibold">
                                Start Building Free
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button variant="outline" size="lg" className="h-12 px-8 text-base border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white rounded-full">
                                View Documentation
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Hero Image / Abstract Visual */}
                <div className="container mt-20 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm shadow-2xl shadow-indigo-500/10">
                        <div className="aspect-[16/9] rounded-lg bg-neutral-900/50 flex items-center justify-center overflow-hidden relative group">
                            <div className="absolute inset-0 bg-[grid-template-columns:repeat(20,minmax(0,1fr))] opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                            <div className="text-neutral-500 font-mono text-sm flex flex-col items-center gap-4">
                                <Bot className="size-16 text-neutral-700 group-hover:text-indigo-500 transition-colors duration-500" />
                                <span>Interactive AI Interface Preview</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="w-full py-12 border-y border-white/5 bg-white/[0.02]">
                <div className="container">
                    <p className="text-center text-sm font-medium text-neutral-500 mb-8 uppercase tracking-widest">Trusted by engineering teams at</p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Mock Logos */}
                        <div className="flex items-center gap-2 font-bold text-xl text-white"><Globe className="size-6" /> Acme Corp</div>
                        <div className="flex items-center gap-2 font-bold text-xl text-white"><Zap className="size-6" /> Boltx</div>
                        <div className="flex items-center gap-2 font-bold text-xl text-white"><Cpu className="size-6" /> Chipset</div>
                        <div className="flex items-center gap-2 font-bold text-xl text-white"><Shield className="size-6" /> SecureAI</div>
                        <div className="flex items-center gap-2 font-bold text-xl text-white"><Rocket className="size-6" /> Launchpad</div>
                    </div>
                </div>
            </section>

            {/* Features Bento Grid */}
            <section id="features" className="w-full py-32 relative">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">Everything you need to ship AI.</h2>
                        <p className="text-neutral-400 text-lg">From zero to production in minutes. Olynero provides the primitive blocks for the next generation of software.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Large Card */}
                        <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
                            <div className="absolute top-0 right-0 p-12 opacity-20 group-hover:opacity-40 transition-opacity">
                                <Code2 className="size-48 text-indigo-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="size-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                    <Sparkles className="size-6" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">AI-Powered Code Generation</h3>
                                <p className="text-neutral-400 max-w-sm">Use our advanced models to generate React components, API routes, and database schemas instantly. Edit in real-time.</p>
                            </div>
                        </div>

                        {/* Small Card 1 */}
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
                            <div className="relative z-10">
                                <div className="size-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 mb-6 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                                    <Zap className="size-6" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">Instant Deploy</h3>
                                <p className="text-neutral-400">Deploy your applications to the edge with a single click. Global low-latency.</p>
                            </div>
                        </div>

                        {/* Small Card 2 */}
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
                            <div className="relative z-10">
                                <div className="size-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <Shield className="size-6" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">Enterprise Security</h3>
                                <p className="text-neutral-400">SOC2 compliant infrastructure with role-based access control included.</p>
                            </div>
                        </div>

                        {/* Large Card 2 */}
                        <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
                            <div className="relative z-10">
                                <div className="size-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 mb-6 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                    <Bot className="size-6" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">Custom Agent Orchestration</h3>
                                <p className="text-neutral-400 max-w-sm">Chain multiple AI agents together to solve complex tasks. Use our visual builder to design workflows.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full py-40 border-t border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-950/20" />
                <div className="container relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Ready to build the future?</h2>
                    <p className="text-neutral-400 text-xl max-w-2xl mx-auto mb-10">Join thousands of developers building the next generation of AI applications with Olynero.</p>
                    <Link href="/register">
                        <Button size="lg" className="h-14 px-10 text-lg bg-white text-black hover:bg-white/90 rounded-full font-bold shadow-2xl shadow-indigo-500/20">
                            Get Started for Free
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
