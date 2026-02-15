import { Bot, LineChart, MessageSquareText, PenTool, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SolutionsPage() {
    const solutions = [
        {
            title: "Агенты поддержки",
            description: "Автоматизируйте 80% тикетов поддержки с помощью интеллектуальных агентов, которые обучаются на вашей документации.",
            icon: MessageSquareText,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            hoverBg: "group-hover:bg-blue-500",
        },
        {
            title: "Генерация контента",
            description: "Создавайте качественные статьи для блога, посты для соцсетей и рекламные тексты за секунды.",
            icon: PenTool,
            color: "text-pink-400",
            bg: "bg-pink-500/10",
            hoverBg: "group-hover:bg-pink-500",
        },
        {
            title: "Анализ данных",
            description: "Превращайте сырые данные в инсайты. Задавайте вопросы к вашим CSV и SQL базам данных на естественном языке.",
            icon: LineChart,
            color: "text-green-400",
            bg: "bg-green-500/10",
            hoverBg: "group-hover:bg-green-500",
        },
        {
            title: "Кодинг-ассистенты",
            description: "Создавайте кастомных помощников по коду, обученных на вашей внутренней кодовой базе и стайл-гайдах.",
            icon: Bot,
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
            hoverBg: "group-hover:bg-indigo-500",
        },
    ]

    return (
        <div>
            {/* Hero */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                <div className="absolute top-0 left-1/2 -ml-[50%] w-[200%] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent opacity-60 blur-3xl pointer-events-none" />
                <div className="container relative z-10">
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            Решения для каждой команды
                        </h1>
                        <p className="text-xl text-neutral-400">
                            Трансформируйте рабочий процесс с помощью специализированных ИИ-агентов.
                        </p>
                    </div>
                </div>
            </section>

            {/* Solutions Grid */}
            <section className="pb-32">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {solutions.map((sol, index) => (
                            <div key={index} className="p-8 rounded-3xl border border-white/10 bg-white/5 hover:border-white/20 transition-all group">
                                <div className={`size-12 rounded-xl ${sol.bg} flex items-center justify-center ${sol.color} mb-6 ${sol.hoverBg} group-hover:text-white transition-colors`}>
                                    <sol.icon className="size-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{sol.title}</h3>
                                <p className="text-neutral-400 text-lg leading-relaxed">{sol.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-16">
                        <Link href="/register">
                            <Button className="rounded-full bg-white text-black hover:bg-white/90 h-12 px-8 font-semibold">
                                Попробовать бесплатно
                                <ArrowRight className="ml-2 size-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
