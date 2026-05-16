import { AppShell, SectionTitle } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { StudentRecordWorkspace } from "@/components/records/student-record-workspace";

export default function AttendancePage() {
  return (
    <AppShell>
      <SectionTitle title="ระบบเช็คชื่อรายวัน" description="เช็คชื่อ ขาด ลา มาสาย พร้อมค้นหา บันทึกหมายเหตุ และส่งออกรายงาน PDF/Excel" />
      <Card>
        <StudentRecordWorkspace mode="attendance" primaryLabel="บันทึกเช็คชื่อ" />
      </Card>
    </AppShell>
  );
}
