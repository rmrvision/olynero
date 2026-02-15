"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const routeLabels: Record<string, string> = {
    users: "Пользователи",
    settings: "Настройки",
}

export function AdminBreadcrumb() {
    const pathname = usePathname()
    const segments = pathname.split("/").filter(Boolean)
    const isRoot = segments.length <= 1
    const section = segments[1]
    const isDetail = segments.length >= 3

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    {isRoot ? (
                        <BreadcrumbPage className="text-white font-medium">Панель управления</BreadcrumbPage>
                    ) : (
                        <BreadcrumbLink asChild>
                            <Link href="/admin" className="text-neutral-400 hover:text-white transition-colors">
                                Панель управления
                            </Link>
                        </BreadcrumbLink>
                    )}
                </BreadcrumbItem>
                {!isRoot && (
                    <>
                        <BreadcrumbSeparator className="text-neutral-600" />
                        <BreadcrumbItem>
                            {!isDetail ? (
                                <BreadcrumbPage className="text-white font-medium">{routeLabels[section] ?? section}</BreadcrumbPage>
                            ) : (
                                <>
                                    <BreadcrumbLink asChild>
                                        <Link href={`/admin/${section}`} className="text-neutral-400 hover:text-white transition-colors">
                                            {routeLabels[section] ?? section}
                                        </Link>
                                    </BreadcrumbLink>
                                    <BreadcrumbSeparator className="text-neutral-600" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="text-white font-medium">Профиль</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </>
                            )}
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
