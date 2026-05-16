"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileSpreadsheet, Search } from "lucide-react";
import { StatusPill } from "@/components/ui/status-pill";
import { useAuth } from "@/components/auth/auth-provider";
import { saveFirestoreDocument } from "@/lib/firebase-rest";
import { readLocal, writeLocal } from "@/lib/local-store";
import { attendanceToday, students, wellnessToday } from "@/lib/data";
import { getStudentsDataset, type StudentProfile } from "@/lib/app-data";
import { downloadCsv, printPdfReport, type ExportRow } from "@/lib/export-utils";
import { cn } from "@/lib/utils";

type RecordMode = "attendance" | "milk" | "dental";
type StudentRecord = {
  studentId: string;
  status: string;
  note: string;
};

const modeConfig = {
  attendance: {
    storageKey: "daily-attendance-records",
    collection: "attendanceRecords",
    statuses: [
      { value: "present", label: "มาเรียน", tone: "present" },
      { value: "absent", label: "ขาด", tone: "absent" },
      { value: "leave", label: "ลา", tone: "leave" },
      { value: "late", label: "มาสาย", tone: "late" }
    ]
  },
  milk: {
    storageKey: "daily-milk-records",
    collection: "milkRecords",
    statuses: [
      { value: "drank", label: "ดื่ม", tone: "good" },
      { value: "not_drank", label: "ไม่ดื่ม", tone: "warn" }
    ]
  },
  dental: {
    storageKey: "daily-dental-records",
    collection: "dentalRecords",
    statuses: [
      { value: "brushed", label: "แปรง", tone: "good" },
      { value: "not_brushed", label: "ไม่แปรง", tone: "warn" }
    ]
  }
} as const;

function defaultRecords(mode: RecordMode, studentProfiles: StudentProfile[] = students): StudentRecord[] {
  return studentProfiles.map((student) => {
    const attendance = attendanceToday.find((item) => item.studentId === student.id);
    const wellness = wellnessToday.find((item) => item.studentId === student.id);
    const status =
      mode === "attendance"
        ? attendance?.status ?? "present"
        : mode === "milk"
          ? wellness?.milk ?? "drank"
          : wellness?.dental ?? "brushed";

    return {
      studentId: student.id,
      status,
      note: mode === "attendance" ? attendance?.note ?? "" : ""
    };
  });
}

export function StudentRecordWorkspace({ mode, primaryLabel }: { mode: RecordMode; primaryLabel: string }) {
  const config = modeConfig[mode];
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>(students);
  const [records, setRecords] = useState<StudentRecord[]>(() => readLocal(config.storageKey, defaultRecords(mode)));
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    let active = true;

    getStudentsDataset(user?.idToken)
      .then((nextStudents) => {
        if (!active) return;

        setStudentProfiles(nextStudents);
        setRecords((currentRecords) => {
          const nextStudentIds = new Set(nextStudents.map((student) => student.id));
          const currentRecordIds = new Set(currentRecords.map((record) => record.studentId));
          const nextRecords = [
            ...currentRecords.filter((record) => nextStudentIds.has(record.studentId)),
            ...defaultRecords(mode, nextStudents).filter((record) => !currentRecordIds.has(record.studentId))
          ];

          writeLocal(config.storageKey, nextRecords);
          return nextRecords;
        });
      })
      .catch(() => {
        if (active) setStudentProfiles(students);
      });

    return () => {
      active = false;
    };
  }, [config.storageKey, mode, user?.idToken]);

  const filteredStudents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return studentProfiles;
    return studentProfiles.filter((student) => {
      return [student.name, student.className, String(student.no)].some((value) => value.toLowerCase().includes(normalized));
    });
  }, [query, studentProfiles]);

  const visibleStudentIds = useMemo(() => new Set(filteredStudents.map((student) => student.id)), [filteredStudents]);
  const statusSummary = useMemo(() => {
    return config.statuses.map((status) => ({
      ...status,
      count: records.filter((record) => visibleStudentIds.has(record.studentId) && record.status === status.value).length
    }));
  }, [config.statuses, records, visibleStudentIds]);

  function updateRecord(studentId: string, patch: Partial<StudentRecord>) {
    setRecords((currentRecords) => {
      const nextRecords = currentRecords.map((record) => (record.studentId === studentId ? { ...record, ...patch } : record));
      writeLocal(config.storageKey, nextRecords);
      setSaveState("idle");
      return nextRecords;
    });
  }

  function bulkUpdateVisible(status: string) {
    setRecords((currentRecords) => {
      const nextRecords = currentRecords.map((record) => (visibleStudentIds.has(record.studentId) ? { ...record, status } : record));
      writeLocal(config.storageKey, nextRecords);
      setSaveState("idle");
      return nextRecords;
    });
  }

  function buildExportRows(): ExportRow[] {
    return filteredStudents.map((student) => {
      const record = records.find((item) => item.studentId === student.id);
      const status = config.statuses.find((item) => item.value === record?.status);

      return {
        เลขที่: student.no,
        ชื่อ: student.name,
        ห้อง: student.className,
        เพศ: student.gender,
        สถานะ: status?.label ?? record?.status ?? "",
        หมายเหตุ: record?.note ?? ""
      };
    });
  }

  function exportExcel() {
    downloadCsv(`${config.collection}-${new Date().toISOString().slice(0, 10)}.csv`, buildExportRows());
  }

  function exportPdf() {
    printPdfReport(primaryLabel, buildExportRows());
  }

  async function saveRecords() {
    setSaveState("saving");
    const today = new Date().toISOString().slice(0, 10);
    const documentId = `classroom-p4-1-${today}`;

    try {
      await saveFirestoreDocument(
        config.collection,
        documentId,
        {
          classroomId: "p4-1",
          recordDate: today,
          recordedBy: user?.uid ?? "local-demo-user",
          updatedAt: new Date().toISOString(),
          records
        },
        user?.idToken
      );
      writeLocal(config.storageKey, records);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <>
      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-border bg-background p-3">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">รายการที่แสดง</p>
          <p className="mt-1 text-2xl font-semibold">{filteredStudents.length} คน</p>
        </div>
        {statusSummary.map((item) => (
          <div key={item.value} className="rounded-lg border border-border bg-background p-3">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <p className="text-2xl font-semibold">{item.count}</p>
              <StatusPill tone={item.tone}>{item.label}</StatusPill>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 outline-none focus:border-primary"
            placeholder="ค้นหาชื่อนักเรียน เลขที่ หรือห้องเรียน"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {config.statuses.map((item) => (
            <button
              key={item.value}
              type="button"
              className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
              onClick={() => bulkUpdateVisible(item.value)}
            >
              ทั้งหมด: {item.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 font-semibold text-white disabled:opacity-60 sm:flex-none" onClick={saveRecords} disabled={saveState === "saving"}>
            {saveState === "saving" ? "กำลังบันทึก..." : primaryLabel}
          </button>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 font-semibold" onClick={exportExcel}>
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </button>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 font-semibold" onClick={exportPdf}>
            <Download className="h-4 w-4" />
            PDF
          </button>
        </div>
      </div>

      {saveState === "saved" ? <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">บันทึกข้อมูลแล้ว</p> : null}
      {saveState === "error" ? <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">บันทึกไม่สำเร็จ กรุณาลองใหม่</p> : null}

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="hidden grid-cols-[80px_1fr_260px_1fr] bg-muted px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 md:grid">
          <span>เลขที่</span>
          <span>นักเรียน</span>
          <span>สถานะ</span>
          <span>หมายเหตุ</span>
        </div>
        <div className="divide-y divide-border">
          {filteredStudents.map((student) => {
            const record = records.find((item) => item.studentId === student.id) ?? defaultRecords(mode, studentProfiles).find((item) => item.studentId === student.id);
            const status = config.statuses.find((item) => item.value === record?.status) ?? config.statuses[0];

            return (
              <div key={student.id} className="grid gap-3 bg-card px-4 py-4 md:grid-cols-[80px_1fr_260px_1fr] md:items-center">
                <span className="text-sm font-semibold text-slate-500">#{student.no}</span>
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{student.className} · {student.gender}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {config.statuses.map((item) => (
                    <button
                      key={item.value}
                      className={cn("rounded-full border border-border px-3 py-1 text-sm font-medium", record?.status === item.value && "border-transparent bg-primary text-white")}
                      onClick={() => updateRecord(student.id, { status: item.value })}
                    >
                      {item.label}
                    </button>
                  ))}
                  <StatusPill tone={status.tone}>{status.label}</StatusPill>
                </div>
                <input
                  className="min-h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                  placeholder="เพิ่มหมายเหตุ"
                  value={record?.note ?? ""}
                  onChange={(event) => updateRecord(student.id, { note: event.target.value })}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
