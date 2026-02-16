import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono, Lora, Unbounded } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontUnbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
});

const fontMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"], // Explicit weights often needed for variable fonts or monos
});

const fontSerif = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Olynero AI — Платформа для создания ИИ-приложений",
    template: "%s | Olynero AI",
  },
  description: "Единая платформа для разработки, тестирования и развертывания передовых ИИ-агентов. Создавайте приложения со скоростью света.",
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontSerif.variable} ${fontUnbounded.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
