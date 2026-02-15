import Link from "next/link"

export default function TermsPage() {
    return (
        <div>
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                <div className="absolute top-0 left-1/2 -ml-[50%] w-[200%] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent opacity-60 blur-3xl pointer-events-none" />
                <div className="container relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            Условия использования
                        </h1>
                        <p className="text-xl text-neutral-400">
                            Правила использования платформы Olynero.
                        </p>
                    </div>
                </div>
            </section>

            <section className="pb-32">
                <div className="container max-w-3xl mx-auto">
                    <div className="space-y-8 text-neutral-300 leading-relaxed">
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">1. Принятие условий</h2>
                            <p>Используя Olynero, вы соглашаетесь с настоящими условиями. Если вы не согласны, пожалуйста, не используйте сервис.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">2. Описание сервиса</h2>
                            <p>Olynero предоставляет платформу для разработки ИИ-приложений: генерацию кода, редактор проектов, развёртывание и связанные инструменты.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">3. Ответственность</h2>
                            <p>Вы несёте ответственность за содержимое ваших проектов и соблюдение авторских прав. Olynero не несёт ответственности за контент, созданный пользователями.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">4. Изменения</h2>
                            <p>Мы можем обновлять условия. Продолжая использовать сервис после изменений, вы принимаете обновлённые условия.</p>
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
