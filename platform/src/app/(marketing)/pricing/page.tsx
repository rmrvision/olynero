import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
    return (
        <div className="container py-24 md:py-32">
            <div className="text-center max-w-2xl mx-auto mb-20">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Простые и прозрачные тарифы.</h1>
                <p className="text-xl text-neutral-400">
                    Начните бесплатно, масштабируйтесь по мере роста. Кредитная карта не требуется.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Starter Plan */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col">
                    <h3 className="text-xl font-semibold mb-2">Стартовый</h3>
                    <div className="text-4xl font-bold mb-6">$0</div>
                    <p className="text-neutral-400 mb-8 flex-1">Идеально для энтузиастов и пет-проектов.</p>
                    <ul className="space-y-4 mb-8 text-sm">
                        <li className="flex gap-2"><Check className="size-5 text-green-500" /> 10,000 токенов/мес</li>
                        <li className="flex gap-2"><Check className="size-5 text-green-500" /> 1 Пользователь</li>
                        <li className="flex gap-2"><Check className="size-5 text-green-500" /> Поддержка сообщества</li>
                    </ul>
                    <Link href="/register"><Button variant="outline" className="w-full rounded-full border-white/10 hover:bg-white/10 text-white">Начать бесплатно</Button></Link>
                </div>

                {/* Pro Plan */}
                <div className="rounded-3xl border border-indigo-500/50 bg-white/5 p-8 flex flex-col relative shadow-2xl shadow-indigo-500/10">
                    <div className="absolute top-0 right-0 -mt-3 mr-6 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">ПОПУЛЯРНЫЙ</div>
                    <h3 className="text-xl font-semibold mb-2">Про</h3>
                    <div className="text-4xl font-bold mb-6">$29<span className="text-lg font-normal text-neutral-500">/мес</span></div>
                    <p className="text-neutral-400 mb-8 flex-1">Для серьезных разработчиков, выпускающих в продакшен.</p>
                    <ul className="space-y-4 mb-8 text-sm">
                        <li className="flex gap-2"><Check className="size-5 text-indigo-500" /> 1M токенов/мес</li>
                        <li className="flex gap-2"><Check className="size-5 text-indigo-500" /> 5 Пользователей</li>
                        <li className="flex gap-2"><Check className="size-5 text-indigo-500" /> Приоритетная поддержка</li>
                        <li className="flex gap-2"><Check className="size-5 text-indigo-500" /> Расширенная аналитика</li>
                    </ul>
                    <Link href="/register"><Button className="w-full rounded-full bg-white text-black hover:bg-neutral-200">Попробовать Про</Button></Link>
                </div>

                {/* Enterprise Plan */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col">
                    <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                    <div className="text-4xl font-bold mb-6">Custom</div>
                    <p className="text-neutral-400 mb-8 flex-1">Для больших команд и высоких нагрузок.</p>
                    <ul className="space-y-4 mb-8 text-sm">
                        <li className="flex gap-2"><Check className="size-5 text-neutral-500" /> Безлимитные токены</li>
                        <li className="flex gap-2"><Check className="size-5 text-neutral-500" /> Безлимитные пользователи</li>
                        <li className="flex gap-2"><Check className="size-5 text-neutral-500" /> Выделенный менеджер</li>
                        <li className="flex gap-2"><Check className="size-5 text-neutral-500" /> SSO и SAML</li>
                        <li className="flex gap-2"><Check className="size-5 text-neutral-500" /> Гарантия SLA</li>
                    </ul>
                    <a href="mailto:sales@olynero.ai"><Button variant="outline" className="w-full rounded-full border-white/10 hover:bg-white/10 text-white">Связаться с отделом продаж</Button></a>
                </div>
            </div>
        </div>
    )
}
