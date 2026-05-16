import { Building2, DatabaseBackup, KeyRound, School, ShieldCheck, Users } from "lucide-react";
import { AppShell, SectionTitle } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";

const adminItems = [
  { title: "จัดการผู้ใช้งาน", detail: "ครู ผู้บริหาร ผู้ดูแลระบบ และสิทธิ์การเข้าถึง", icon: Users },
  { title: "ข้อมูลโรงเรียน", detail: "ชื่อโรงเรียน โลโก้ ปีการศึกษา และภาคเรียน", icon: Building2 },
  { title: "ระดับชั้น/ห้องเรียน", detail: "จัดโครงสร้างชั้น ห้อง ครูประจำชั้น และจำนวนนักเรียน", icon: School },
  { title: "Role Permission", detail: "กำหนดสิทธิ์ Admin, Teacher, Executive แบบ RBAC", icon: KeyRound },
  { title: "Audit Logs", detail: "ติดตามการแก้ไขข้อมูลสำคัญและการส่งออกรายงาน", icon: ShieldCheck },
  { title: "Backup Database", detail: "สำรองข้อมูลตามรอบและเตรียมแผนกู้คืน", icon: DatabaseBackup }
];

export default function AdminPage() {
  return (
    <AppShell>
      <SectionTitle title="ผู้ดูแลระบบ" description="จัดการผู้ใช้งาน โครงสร้างโรงเรียน สิทธิ์การใช้งาน ความปลอดภัย และการสำรองข้อมูล" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg bg-blue-50 text-primary dark:bg-blue-500/15">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 min-h-12 text-sm text-slate-500 dark:text-slate-400">{item.detail}</p>
              <button className="mt-5 rounded-lg border border-border px-4 py-2 font-semibold">จัดการ</button>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
