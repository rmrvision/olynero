

export default function Layout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    // We pass params.id down, but layout usually just wraps.
    // The "ProjectLayout" component will handle the resizable logic.
    return (
        <div className="h-screen w-full overflow-hidden bg-background">
            {children}
        </div>
    );
}
