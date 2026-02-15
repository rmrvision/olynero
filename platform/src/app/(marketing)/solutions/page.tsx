import { Bot, LineChart, MessageSquareText, PenTool } from "lucide-react"

export default function SolutionsPage() {
    const solutions = [
        {
            title: "Агенты поддержки",
            description: "Автоматизируйте 80% тикетов поддержки с помощью интеллектуальных агентов, которые обучаются на вашей документации.",
            icon: MessageSquareText
        },
        {
            title: "Генерация контента",
            description: "Создавайте качественные статьи для блога, посты для соцсетей и рекламные тексты за секунды.",
            icon: PenTool
        },
        {
            title: "Анализ данных",
            description: "Превращайте сырые данные в инсайты. Задавайте вопросы к вашим CSV и SQL базам данных на естественном языке.",
            icon: LineChart
        },
        {
            title: "Кодинг-ассистенты",
            description: "Создавайте кастомных помощников по коду, обученных на вашей внутренней кодовой базе и стайл-гайдах.",
            icon: Bot
        }
    ]

    return (
        <div className="container py-24 md:py-32">
            <div className="text-center mb-20">
                <h1 className="text-4xl font-bold mb-6">Решения для каждой команды</h1>
                <p className="text-xl text-neutral-400">Трансформируйте рабочий процесс с помощью специализированных ИИ-агентов.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {solutions.map((sol, index) => (
                    <div key={index} className="p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="size-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                            <sol.icon className="size-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{sol.title}</h3>
                        <p className="text-neutral-400 text-lg">{sol.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
