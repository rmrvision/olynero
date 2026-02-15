import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PricingPage() {
    return (
        <div className="container py-24 md:py-32">
            <div className="text-center max-w-2xl mx-auto mb-20">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Simple, transparent pricing.</h1>
                <p className="text-xl text-neutral-400">
                    Start for free, scale as you grow. No credit card required.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Starter Plan */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col">
                    <h3 className="text-xl font-semibold mb-2">Starter</h3>
                    <div className="text-4xl font-bold mb-6">$0</div>
                    <p className="text-neutral-400 mb-8 flex-1">Perfect for hobbyists and side projects.</p>
                    <ul className="space-y-4 mb-8 text-sm">
                        <li className="flex gap-2"><Check className="size-5 text-green-500" /> 10,000 tokens/mo</li>
                        <li className="flex gap-2"><Check className="size-5 text-green-500" /> 1 User</li>
                        <li className="flex gap-2"><Check className="size-5 text-green-500" /> Community Support</li>
                    </ul>
                    <Button variant="outline" className="w-full rounded-full border-white/10 hover:bg-white/10 text-white">Get Started</Button>
                </div>

                {/* Pro Plan */}
                <div className="rounded-3xl border border-indigo-500/50 bg-white/5 p-8 flex flex-col relative shadow-2xl shadow-indigo-500/10">
                    <div className="absolute top-0 right-0 -mt-3 mr-6 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
                    <h3 className="text-xl font-semibold mb-2">Pro</h3>
                    <div className="text-4xl font-bold mb-6">$29<span className="text-lg font-normal text-neutral-500">/mo</span></div>
                    <p className="text-neutral-400 mb-8 flex-1">For serious developers shipping to production.</p>
                    <ul className="space-y-4 mb-8 text-sm">
                        <li className="flex gap-2"><Check className="size-5 text-indigo-500" /> 1M tokens/mo</li>
                        <li className="flex gap-2"><Check className="size-5 text-indigo-500" /> 5 Users</li>
                        <li className="flex gap-2"><Check className="size-5 text-indigo-500" /> Priority Support</li>
                        <li className="flex gap-2"><Check className="size-5 text-indigo-500" /> Advanced Analytics</li>
                    </ul>
                    <Button className="w-full rounded-full bg-white text-black hover:bg-neutral-200">Start Trial</Button>
                </div>

                {/* Enterprise Plan */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col">
                    <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                    <div className="text-4xl font-bold mb-6">Custom</div>
                    <p className="text-neutral-400 mb-8 flex-1">For large teams and high-volume workloads.</p>
                    <ul className="space-y-4 mb-8 text-sm">
                        <li className="flex gap-2"><Check className="size-5 text-neutral-500" /> Unlimited tokens</li>
                        <li className="flex gap-2"><Check className="size-5 text-neutral-500" /> Unlimited Users</li>
                        <li className="flex gap-2"><Check className="size-5 text-neutral-500" /> Dedicated Account Manager</li>
                        <li className="flex gap-2"><Check className="size-5 text-neutral-500" /> SSO & SAML</li>
                        <li className="flex gap-2"><Check className="size-5 text-neutral-500" /> SLA Guarantee</li>
                    </ul>
                    <Button variant="outline" className="w-full rounded-full border-white/10 hover:bg-white/10 text-white">Contact Sales</Button>
                </div>
            </div>
        </div>
    )
}
