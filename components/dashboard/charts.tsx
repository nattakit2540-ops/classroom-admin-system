"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { healthTrend, monthlyAttendance } from "@/lib/data";

type AttendancePoint = {
  month: string;
  present: number;
  absent: number;
  late: number;
};

type HealthPoint = {
  month: string;
  normal: number;
  under: number;
  over: number;
};

export function AttendanceChart({ data = monthlyAttendance }: { data?: AttendancePoint[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="present" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Area type="monotone" dataKey="present" name="มาเรียน" stroke="#2563eb" fill="url(#present)" strokeWidth={3} />
          <Area type="monotone" dataKey="late" name="มาสาย" stroke="#f59e0b" fill="transparent" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HealthChart({ data = healthTrend }: { data?: HealthPoint[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="normal" name="สมส่วน" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="under" name="ต่ำกว่าเกณฑ์" stackId="a" fill="#38bdf8" />
          <Bar dataKey="over" name="เกินเกณฑ์" stackId="a" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
