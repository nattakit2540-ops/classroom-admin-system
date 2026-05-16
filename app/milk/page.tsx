import { AppShell, SectionTitle } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { StudentRecordWorkspace } from "@/components/records/student-record-workspace";

export default function MilkPage() {
  return (
    <AppShell>
      <SectionTitle title="ระบบบันทึกดื่มนม" description="บันทึกการดื่มนมรายวันแบบรวดเร็ว พร้อมรายงานรายห้องและรายเดือน" />
      <Card>
        <StudentRecordWorkspace mode="milk" primaryLabel="บันทึกดื่มนม" />
      </Card>
    </AppShell>
  );
}
