"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Brush,
  CalendarCheck,
  ClipboardCheck,
  HeartPulse,
  Milk,
  School,
  TrendingUp,
  UserCheck,
  Users
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { AttendanceChart, HealthChart } from "@/components/dashboard/charts";
import { StatCard } from "@/components/dashboard/stat-card";
import { useAuth } from "@/components/auth/auth-provider";
import { getDashboardDataset } from "@/lib/app-data";

type DashboardDataset = Awaited<ReturnType<typeof getDashboardDataset>>;

export function DashboardWorkspace() {
  const { user } = useAuth();
  const [dataset, setDataset] = useState<DashboardDataset | null>(null);

  useEffect(() => {
    let active = true;
    getDashboardDataset(user?.idToken).then((nextDataset) => {
      if (active) setDataset(nextDataset);
    });
    return () => {
      active = false;
    };
  }, [user?.idToken]);

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("th-TH", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(new Date()),
    []
  );

  if (!dataset) {
    return (
      <Card className="min-h-40 animate-pulse">
        <div className="h-6 w-56 rounded bg-muted" />
        <div className="mt-4 h-20 rounded bg-muted" />
      </Card>
    );
  }

  const { totals, students, alerts, monthlyAttendance, healthTrend } = dataset;
  const totalStudents = Math.max(students.length, 1);
  const attendanceRate = Math.round(((totals.present + totals.late) / totalStudents) * 100);
  const milkRate = Math.round((totals.milk / totalStudents) * 100);
  const dentalRate = Math.round((totals.dental / totalStudents) * 100);
  const healthWatchCount = students.filter((student) => {
    if (!student.weight || !student.height) return false;
    const bmi = student.weight / (student.height / 100) ** 2;
    return bmi < 18.5 || bmi >= 23;
  }).length;

  const taskCards = [
    { href: "/attendance", icon: CalendarCheck, label: "เช็คชื่อ", value: `${totals.present + totals.late}/${students.length}`, detail: `${attendanceRate}% มาเรียนวันนี้`, tone: "good" },
    { href: "/milk", icon: Milk, label: "ดื่มนม", value: `${totals.milk}/${students.length}`, detail: `${milkRate}% บันทึกแล้ว`, tone: "good" },
    { href: "/dental", icon: Brush, label: "แปรงฟัน", value: `${totals.dental}/${students.length}`, detail: `${dentalRate}% บันทึกแล้ว`, tone: "warn" }
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-lg border border-white/70 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-6 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-health dark:bg-emerald-500/15">
                <ClipboardCheck className="h-4 w-4" />
                ห้อง ป.4/1 พร้อมใช้งาน
              </div>
              <h2 className="text-2xl font-bold md:text-3xl">ภาพรวมงานประจำชั้นวันนี้</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                {todayLabel} ครูสามารถตรวจสถานะสำคัญ เช็คชื่อ บันทึกสุขอนามัย และดูนักเรียนที่ต้องติดตามได้จากหน้าเดียว
              </p>
            </div>
            <div className="grid min-w-60 grid-cols-2 gap-3 rounded-lg bg-slate-950 p-4 text-white">
              <div>
                <p className="text-xs text-sky-100">มาเรียน</p>
                <p className="mt-1 text-3xl font-bold">{attendanceRate}%</p>
              </div>
              <div>
                <p className="text-xs text-sky-100">ต้องติดตาม</p>
                <p className="mt-1 text-3xl font-bold">{alerts.length}</p>
              </div>
              <div className="col-span-2 rounded-lg bg-white/10 p-3 text-sm text-sky-50">
                ข้อมูลนักเรียนทั้งหมด {students.length} คน
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          {taskCards.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group flex items-center justify-between gap-3 rounded-lg border border-white/70 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-primary dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-sky-50 text-primary dark:bg-sky-500/15">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.detail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusPill tone={item.tone}>{item.value}</StatusPill>
                  <ArrowUpRight className="ml-auto mt-2 h-4 w-4 text-slate-400 transition group-hover:text-primary" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="นักเรียนทั้งหมด" value={`${students.length}`} detail="ข้อมูลจาก Firestore/ระบบนักเรียน" icon={Users} tone="blue" />
        <StatCard title="มาเรียนวันนี้" value={`${totals.present + totals.late}/${students.length}`} detail={`มาสาย ${totals.late} คน`} icon={UserCheck} tone="green" />
        <StatCard title="ขาด / ลา" value={`${totals.absent} / ${totals.leave}`} detail="ใช้ติดตามรายวันและแจ้งผู้ปกครอง" icon={CalendarCheck} tone="amber" />
        <StatCard title="สุขภาพเฝ้าระวัง" value={`${healthWatchCount}`} detail="BMI ต่ำ/เกินเกณฑ์" icon={HeartPulse} tone="red" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <div>
              <CardTitle>แนวโน้มการมาเรียนรายเดือน</CardTitle>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">เปรียบเทียบอัตรามาเรียนและมาสายในรอบ 6 เดือน</p>
            </div>
            <StatusPill>เฉลี่ย 92%</StatusPill>
          </CardHeader>
          <AttendanceChart data={monthlyAttendance} />
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>สัญญาณที่ต้องดูแลต่อ</CardTitle>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">เรียงตามความเร่งด่วนสำหรับครูประจำชั้น</p>
            </div>
            <AlertTriangle className="h-5 w-5 text-warning" />
          </CardHeader>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.title} className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{alert.title}</p>
                  <StatusPill tone={alert.level === "high" ? "absent" : "warn"}>{alert.level === "high" ? "ด่วน" : "ติดตาม"}</StatusPill>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{alert.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>ภาพรวมงานสุขอนามัย</CardTitle>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">สรุปงานดื่มนมและแปรงฟันที่บันทึกแล้ว</p>
            </div>
            <School className="h-5 w-5 text-primary" />
          </CardHeader>
          <div className="space-y-4">
            {[
              ["ดื่มนม", milkRate, totals.milk, "bg-emerald-500"],
              ["แปรงฟัน", dentalRate, totals.dental, "bg-sky-500"],
              ["มาเรียน", attendanceRate, totals.present + totals.late, "bg-blue-600"]
            ].map(([label, rate, count, color]) => (
              <div key={label as string}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{label}</span>
                  <span className="text-slate-500">{count as number}/{students.length} คน</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div className={`${color} h-full rounded-full`} style={{ width: `${rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>ภาพรวมสุขภาพนักเรียน</CardTitle>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">สัดส่วน BMI ตามเกณฑ์สุขภาพรายเดือน</p>
            </div>
            <TrendingUp className="h-5 w-5 text-health" />
          </CardHeader>
          <HealthChart data={healthTrend} />
        </Card>
      </div>
    </div>
  );
}
