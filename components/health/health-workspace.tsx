"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { useAuth } from "@/components/auth/auth-provider";
import { getHealthDataset } from "@/lib/app-data";

type HealthStudent = Awaited<ReturnType<typeof getHealthDataset>>[number];

export function HealthWorkspace() {
  const { user } = useAuth();
  const [students, setStudents] = useState<HealthStudent[]>([]);

  useEffect(() => {
    let active = true;
    getHealthDataset(user?.idToken).then((nextStudents) => {
      if (active) setStudents(nextStudents);
    });
    return () => {
      active = false;
    };
  }, [user?.idToken]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ทะเบียนสุขภาพห้อง ป.4/1</CardTitle>
        <button className="rounded-lg bg-primary px-4 py-2 font-semibold text-white">บันทึกข้อมูลสุขภาพ</button>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-sm text-slate-500">
              <th className="py-3">เลขที่</th>
              <th>นักเรียน</th>
              <th>อายุ</th>
              <th>น้ำหนัก</th>
              <th>ส่วนสูง</th>
              <th>BMI</th>
              <th>กลุ่มสุขภาพ</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b border-border last:border-0">
                <td className="py-4 font-semibold text-slate-500">#{student.no}</td>
                <td>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-slate-500">{student.birthDate}</p>
                </td>
                <td>{student.age} ปี</td>
                <td>{student.weight} กก.</td>
                <td>{student.height} ซม.</td>
                <td className="font-semibold">{student.bmi}</td>
                <td>
                  <StatusPill tone={student.bmiCategory === "สมส่วน" ? "good" : "warn"}>{student.bmiCategory}</StatusPill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
