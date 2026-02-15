import Link from "next/link"
import { Sparkles, Code2, Shield } from "lucide-react"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen w-full bg-black text-white">
            {/* Left side - branding */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/30 via-black to-black" />
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-lg">O</div>
                        <span className="text-xl font-bold">Olynero</span>
                    </Link>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="flex gap-3 mb-4">
                        <div className="size-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                            <Sparkles className="size-5 text-indigo-400" />
                        </div>
                        <div className="size-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <Code2 className="size-5 text-purple-400" />
                        </div>
                        <div className="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <Shield className="size-5 text-emerald-400" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold leading-tight">
                        Создавайте ИИ-приложения<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">со скоростью света.</span>
                    </h2>
                    <p className="text-lg text-neutral-400 max-w-md">
                        Единая платформа для разработки, тестирования и развертывания передовых ИИ-агентов.
                    </p>
                </div>

                <p className="relative z-10 text-sm text-neutral-600">
                    &copy; {new Date().getFullYear()} Olynero Inc.
                </p>
            </div>

            {/* Right side - form */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="size-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-lg">O</div>
                            <span className="text-xl font-bold">Olynero</span>
                        </Link>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}
