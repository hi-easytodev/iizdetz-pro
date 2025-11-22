import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "AI Idea Analyzer - Анализ бизнес-идей с помощью AI",
  description: "Автоматический анализ и проработка бизнес-идей с использованием цепочки AI-промптов. Собираем идеи из социальных сетей и предоставляем полный анализ рынка, стратегию запуска и техническую реализацию.",
  keywords: ["AI", "бизнес-идеи", "анализ", "стартап", "предпринимательство"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--card-bg)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            },
          }}
        />
      </body>
    </html>
  );
}
