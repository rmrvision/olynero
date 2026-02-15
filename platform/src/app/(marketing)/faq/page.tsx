
export default function FAQPage() {
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
        }
    ]

    return (
        <div className="container py-24 md:py-32">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-12 text-center">Часто задаваемые вопросы</h1>
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                            <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                            <p className="text-neutral-400">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
