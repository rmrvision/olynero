import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <header className="sticky top-0 z-10 flex h-14 items-center border-b border-white/5 bg-zinc-950/95 backdrop-blur-xl px-4 md:px-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="size-5" />
                    <span className="text-sm font-medium">На главную</span>
                </Link>
            </header>
            <main className="overflow-auto">{children}</main>
        </div>
    );
}
