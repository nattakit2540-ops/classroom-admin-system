import { AppShell, SectionTitle } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { StudentRecordWorkspace } from "@/components/records/student-record-workspace";

export default function DentalPage() {
  return (
    <AppShell>
      <SectionTitle title="ระบบบันทึกการแปรงฟัน" description="ติดตามสุขอนามัยช่องปากของนักเรียนรายวัน พร้อมหมายเหตุสำหรับการดูแลต่อเนื่อง" />
      <Card>
        <StudentRecordWorkspace mode="dental" primaryLabel="บันทึกแปรงฟัน" />
      </Card>
    </AppShell>
  );
}
