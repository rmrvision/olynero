import { Button } from "@/components/ui/button"
import { Book, LifeBuoy, Users } from "lucide-react"

export default function ResourcesPage() {
    return (
        <div className="container py-24 md:py-32">
            <div className="text-center mb-20">
                <h1 className="text-4xl font-bold mb-6">Ресурсы и Поддержка</h1>
                <p className="text-xl text-neutral-400">Всё необходимое для успеха с Olynero.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl border border-white/10 bg-white/5 text-center">
                    <div className="mx-auto size-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                        <Book className="size-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Документация</h3>
                    <p className="text-neutral-400 mb-8">Подробные гайды, справочники API и туториалы для быстрого старта.</p>
                    <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/10 text-white">Читать доки</Button>
                </div>

                <div className="p-8 rounded-3xl border border-white/10 bg-white/5 text-center">
                    <div className="mx-auto size-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                        <Users className="size-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Сообщество</h3>
                    <p className="text-neutral-400 mb-8">Присоединяйтесь к нашему Discord-серверу для общения с другими разработчиками.</p>
                    <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/10 text-white">Войти в Discord</Button>
                </div>

                <div className="p-8 rounded-3xl border border-white/10 bg-white/5 text-center">
                    <div className="mx-auto size-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mb-6">
                        <LifeBuoy className="size-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Центр помощи</h3>
                    <p className="text-neutral-400 mb-8">Нужна помощь? Изучите нашу базу знаний или свяжитесь с поддержкой.</p>
                    <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/10 text-white">Связаться с поддержкой</Button>
                </div>
            </div>
        </div>
    )
}
