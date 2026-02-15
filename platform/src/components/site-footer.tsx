import Link from "next/link"
import Image from "next/image"
import { Twitter, Linkedin, Github } from "lucide-react"

export function SiteFooter() {
    return (
        <footer className="border-t border-white/10 bg-black text-white py-12 md:py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                <div className="col-span-2 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <Image src="/olynero-logo.png" alt="Olynero" width={28} height={28} className="size-7" />
                        <span className="text-lg font-bold">Olynero</span>
                    </div>
                    <p className="text-sm text-neutral-400 max-w-xs mb-6">
                        Расширяем возможности нового поколения создателей с помощью передовых ИИ-инструментов.
                        Проектируйте, кодируйте и развертывайте быстрее, чем когда-либо.
                    </p>
                    <div className="flex gap-3">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="size-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition-colors" aria-label="Twitter">
                            <Twitter className="size-4" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="size-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition-colors" aria-label="LinkedIn">
                            <Linkedin className="size-4" />
                        </a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="size-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition-colors" aria-label="GitHub">
                            <Github className="size-4" />
                        </a>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-4 text-neutral-200">Продукт</h3>
                    <ul className="space-y-3 text-sm text-neutral-400">
                        <li><Link href="/#features" className="hover:text-white transition-colors">Функции</Link></li>
                        <li><Link href="/solutions" className="hover:text-white transition-colors">Решения</Link></li>
                        <li><Link href="/pricing" className="hover:text-white transition-colors">Тарифы</Link></li>
                        <li><Link href="/resources" className="hover:text-white transition-colors">Документация</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-4 text-neutral-200">Компания</h3>
                    <ul className="space-y-3 text-sm text-neutral-400">
                        <li><Link href="/about" className="hover:text-white transition-colors">О нас</Link></li>
                        <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-4 text-neutral-200">Юридическое</h3>
                    <ul className="space-y-3 text-sm text-neutral-400">
                        <li><Link href="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</Link></li>
                        <li><Link href="/terms" className="hover:text-white transition-colors">Условия использования</Link></li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
                <p>&copy; {new Date().getFullYear()} Olynero Inc. Все права защищены.</p>
                <div className="flex gap-6">
                    <span>Сделано командой Olynero</span>
                </div>
            </div>
        </footer>
    )
}
