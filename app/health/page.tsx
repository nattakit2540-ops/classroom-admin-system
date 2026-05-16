import { AppShell, SectionTitle } from "@/components/layout/app-shell";
import { HealthWorkspace } from "@/components/health/health-workspace";

export default function HealthPage() {
  return (
    <AppShell>
      <SectionTitle title="ข้อมูลสุขภาพนักเรียน" description="บันทึกน้ำหนัก ส่วนสูง วันเกิด คำนวณอายุและ BMI อัตโนมัติ พร้อมระบุเด็กกลุ่มเสี่ยง" />
      <HealthWorkspace />
    </AppShell>
  );
}
