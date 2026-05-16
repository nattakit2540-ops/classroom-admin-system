"use client";

import { BarChart3, Download, FileText, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/auth-provider";
import { getDashboardDataset, getHealthDataset } from "@/lib/app-data";
import { reportCards } from "@/lib/data";
import { downloadCsv, ExportRow, printPdfReport } from "@/lib/export-utils";

async function buildReportRows(idToken: string | undefined, reportType: string): Promise<ExportRow[]> {
  if (reportType.includes("สุขภาพ")) {
    const students = await getHealthDataset(idToken);
    return students.map((student) => ({
      เลขที่: student.no,
      ชื่อ: student.name,
      ห้อง: student.className,
      อายุ: student.age,
      น้ำหนัก: student.weight,
      ส่วนสูง: student.height,
      BMI: student.bmi,
      กลุ่มสุขภาพ: student.bmiCategory
    }));
  }

  const dashboard = await getDashboardDataset(idToken);
  return dashboard.attendance.map((record) => {
    const student = dashboard.students.find((item) => item.id === record.studentId);
    return {
      เลขที่: student?.no ?? "",
      ชื่อ: student?.name ?? record.studentId,
      ห้อง: student?.className ?? "ป.4/1",
      สถานะ: record.status ?? "",
      หมายเหตุ: record.note ?? ""
    };
  });
}

export function ReportsWorkspace() {
  const { user } = useAuth();

  async function exportExcel(reportType = "รายงานเช็คชื่อรายวัน") {
    const rows = await buildReportRows(user?.idToken, reportType);
    downloadCsv(`${reportType}.csv`, rows);
  }

  async function exportPdf(reportType = "รายงานเช็คชื่อรายวัน") {
    const rows = await buildReportRows(user?.idToken, reportType);
    printPdfReport(reportType, rows);
  }

  return (
    <>
      <Card className="mb-6">
        <div className="grid gap-3 md:grid-cols-4">
          {["ช่วงวันที่", "ระดับชั้น", "ห้องเรียน", "ประเภทรายงาน"].map((label) => (
            <label key={label} className="text-sm font-medium">
              {label}
              <select className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:border-primary">
                <option>ทั้งหมด</option>
                <option>วันนี้</option>
                <option>เดือนนี้</option>
              </select>
            </label>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 font-semibold text-white" onClick={() => exportExcel()}>
            <Filter className="h-4 w-4" />
            ประมวลผล Excel
          </button>
          <button className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 font-semibold" onClick={() => exportPdf()}>
            <Download className="h-4 w-4" />
            ส่งออก PDF
          </button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reportCards.map((report) => (
          <Card key={report.title}>
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg bg-sky-100 text-primary dark:bg-sky-500/15">
              <FileText className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold">{report.title}</h2>
            <p className="mt-2 min-h-12 text-sm text-slate-500 dark:text-slate-400">{report.description}</p>
            <div className="mt-5 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-health">{report.format}</span>
              <div className="flex gap-2">
                <button className="rounded-lg border border-border px-3 py-2 text-sm font-semibold" onClick={() => exportExcel(report.title)}>
                  Excel
                </button>
                <button className="rounded-lg border border-border px-3 py-2 text-sm font-semibold" onClick={() => exportPdf(report.title)}>
                  PDF
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div>
            <CardTitle>Dashboard Analytics</CardTitle>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">พื้นที่สำหรับเปรียบเทียบข้อมูลรายเดือนและวิเคราะห์แนวโน้มสุขภาพ</p>
          </div>
          <BarChart3 className="h-5 w-5 text-primary" />
        </CardHeader>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["อัตรามาเรียนเฉลี่ย", "92.8%", "+1.4% จากเดือนก่อน"],
            ["ดื่มนมครบ", "88.5%", "ห้อง ป.4/1 ต้องติดตาม 2 ราย"],
            ["BMI สมส่วน", "72%", "ดีขึ้นต่อเนื่อง 3 เดือน"]
          ].map(([title, value, detail]) => (
            <div key={title} className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm text-slate-500">{title}</p>
              <p className="mt-2 text-3xl font-bold">{value}</p>
              <p className="mt-2 text-sm text-slate-500">{detail}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
