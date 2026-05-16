"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Brush,
  CalendarCheck,
  ChevronRight,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Milk,
  Moon,
  School,
  Settings,
  ShieldCheck,
  Sun
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/data";
import { useAuth } from "@/components/auth/auth-provider";

const navItems = [
  { href: "/", label: "แดชบอร์ด", hint: "ภาพรวมวันนี้", icon: LayoutDashboard },
  { href: "/attendance", label: "เช็คชื่อ", hint: "มาเรียน ขาด ลา สาย", icon: CalendarCheck },
  { href: "/milk", label: "ดื่มนม", hint: "บันทึกโภชนาการ", icon: Milk },
  { href: "/dental", label: "แปรงฟัน", hint: "สุขอนามัยช่องปาก", icon: Brush },
  { href: "/health", label: "สุขภาพ", hint: "น้ำหนัก ส่วนสูง BMI", icon: HeartPulse },
  { href: "/reports", label: "รายงาน", hint: "PDF และ Excel", icon: BarChart3 },
  { href: "/admin", label: "ผู้ดูแลระบบ", hint: "ตั้งค่าและสิทธิ์", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(false);
  const activePage = useMemo(() => navItems.find((item) => item.href === pathname) ?? navItems[0], [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_32%),linear-gradient(180deg,#f8fbff_0%,#eef6fb_100%)] text-foreground dark:bg-[linear-gradient(180deg,#07111f_0%,#0f172a_100%)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[292px] border-r border-white/60 bg-white/82 px-5 py-5 shadow-[24px_0_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/82 lg:block">
        <div className="flex items-center gap-3 rounded-lg bg-slate-950 p-3 text-white">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-sky-500">
            <School className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-sky-100">Smart School</p>
            <h1 className="truncate text-base font-semibold leading-tight">ธุรการชั้นเรียน</h1>
          </div>
        </div>

        <nav className="mt-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-900",
                  active && "bg-primary text-white shadow-[0_14px_35px_rgba(37,99,235,0.24)] hover:bg-primary hover:text-white dark:text-white"
                )}
              >
                <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-primary dark:bg-slate-800", active && "bg-white/16 text-white")}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{item.label}</span>
                  <span className={cn("block truncate text-xs font-normal text-slate-400", active && "text-sky-100")}>{item.hint}</span>
                </span>
                {active ? <ChevronRight className="h-4 w-4" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-sky-100 bg-sky-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <div className="mb-2 flex items-center gap-2 font-semibold text-primary">
            <Activity className="h-4 w-4" />
            พร้อมใช้งานในโรงเรียน
          </div>
          งานประจำวันของครูอยู่ในเมนูเดียว พร้อมบันทึกและออกรายงานจากข้อมูลจริง
        </div>
      </aside>

      <div className="lg:pl-[292px]">
        <header className="sticky top-0 z-20 border-b border-white/70 bg-white/78 px-4 py-3 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/78 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>{currentUser.school}</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span>{activePage.label}</span>
              </div>
              <h2 className="truncate text-xl font-semibold md:text-2xl">ระบบธุรการชั้นเรียนและสุขภาพนักเรียน</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="สลับโหมดสี"
                onClick={() => setDark((value) => !value)}
                className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-card shadow-sm transition hover:border-primary hover:text-primary"
              >
                {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <div className="hidden items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 shadow-sm md:flex">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-health">
                  <ShieldCheck className="h-5 w-5" />
                </div>
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
                  className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-card text-slate-600 shadow-sm transition hover:border-primary hover:text-primary dark:text-slate-300"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              ) : null}
            </div>
          </div>
        </header>

        <main className="px-4 pb-24 pt-6 md:px-8 lg:pb-8">{children}</main>

        <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-6 border-t border-border bg-card/96 px-2 py-2 backdrop-blur lg:hidden">
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
    <div className="mb-6 overflow-hidden rounded-lg border border-white/70 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.14)] dark:border-slate-800">
      <div className="grid gap-4 bg-[linear-gradient(135deg,rgba(37,99,235,0.9),rgba(14,165,233,0.72)_48%,rgba(16,185,129,0.66))] p-5 md:grid-cols-[1fr_auto] md:items-end md:p-6">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1 text-sm font-medium text-sky-50">
            <Activity className="h-4 w-4" />
            ข้อมูลวันนี้ {todayLabel}
          </div>
          <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-sky-50 md:text-base">{description}</p>
        </div>
        <div className="rounded-lg bg-white/14 px-4 py-3 text-sm backdrop-blur">
          <p className="font-semibold">Production Ready</p>
          <p className="text-sky-50">Firebase Hosting + GitHub Actions</p>
        </div>
      </div>
    </div>
  );
}
