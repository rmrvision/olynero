"use client";

import { Book, Rocket, FolderKanban, Bot, Code2, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const sections = [
    { id: "intro", title: "Введение", icon: Book },
    { id: "quickstart", title: "Быстрый старт", icon: Rocket },
    { id: "projects", title: "Проекты", icon: FolderKanban },
    { id: "agent", title: "AI-агент", icon: Bot },
    { id: "api", title: "API", icon: Code2 },
    { id: "profile", title: "Профиль и тарифы", icon: User },
];

export default function DocumentationPage() {
    const [activeSection, setActiveSection] = useState("intro");
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
        );
        sections.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
                <div className="absolute top-0 left-1/2 -ml-[50%] w-[200%] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent opacity-60 blur-3xl pointer-events-none" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            Документация OlyneroAI
                        </h1>
                        <p className="text-xl text-neutral-400 leading-relaxed">
                            Подробные гайды, справочники API и туториалы для быстрого старта с платформой.
                        </p>
                    </div>
                </div>
            </section>

            {/* Doc layout with sidebar */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
                    {/* Sidebar nav */}
                    <nav className="lg:w-56 shrink-0">
                        <div className="lg:sticky lg:top-24 space-y-1">
                            {sections.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => {
                                        document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                                        setActiveSection(s.id);
                                    }}
                                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left text-sm transition-colors ${
                                        activeSection === s.id
                                            ? "bg-white/10 text-white"
                                            : "text-neutral-400 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    <s.icon className="size-4 shrink-0" />
                                    {s.title}
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* Content */}
                    <div ref={containerRef} className="flex-1 min-w-0 max-w-3xl space-y-16">
                        {/* Intro */}
                        <section id="intro" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Book className="size-6 text-indigo-400" />
                                Введение
                            </h2>
                            <div className="prose prose-invert prose-neutral max-w-none space-y-4 text-neutral-400">
                                <p>
                                    OlyneroAI — платформа для создания ИИ-приложений. Общайтесь с AI в чате, описывайте идею, и агент создаёт полноценные веб-приложения: React, TypeScript, Tailwind CSS и Vite.
                                </p>
                                <p>
                                    Платформа подходит для прототипов, дашбордов, landing-страниц и других веб-проектов. Вы сохраняете полный контроль над кодом и можете экспортировать проект в GitHub.
                                </p>
                            </div>
                        </section>

                        {/* Quick start */}
                        <section id="quickstart" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Rocket className="size-6 text-indigo-400" />
                                Быстрый старт
                            </h2>
                            <div className="space-y-6 text-neutral-400">
                                <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                                    <h3 className="font-semibold text-white mb-2">1. Регистрация</h3>
                                    <p className="mb-4">
                                        Зарегистрируйтесь или войдите в аккаунт. Бесплатный тариф доступен без кредитной карты.
                                    </p>
                                    <Link href="/register" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium inline-flex items-center gap-1">
                                        Зарегистрироваться <ChevronRight className="size-4" />
                                    </Link>
                                </div>
                                <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                                    <h3 className="font-semibold text-white mb-2">2. Создание проекта</h3>
                                    <p>
                                        На дашборде опишите в поле ввода, что хотите создать. Например: «дашборд для аналитики продаж» или «лендинг для SaaS-продукта». AI создаст проект и откроет редактор.
                                    </p>
                                </div>
                                <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                                    <h3 className="font-semibold text-white mb-2">3. Редактирование</h3>
                                    <p>
                                        В чате уточняйте изменения, добавляйте компоненты и исправляйте баги. Код обновляется в реальном времени. Используйте панель файлов для навигации по проекту.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Projects */}
                        <section id="projects" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <FolderKanban className="size-6 text-indigo-400" />
                                Проекты
                            </h2>
                            <div className="space-y-4 text-neutral-400">
                                <p>
                                    Каждый проект — это отдельное React-приложение. AI управляет файлами через инструменты: создание, обновление и чтение файлов.
                                </p>
                                <p>
                                    <strong className="text-white">Стек по умолчанию:</strong> Vite, React 18, TypeScript, Tailwind CSS.
                                </p>
                                <p>
                                    Проекты можно делать приватными или публичными. Иконка замка/глобуса рядом с полем ввода на дашборде управляет видимостью.
                                </p>
                            </div>
                        </section>

                        {/* Agent */}
                        <section id="agent" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Bot className="size-6 text-indigo-400" />
                                AI-агент
                            </h2>
                            <div className="space-y-4 text-neutral-400">
                                <p>
                                    AI-агент понимает структуру проекта и выполняет действия с файлами. Поддерживаются инструменты: <code className="text-indigo-400 bg-white/5 px-1.5 py-0.5 rounded">createFile</code>, <code className="text-indigo-400 bg-white/5 px-1.5 py-0.5 rounded">updateFile</code>, <code className="text-indigo-400 bg-white/5 px-1.5 py-0.5 rounded">readFile</code>, <code className="text-indigo-400 bg-white/5 px-1.5 py-0.5 rounded">runCommand</code>.
                                </p>
                                <p>
                                    В чат можно отправлять текст, изображения и файлы. Агент использует контекст проекта и ваш запрос, чтобы предлагать изменения.
                                </p>
                                <p>
                                    Для лучших результатов формулируйте запросы чётко: «Добавь график продаж по месяцам» или «Сделай кнопку синей и округлой».
                                </p>
                            </div>
                        </section>

                        {/* API */}
                        <section id="api" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Code2 className="size-6 text-indigo-400" />
                                API
                            </h2>
                            <div className="space-y-6 text-neutral-400">
                                <p>
                                    API агента предназначено для интеграции чата с вашими приложениями. Эндпоинт требует авторизации.
                                </p>
                                <div className="rounded-xl bg-zinc-900/80 border border-white/10 p-4 overflow-x-auto">
                                    <pre className="text-sm text-neutral-300">
{`POST /api/agent
Authorization: Bearer <session>
Content-Type: application/json

{
  "messages": [...],
  "projectId": "project_id"
}`}
                                    </pre>
                                </div>
                                <p>
                                    <strong className="text-white">Параметры:</strong> <code className="text-indigo-400 bg-white/5 px-1.5 py-0.5 rounded">messages</code> — массив сообщений в формате OpenAI; <code className="text-indigo-400 bg-white/5 px-1.5 py-0.5 rounded">projectId</code> — ID проекта. Ответ — стрим в формате streaming text.
                                </p>
                            </div>
                        </section>

                        {/* Profile */}
                        <section id="profile" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <User className="size-6 text-indigo-400" />
                                Профиль и тарифы
                            </h2>
                            <div className="space-y-4 text-neutral-400">
                                <p>
                                    В профиле отображаются тарифный план, баланс токенов и настройки учётной записи. Токены тратятся на запросы к AI.
                                </p>
                                <p>
                                    Бесплатный тариф даёт стартовый лимит токенов. В плане Про — увеличенный лимит, приоритетная поддержка и дополнительные возможности.
                                </p>
                                <Link href="/pricing" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium inline-flex items-center gap-1">
                                    Сравнить тарифы <ChevronRight className="size-4" />
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
