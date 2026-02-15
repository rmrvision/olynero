export function SiteFooter() {
    return (
        <footer className="border-t border-white/10 bg-black text-white py-12 md:py-16 lg:py-20">
            <div className="container grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                <div className="col-span-2 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="size-6 rounded-md bg-white text-black flex items-center justify-center font-bold">O</div>
                        <span className="text-lg font-bold">Olynero</span>
                    </div>
                    <p className="text-sm text-neutral-400 max-w-xs mb-6">
                        Расширяем возможности нового поколения создателей с помощью передовых ИИ-инструментов.
                        Проектируйте, кодируйте и развертывайте быстрее, чем когда-либо.
                    </p>
                    <div className="flex gap-4">
                        {/* Social Icons Placeholder */}
                        <div className="size-8 bg-neutral-800 rounded-full flex items-center justify-center text-xs">X</div>
                        <div className="size-8 bg-neutral-800 rounded-full flex items-center justify-center text-xs">In</div>
                        <div className="size-8 bg-neutral-800 rounded-full flex items-center justify-center text-xs">Gh</div>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-4 text-neutral-200">Продукт</h3>
                    <ul className="space-y-3 text-sm text-neutral-400">
                        <li><a href="#" className="hover:text-white transition-colors">Функции</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Интеграции</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Тарифы</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Обновления</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Документация</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-4 text-neutral-200">Компания</h3>
                    <ul className="space-y-3 text-sm text-neutral-400">
                        <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Карьера</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Блог</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Партнеры</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-4 text-neutral-200">Юридическое</h3>
                    <ul className="space-y-3 text-sm text-neutral-400">
                        <li><a href="#" className="hover:text-white transition-colors">Политика конфедициальности</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Условия использования</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Политика Cookie</a></li>
                    </ul>
                </div>
            </div>
            <div className="container mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
                <p>&copy; {new Date().getFullYear()} Olynero Inc. Все права защищены.</p>
                <div className="flex gap-6">
                    <span>Сделано с ❤️ командой Olynero</span>
                </div>
            </div>
        </footer>
    )
}
