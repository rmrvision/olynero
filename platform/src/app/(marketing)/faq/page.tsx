
export default function FAQPage() {
    const faqs = [
        {
            question: "What is Olynero?",
            answer: "Olynero is an all-in-one AI development platform that helps you build, test, and deploy AI agents and applications with ease."
        },
        {
            question: "Is it free to use?",
            answer: "Yes, we offer a generous free tier for hobbyists and developers building side projects. No credit card required."
        },
        {
            question: "Can I use my own API keys?",
            answer: "Absolutely. You can bring your own OpenAI, Anthropic, or Hugging Face keys, or use our managed infrastructure for a seamless experience."
        },
        {
            question: "How does the pricing work?",
            answer: "We charge based on usage (tokens) for our managed models. For the Pro plan, you get a fixed monthly allowance and priority support."
        }
    ]

    return (
        <div className="container py-24 md:py-32">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h1>
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
