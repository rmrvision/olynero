import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
    return (
        <div className="container py-24 md:py-32">
            <div className="max-w-3xl mx-auto text-center mb-20">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">Создание интеллектуального слоя интернета.</h1>
                <p className="text-xl text-neutral-400 leading-relaxed">
                    Миссия Olynero — демократизировать доступ к передовому искусственному интеллекту.
                    Мы верим, что предоставляя лучшие инструменты, мы можем расширить возможности нового поколения создателей для решения сложнейших мировых проблем.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-xl font-bold mb-4">Скорость превыше всего</h3>
                    <p className="text-neutral-400">Мы одержимы задержкой (latency). От нашей edge-сети до движка инференса — каждая миллисекунда на счету.</p>
                </div>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-xl font-bold mb-4">Сначала разработчики</h3>
                    <p className="text-neutral-400">Наши API разработаны разработчиками для разработчиков. Чистые, типизированные и интуитивно понятные.</p>
                </div>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-xl font-bold mb-4">Приватность по умолчанию</h3>
                    <p className="text-neutral-400">Ваши данные принадлежат вам. Мы используем современное шифрование и никогда не обучаем модели на данных клиентов без согласия.</p>
                </div>
            </div>

            {/* Team Section Placeholder */}
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-12">Наша команда</h2>
                <div className="flex flex-wrap justify-center gap-8">
                    <div className="size-24 rounded-full bg-neutral-800" />
                    <div className="size-24 rounded-full bg-neutral-800" />
                    <div className="size-24 rounded-full bg-neutral-800" />
                    <div className="size-24 rounded-full bg-neutral-800" />
                </div>
                <div className="mt-12">
                    <Link href="/careers">
                        <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/10 text-white">Смотреть вакансии</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
