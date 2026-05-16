"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Brush,
  CalendarCheck,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Milk,
  Moon,
  School,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/data";
import { useAuth } from "@/components/auth/auth-provider";

const navItems = [
  { href: "/", label: "แดชบอร์ด", icon: LayoutDashboard },
  { href: "/attendance", label: "เช็คชื่อ", icon: CalendarCheck },
  { href: "/milk", label: "ดื่มนม", icon: Milk },
  { href: "/dental", label: "แปรงฟัน", icon: Brush },
  { href: "/health", label: "สุขภาพ", icon: HeartPulse },
  { href: "/reports", label: "รายงาน", icon: BarChart3 },
  { href: "/admin", label: "ผู้ดูแลระบบ", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border bg-card/92 px-4 py-5 backdrop-blur lg:block">
        <div className="flex items-center gap-3 px-2">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-white">
            <School className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Smart School</p>
            <h1 className="font-semibold leading-tight">ธุรการชั้นเรียน</h1>
          </div>
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-muted dark:text-slate-300",
                  active && "bg-primary text-white hover:bg-primary dark:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-lg bg-sky-50 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <div className="mb-2 flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4 text-primary" />
            พร้อมต่อยอด PWA
          </div>
          ใช้งานเร็วบนมือถือสำหรับครูเวรและครูประจำชั้น
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-border bg-background/86 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-slate-500 dark:text-slate-400">{currentUser.school}</p>
              <h2 className="truncate text-xl font-semibold md:text-2xl">ระบบธุรการชั้นเรียนและสุขภาพนักเรียน</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="สลับโหมดสี"
                onClick={() => setDark((value) => !value)}
                className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card"
              >
                {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <div className="hidden items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 md:flex">
                <ShieldCheck className="h-5 w-5 text-health" />
                <div className="text-sm">
                  <p className="font-semibold">{user?.displayName ?? currentUser.name}</p>
                  <p className="text-slate-500 dark:text-slate-400">{user?.email ?? `${currentUser.role} ${currentUser.classroom}`}</p>
                </div>
              </div>
              {user ? (
                <button
                  type="button"
                  aria-label="ออกจากระบบ"
                  onClick={logout}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card text-slate-600 hover:text-primary dark:text-slate-300"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              ) : null}
            </div>
          </div>
        </header>

        <main className="px-4 py-6 md:px-8">{children}</main>

        <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-6 border-t border-border bg-card/95 px-2 py-2 backdrop-blur lg:hidden">
          {navItems.slice(0, 6).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn("grid justify-items-center gap-1 rounded-lg py-2 text-xs text-slate-500", active && "bg-muted text-primary")}>
                <Icon className="h-5 w-5" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function SectionTitle({ title, description }: { title: string; description: string }) {
  const todayLabel = new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date());

  return (
    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        <p className="mt-1 max-w-3xl text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm">
        <Activity className="h-4 w-4 text-health" />
        ข้อมูลตัวอย่างวันนี้ {todayLabel}
      </div>
    </div>
  );
}
