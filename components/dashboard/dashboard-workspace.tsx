"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Brush, CalendarCheck, HeartPulse, Milk, School, UserCheck, Users } from "lucide-react";
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

  if (!dataset) {
    return <Card>กำลังโหลดข้อมูลภาพรวม...</Card>;
  }

  const { totals, students, alerts, monthlyAttendance, healthTrend } = dataset;
  const healthWatchCount = students.filter((student) => {
    if (!student.weight || !student.height) return false;
    const bmi = student.weight / (student.height / 100) ** 2;
    return bmi < 18.5 || bmi >= 23;
  }).length;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="นักเรียนทั้งหมด" value={`${students.length}`} detail="ข้อมูลจากระบบนักเรียน" icon={Users} tone="blue" />
        <StatCard title="มาเรียนวันนี้" value={`${totals.present + totals.late}/${students.length}`} detail={`มาสาย ${totals.late} คน`} icon={UserCheck} tone="green" />
        <StatCard title="ขาด / ลา" value={`${totals.absent} / ${totals.leave}`} detail="ติดตามรายวันที่มีความเสี่ยง" icon={CalendarCheck} tone="amber" />
        <StatCard title="สุขภาพเฝ้าระวัง" value={`${healthWatchCount}`} detail="BMI ต่ำ/เกินเกณฑ์" icon={HeartPulse} tone="red" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <Card>
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
              <CardTitle>งานประจำวันนี้</CardTitle>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">สถานะบันทึกประจำห้อง ป.4/1</p>
            </div>
          </CardHeader>
          <div className="space-y-3">
            {[
              { icon: Milk, label: "ดื่มนม", value: `${totals.milk}/${students.length}`, tone: "good" },
              { icon: Brush, label: "แปรงฟัน", value: `${totals.dental}/${students.length}`, tone: "warn" },
              { icon: School, label: "เช็คชื่อ", value: "เชื่อมข้อมูลแล้ว", tone: "good" }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-sky-100 text-primary dark:bg-sky-500/15">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <StatusPill tone={item.tone}>{item.value}</StatusPill>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>แจ้งเตือนนักเรียนที่ต้องติดตาม</CardTitle>
            <AlertTriangle className="h-5 w-5 text-warning" />
          </CardHeader>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.title} className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{alert.title}</p>
                  <StatusPill tone={alert.level === "high" ? "absent" : "warn"}>{alert.level === "high" ? "ด่วน" : "ติดตาม"}</StatusPill>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{alert.detail}</p>
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
          </CardHeader>
          <HealthChart data={healthTrend} />
        </Card>
      </div>
    </>
  );
}
