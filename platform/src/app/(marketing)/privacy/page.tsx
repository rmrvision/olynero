import Link from "next/link"

export default function PrivacyPage() {
    return (
        <div>
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                <div className="absolute top-0 left-1/2 -ml-[50%] w-[200%] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent opacity-60 blur-3xl pointer-events-none" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            Политика конфиденциальности
                        </h1>
                        <p className="text-xl text-neutral-400">
                            Как мы собираем, используем и защищаем ваши данные.
                        </p>
                    </div>
                </div>
            </section>

            <section className="pb-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl prose prose-invert prose-neutral">
                    <div className="space-y-8 text-neutral-300 leading-relaxed">
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">1. Сбор информации</h2>
                            <p>Olynero собирает информацию, необходимую для предоставления услуг: email, имя, данные проектов и использование платформы. Мы не продаём персональные данные третьим лицам.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">2. Использование данных</h2>
                            <p>Данные используются для работы платформы, улучшения сервиса, технической поддержки и соблюдения законодательства.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">3. Безопасность</h2>
                            <p>Мы применяем современные методы шифрования и защиты данных. Доступ к персональной информации строго ограничен.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">4. Контакты</h2>
                            <p>По вопросам конфиденциальности: <a href="mailto:privacy@olynero.ai" className="text-indigo-400 hover:text-indigo-300">privacy@olynero.ai</a></p>
                        </div>
                        <p className="text-sm text-neutral-500 pt-8">
                            Последнее обновление: {new Date().toLocaleDateString("ru-RU")}
                        </p>
                        <Link href="/" className="inline-block text-indigo-400 hover:text-indigo-300 font-medium">
                            ← На главную
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
