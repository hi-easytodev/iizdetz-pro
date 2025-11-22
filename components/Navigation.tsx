'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lightbulb, Wrench, DollarSign, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/',
    icon: Lightbulb,
    label: 'Идеи',
  },
  {
    href: '/what-to-do',
    icon: Wrench,
    label: 'Инструменты',
  },
  {
    href: '/monetization',
    icon: DollarSign,
    label: 'Монетизация',
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-purple-pink flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white hidden sm:inline-block">
            AI Idea Analyzer
          </span>
        </Link>

        {/* Navigation Buttons */}
        <nav className="flex items-center space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-full transition-all",
                  isActive
                    ? "bg-[var(--accent-purple)]/20 ring-2 ring-[var(--accent-purple)]"
                    : "hover:bg-[var(--card-bg)]"
                )}
                title={item.label}
              >
                <Icon
                  className={cn(
                    "w-6 h-6 mb-1",
                    isActive ? "text-[var(--accent-purple)]" : "text-[var(--text-secondary)]"
                  )}
                />
                <span
                  className={cn(
                    "text-xs",
                    isActive ? "text-[var(--accent-purple)]" : "text-[var(--text-secondary)]"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Profile Icon */}
        <button className="w-10 h-10 rounded-full bg-[var(--card-bg)] flex items-center justify-center hover:ring-2 hover:ring-[var(--accent-purple)] transition-all">
          <User className="w-5 h-5 text-[var(--text-secondary)]" />
        </button>
      </div>
    </header>
  );
}
