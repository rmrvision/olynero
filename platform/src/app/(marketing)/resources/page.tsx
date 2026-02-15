import { Button } from "@/components/ui/button"
import { Book, LifeBuoy, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ResourcesPage() {
    const resources = [
        {
            icon: Book,
            title: "Документация",
            description: "Подробные гайды, справочники API и туториалы для быстрого старта.",
            action: "Читать доки",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            hoverBg: "group-hover:bg-blue-500",
        },
        {
            icon: Users,
            title: "Сообщество",
            description: "Присоединяйтесь к нашему Discord-серверу для общения с другими разработчиками.",
            action: "Войти в Discord",
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
            hoverBg: "group-hover:bg-indigo-500",
        },
        {
            icon: LifeBuoy,
            title: "Центр помощи",
            description: "Нужна помощь? Изучите нашу базу знаний или свяжитесь с поддержкой.",
            action: "Связаться с поддержкой",
            color: "text-green-400",
            bg: "bg-green-500/10",
            hoverBg: "group-hover:bg-green-500",
        },
    ]

    return (
        <div>
            {/* Hero */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                <div className="absolute top-0 left-1/2 -ml-[50%] w-[200%] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent opacity-60 blur-3xl pointer-events-none" />
                <div className="container relative z-10">
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            Ресурсы и поддержка
                        </h1>
                        <p className="text-xl text-neutral-400">
                            Всё необходимое для успеха с Olynero.
                        </p>
                    </div>
                </div>
            </section>

            {/* Resources Grid */}
            <section className="pb-32">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {resources.map((item, i) => (
                            <div key={i} className="p-8 rounded-3xl border border-white/10 bg-white/5 text-center hover:border-white/20 transition-all group">
                                <div className={`mx-auto size-16 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} mb-6 ${item.hoverBg} group-hover:text-white transition-colors`}>
                                    <item.icon className="size-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                <p className="text-neutral-400 mb-8 leading-relaxed">{item.description}</p>
                                {item.action === "Читать доки" ? (
                                    <Link href="/#features">
                                        <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/10 text-white w-full sm:w-auto">
                                            {item.action}
                                            <ArrowRight className="ml-2 size-4" />
                                        </Button>
                                    </Link>
                                ) : item.action === "Связаться с поддержкой" ? (
                                    <a href="mailto:support@olynero.ai">
                                        <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/10 text-white w-full sm:w-auto">
                                            {item.action}
                                            <ArrowRight className="ml-2 size-4" />
                                        </Button>
                                    </a>
                                ) : (
                                    <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/10 text-white w-full sm:w-auto">
                                        {item.action}
                                        <ArrowRight className="ml-2 size-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
