import { calculateAge, calculateBmi, bmiCategory } from "@/lib/utils";

export const currentUser = {
  name: "ครูอรอนงค์ ใจดี",
  role: "ครูประจำชั้น",
  school: "โรงเรียนบ้านสุขใจ",
  classroom: "ป.4/1"
};

export const students = [
  { id: "S001", no: 1, name: "เด็กชายกิตติพงษ์ สมบูรณ์", className: "ป.4/1", gender: "ชาย", birthDate: "2015-02-08", weight: 31.2, height: 137 },
  { id: "S002", no: 2, name: "เด็กหญิงณัฐธิดา แสงใส", className: "ป.4/1", gender: "หญิง", birthDate: "2015-04-22", weight: 29.5, height: 136 },
  { id: "S003", no: 3, name: "เด็กชายปกรณ์ วงศ์ดี", className: "ป.4/1", gender: "ชาย", birthDate: "2014-11-14", weight: 42.1, height: 139 },
  { id: "S004", no: 4, name: "เด็กหญิงวรัญญา มั่นคง", className: "ป.4/1", gender: "หญิง", birthDate: "2015-07-02", weight: 24.8, height: 132 },
  { id: "S005", no: 5, name: "เด็กชายธนกฤต สุขสวัสดิ์", className: "ป.4/1", gender: "ชาย", birthDate: "2015-01-19", weight: 33.6, height: 140 },
  { id: "S006", no: 6, name: "เด็กหญิงพิมพ์ชนก จันทร์ทอง", className: "ป.4/1", gender: "หญิง", birthDate: "2014-10-30", weight: 36.4, height: 141 }
];

export const attendanceToday = [
  { studentId: "S001", status: "present", note: "" },
  { studentId: "S002", status: "present", note: "" },
  { studentId: "S003", status: "late", note: "มาถึง 08:32 น." },
  { studentId: "S004", status: "absent", note: "รอติดต่อผู้ปกครอง" },
  { studentId: "S005", status: "leave", note: "ลาป่วย" },
  { studentId: "S006", status: "present", note: "" }
];

export const wellnessToday = [
  { studentId: "S001", milk: "drank", dental: "brushed" },
  { studentId: "S002", milk: "drank", dental: "brushed" },
  { studentId: "S003", milk: "not_drank", dental: "brushed" },
  { studentId: "S004", milk: "not_drank", dental: "not_brushed" },
  { studentId: "S005", milk: "drank", dental: "not_brushed" },
  { studentId: "S006", milk: "drank", dental: "brushed" }
];

export const monthlyAttendance = [
  { month: "พ.ย.", present: 92, absent: 3, late: 5 },
  { month: "ธ.ค.", present: 91, absent: 4, late: 5 },
  { month: "ม.ค.", present: 94, absent: 2, late: 4 },
  { month: "ก.พ.", present: 93, absent: 3, late: 4 },
  { month: "มี.ค.", present: 95, absent: 2, late: 3 },
  { month: "พ.ค.", present: 90, absent: 4, late: 6 }
];

export const healthTrend = [
  { month: "พ.ย.", normal: 68, under: 12, over: 20 },
  { month: "ธ.ค.", normal: 69, under: 11, over: 20 },
  { month: "ม.ค.", normal: 71, under: 10, over: 19 },
  { month: "ก.พ.", normal: 73, under: 9, over: 18 },
  { month: "มี.ค.", normal: 74, under: 9, over: 17 },
  { month: "พ.ค.", normal: 72, under: 10, over: 18 }
];

export const studentsWithHealth = students.map((student) => {
  const bmi = calculateBmi(student.weight, student.height);
  return {
    ...student,
    age: calculateAge(student.birthDate),
    bmi,
    bmiCategory: bmiCategory(bmi)
  };
});

export const alerts = [
  { title: "ติดตามการขาดเรียน", detail: "เด็กหญิงวรัญญา ขาดเรียนวันนี้และขาดสะสม 2 ครั้งในเดือนนี้", level: "high" },
  { title: "สุขภาพต้องเฝ้าระวัง", detail: "เด็กชายปกรณ์ BMI อยู่ในกลุ่มอ้วน ควรส่งต่อครูอนามัย", level: "medium" },
  { title: "พฤติกรรมสุขอนามัย", detail: "มีนักเรียน 2 คนยังไม่ได้บันทึก/ไม่ได้แปรงฟันวันนี้", level: "low" }
];

export const reportCards = [
  { title: "รายงานเช็คชื่อรายวัน", description: "สรุปมาเรียน ขาด ลา มาสาย พร้อมหมายเหตุ", format: "PDF / Excel" },
  { title: "รายงานสุขภาพรายห้อง", description: "น้ำหนัก ส่วนสูง BMI อายุ และกลุ่มเสี่ยง", format: "PDF / Excel" },
  { title: "รายงานดื่มนมรายเดือน", description: "อัตราการดื่มนม แยกตามห้องเรียนและเดือน", format: "Excel" },
  { title: "รายงานแปรงฟันรายเดือน", description: "แนวโน้มสุขอนามัยรายห้องและรายบุคคล", format: "Excel" }
];
