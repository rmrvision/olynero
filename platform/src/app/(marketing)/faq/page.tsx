"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
    {
        question: "Что такое Olynero?",
        answer: "Olynero — это универсальная платформа для разработки ИИ, которая помогает вам легко создавать, тестировать и развертывать ИИ-агентов и приложения."
    },
    {
        question: "Это бесплатно?",
        answer: "Да, мы предлагаем щедрый бесплатный тариф для энтузиастов и разработчиков пет-проектов. Кредитная карта не требуется."
    },
    {
        question: "Могу ли я использовать свои API ключи?",
        answer: "Конечно. Вы можете использовать свои ключи OpenAI, Anthropic или Hugging Face, или воспользоваться нашей управляемой инфраструктурой для бесшовной работы."
    },
    {
        question: "Как работает ценообразование?",
        answer: "Мы взимаем плату за использование (токены) для наших управляемых моделей. В плане Про вы получаете фиксированный ежемесячный лимит и приоритетную поддержку."
    },
    {
        question: "Какие модели поддерживаются?",
        answer: "Мы поддерживаем все основные модели: GPT-4, Claude, Llama и другие. Вы можете переключаться между ними в настройках проекта."
    },
    {
        question: "Есть ли ограничения на бесплатном тарифе?",
        answer: "Бесплатный тариф включает 10,000 токенов в месяц, 1 пользователя и поддержку сообщества. Для больших проектов рекомендуем тариф Про."
    },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className="rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 transition-all overflow-hidden cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="flex items-center justify-between p-6">
                <h3 className="text-lg font-semibold pr-4">{question}</h3>
                <ChevronDown className={cn(
                    "size-5 text-neutral-400 shrink-0 transition-transform duration-200",
                    isOpen && "rotate-180"
                )} />
            </div>
            <div className={cn(
                "overflow-hidden transition-all duration-200",
                isOpen ? "max-h-96 pb-6" : "max-h-0"
            )}>
                <p className="text-neutral-400 px-6 leading-relaxed">{answer}</p>
            </div>
        </div>
    )
}

export default function FAQPage() {
    return (
        <div>
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                <div className="absolute top-0 left-1/2 -ml-[50%] w-[200%] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent opacity-60 blur-3xl pointer-events-none" />
                <div className="container relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            Часто задаваемые вопросы
                        </h1>
                        <p className="text-xl text-neutral-400">
                            Ответы на самые популярные вопросы об Olynero.
                        </p>
                    </div>
                </div>
            </section>

            <section className="pb-32">
                <div className="container max-w-3xl mx-auto">
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
