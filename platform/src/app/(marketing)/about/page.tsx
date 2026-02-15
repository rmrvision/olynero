import { Button } from "@/components/ui/button"
import { Zap, Code2, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
    const values = [
        {
            icon: Zap,
            title: "Скорость превыше всего",
            description: "Мы одержимы задержкой (latency). От нашей edge-сети до движка инференса — каждая миллисекунда на счету.",
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
        },
        {
            icon: Code2,
            title: "Сначала разработчики",
            description: "Наши API разработаны разработчиками для разработчиков. Чистые, типизированные и интуитивно понятные.",
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
        },
        {
            icon: Lock,
            title: "Приватность по умолчанию",
            description: "Ваши данные принадлежат вам. Мы используем современное шифрование и никогда не обучаем модели на данных клиентов без согласия.",
            color: "text-green-400",
            bg: "bg-green-500/10",
        },
    ]

    const stats = [
        { value: "10K+", label: "Разработчиков" },
        { value: "1M+", label: "Запросов в день" },
        { value: "99.9%", label: "Uptime" },
        { value: "<50ms", label: "Задержка" },
    ]

    return (
        <div>
            {/* Hero */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                <div className="absolute top-0 left-1/2 -ml-[50%] w-[200%] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent opacity-60 blur-3xl pointer-events-none" />
                <div className="container relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            Создание интеллектуального слоя интернета.
                        </h1>
                        <p className="text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto">
                            Миссия Olynero — демократизировать доступ к передовому искусственному интеллекту.
                            Мы верим, что предоставляя лучшие инструменты, мы можем расширить возможности нового поколения создателей.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 border-y border-white/5">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">{stat.value}</div>
                                <div className="text-sm text-neutral-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 md:py-32">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Наши ценности</h2>
                        <p className="text-neutral-400 text-lg max-w-xl mx-auto">Принципы, которые определяют каждое наше решение.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((item, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
                                <div className={`size-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color} mb-6 group-hover:scale-110 transition-transform`}>
                                    <item.icon className="size-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-neutral-400 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-24 border-t border-white/5">
                <div className="container text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Наша команда</h2>
                    <p className="text-neutral-400 text-lg mb-12 max-w-xl mx-auto">Инженеры и исследователи, объединённые общей целью.</p>
                    <div className="flex flex-wrap justify-center gap-6 mb-12">
                        {["А", "Б", "В", "Г"].map((letter, i) => (
                            <div key={i} className="group">
                                <div className="size-24 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center text-2xl font-bold text-neutral-600 group-hover:border-indigo-500/50 transition-colors" />
                            </div>
                        ))}
                    </div>
                    <Link href="/register">
                        <Button className="rounded-full bg-white text-black hover:bg-white/90 h-12 px-8 font-semibold">
                            Присоединиться к нам
                            <ArrowRight className="ml-2 size-4" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
