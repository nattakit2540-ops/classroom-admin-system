import { listFirestoreDocuments } from "@/lib/firebase-rest";
import { readLocal } from "@/lib/local-store";
import { alerts, attendanceToday, healthTrend, monthlyAttendance, students, studentsWithHealth, wellnessToday } from "@/lib/data";
import { calculateAge, calculateBmi, bmiCategory } from "@/lib/utils";

export type StudentProfile = {
  id: string;
  no: number;
  name: string;
  className: string;
  gender: string;
  birthDate: string;
  weight: number;
  height: number;
};

export type DailyRecord = {
  studentId: string;
  status?: string;
  milk?: string;
  dental?: string;
  note?: string;
};

export type DailyRecordDocument = {
  id?: string;
  classroomId?: string;
  recordDate?: string;
  records?: DailyRecord[];
  updatedAt?: string;
};

async function listFirstCollection<T extends Record<string, unknown>>(collections: string[], idToken?: string) {
  for (const collection of collections) {
    const documents = await listFirestoreDocuments<T>(collection, idToken);
    if (documents.length) return documents;
  }
  return [];
}

function normalizeStudent(document: Record<string, unknown>, index: number): StudentProfile {
  const firstName = String(document.firstName ?? document.first_name ?? "");
  const lastName = String(document.lastName ?? document.last_name ?? "");
  const name = String(document.name ?? document.studentName ?? `${firstName} ${lastName}`.trim() ?? `นักเรียน ${index + 1}`);
  const weight = Number(document.weight ?? document.weightKg ?? document.weight_kg ?? 0);
  const height = Number(document.height ?? document.heightCm ?? document.height_cm ?? 0);

  return {
    id: String(document.studentId ?? document.id ?? document.studentCode ?? `S${String(index + 1).padStart(3, "0")}`),
    no: Number(document.no ?? document.numberInRoom ?? document.number_in_room ?? index + 1),
    name: name || `นักเรียน ${index + 1}`,
    className: String(document.className ?? document.classroom ?? document.roomName ?? "ป.4/1"),
    gender: String(document.gender ?? "-"),
    birthDate: String(document.birthDate ?? document.birth_date ?? "-"),
    weight,
    height
  };
}

export async function getStudentsDataset(idToken?: string) {
  const documents = await listFirstCollection<Record<string, unknown>>(["students", "studentProfiles", "student_records"], idToken);
  const firebaseStudents = documents.map(normalizeStudent).sort((a, b) => a.no - b.no);
  return firebaseStudents.length ? firebaseStudents : students;
}

function latestDocument(documents: DailyRecordDocument[]) {
  return [...documents].sort((a, b) => String(b.updatedAt ?? b.recordDate ?? "").localeCompare(String(a.updatedAt ?? a.recordDate ?? "")))[0];
}

function localRecords(key: string, fallback: DailyRecord[]) {
  return readLocal<DailyRecord[]>(key, fallback);
}

async function recordsFromSource(collection: string, localKey: string, fallback: DailyRecord[], idToken?: string) {
  const documents = await listFirestoreDocuments<DailyRecordDocument>(collection, idToken);
  return latestDocument(documents)?.records ?? localRecords(localKey, fallback);
}

export async function getDashboardDataset(idToken?: string) {
  const studentProfiles = await getStudentsDataset(idToken);
  const attendance = await recordsFromSource("attendanceRecords", "daily-attendance-records", attendanceToday, idToken);
  const milkRecords = await recordsFromSource(
    "milkRecords",
    "daily-milk-records",
    wellnessToday.map((record) => ({ studentId: record.studentId, status: record.milk })),
    idToken
  );
  const dentalRecords = await recordsFromSource(
    "dentalRecords",
    "daily-dental-records",
    wellnessToday.map((record) => ({ studentId: record.studentId, status: record.dental })),
    idToken
  );

  return {
    students: studentProfiles,
    attendance,
    milkRecords,
    dentalRecords,
    monthlyAttendance,
    healthTrend,
    alerts,
    totals: {
      present: attendance.filter((item) => item.status === "present").length,
      late: attendance.filter((item) => item.status === "late").length,
      absent: attendance.filter((item) => item.status === "absent").length,
      leave: attendance.filter((item) => item.status === "leave").length,
      milk: milkRecords.filter((item) => item.status === "drank").length,
      dental: dentalRecords.filter((item) => item.status === "brushed").length
    }
  };
}

export async function getHealthDataset(idToken?: string) {
  const documents = await listFirestoreDocuments<Record<string, unknown>>("healthRecords", idToken);
  if (!documents.length) {
    const studentProfiles = await getStudentsDataset(idToken);
    if (studentProfiles.length && studentProfiles.some((student) => !students.some((sample) => sample.id === student.id))) {
      return studentProfiles.map((student) => {
        const bmi = student.weight && student.height ? calculateBmi(student.weight, student.height) : 0;
        return {
          ...student,
          age: student.birthDate !== "-" ? calculateAge(student.birthDate) : 0,
          bmi,
          bmiCategory: bmi ? bmiCategory(bmi) : "-"
        };
      });
    }
    return studentsWithHealth;
  }

  return documents.map((document, index) => ({
    id: String(document.studentId ?? document.id ?? `H${index}`),
    no: Number(document.no ?? index + 1),
    name: String(document.name ?? document.studentName ?? "นักเรียน"),
    className: String(document.className ?? "ป.4/1"),
    gender: String(document.gender ?? "-"),
    birthDate: String(document.birthDate ?? "-"),
    age: Number(document.age ?? 0),
    weight: Number(document.weight ?? document.weightKg ?? 0),
    height: Number(document.height ?? document.heightCm ?? 0),
    bmi: Number(document.bmi ?? 0),
    bmiCategory: String(document.bmiCategory ?? "-")
  }));
}
