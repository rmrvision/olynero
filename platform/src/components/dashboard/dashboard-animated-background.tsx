export function DashboardAnimatedBackground() {
    return (
        <>
            {/* Base gradient */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(180deg, #09090b 0%, #18181b 25%, #0f0f1a 50%, #18181b 75%, #09090b 100%)",
                }}
            />

            {/* Animated gradient mesh */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(135deg, #312e81 0%, #4c1d95 25%, #831843 50%, #312e81 75%, #4c1d95 100%)",
                    backgroundSize: "400% 400%",
                    animation: "olynero-gradient-shift 15s ease infinite",
                }}
            />

            {/* Floating gradient orbs */}
            <div
                className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, transparent 70%)",
                    animation: "olynero-orb-1 12s ease-in-out infinite",
                }}
            />
            <div
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, rgba(192, 132, 252, 0.3) 0%, transparent 70%)",
                    animation: "olynero-orb-2 14s ease-in-out infinite",
                }}
            />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[80px] pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, rgba(244, 114, 182, 0.25) 0%, transparent 70%)",
                    animation: "olynero-orb-3 10s ease-in-out infinite",
                }}
            />

            {/* Dark overlay to keep content readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-transparent to-zinc-950/80 pointer-events-none" />

            {/* Subtle radial center glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 50% at 50% 40%, rgba(99, 102, 241, 0.08) 0%, transparent 60%)",
                }}
            />
        </>
    );
}
