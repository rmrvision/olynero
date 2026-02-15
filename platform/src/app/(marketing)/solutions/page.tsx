import { Bot, LineChart, MessageSquareText, PenTool } from "lucide-react"

export default function SolutionsPage() {
    const solutions = [
        {
            title: "Customer Support Agents",
            description: "Automate 80% of your support tickets with intelligent agents that learn from your documentation.",
            icon: MessageSquareText
        },
        {
            title: "Content Generation",
            description: "Generate high-quality blog posts, social media captions, and marketing copy in seconds.",
            icon: PenTool
        },
        {
            title: "Data Analysis",
            description: "Turn raw data into actionable insights. Ask questions about your CSVs and SQL databases in plain English.",
            icon: LineChart
        },
        {
            title: "Coding Assistants",
            description: "Build custom coding assistants trained on your internal codebase and style guides.",
            icon: Bot
        }
    ]

    return (
        <div className="container py-24 md:py-32">
            <div className="text-center mb-20">
                <h1 className="text-4xl font-bold mb-6">Solutions for every team</h1>
                <p className="text-xl text-neutral-400">Transform your workflow with purpose-built AI agents.</p>
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
