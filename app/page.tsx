import { AppShell, SectionTitle } from "@/components/layout/app-shell";
import { DashboardWorkspace } from "@/components/dashboard/dashboard-workspace";

export default function DashboardPage() {
  return (
    <AppShell>
      <SectionTitle
        title="Dashboard ภาพรวมโรงเรียน"
        description="ติดตามการมาเรียน สุขอนามัย และสุขภาพนักเรียนแบบวันต่อวัน พร้อมสัญญาณเตือนสำหรับนักเรียนที่ควรดูแลต่อ"
      />
      <DashboardWorkspace />
    </AppShell>
  );
}
