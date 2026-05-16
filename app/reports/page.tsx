import { AppShell, SectionTitle } from "@/components/layout/app-shell";
import { ReportsWorkspace } from "@/components/reports/reports-workspace";

export default function ReportsPage() {
  return (
    <AppShell>
      <SectionTitle title="รายงานและสถิติ" description="สร้างรายงานรายวัน รายเดือน รายห้อง และภาพรวมทั้งโรงเรียน พร้อม export PDF/Excel" />
      <ReportsWorkspace />
    </AppShell>
  );
}
