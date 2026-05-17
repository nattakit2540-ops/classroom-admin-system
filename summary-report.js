/**
 * summary-report.js
 * ตารางสรุปรายงานราชการสำหรับ Nongpeung 4-6 Classroom
 * อ่านข้อมูลจาก state เดิมเท่านั้น ไม่สร้าง collection และไม่เปลี่ยน Firebase schema
 */
"use strict";

const summaryReportSchoolName = "โรงเรียนชุมชนบ้านหนองผึ้ง";
const summaryReportClasses = {
  "ป.4": { id: "p4", name: "ป.4", label: "ประถมศึกษาปีที่ 4" },
  "ป.5": { id: "p5", name: "ป.5", label: "ประถมศึกษาปีที่ 5" },
  "ป.6": { id: "p6", name: "ป.6", label: "ประถมศึกษาปีที่ 6" }
};
const summaryReportClassOrder = ["ป.4", "ป.5", "ป.6"];

let summaryReportCurrentRows = [];
let summaryReportCurrentCols = [];
let summaryReportCurrentTotals = {};
let summaryReportCurrentTitle = "";
let summaryReportCurrentClassLabel = "ทุกชั้น";

function summaryReportMount() {
  const main = document.getElementById("mainContent");
  if (!main || !document.getElementById("reportPreview") || document.getElementById("summary-report-section")) return;

  const toolbar = main.querySelector(".toolbar");
  if (toolbar && !document.getElementById("summary-report-mode-select")) {
    const switcher = document.createElement("div");
    switcher.className = "summary-report-mode-switcher summary-report-screen-only";
    switcher.innerHTML = `
      <label for="summary-report-mode-select">รูปแบบรายงาน:</label>
      <select id="summary-report-mode-select">
        <option value="list">รายชื่อรายบุคคล</option>
        <option value="summary_daily">ตารางสรุปผลรวมรายวัน</option>
        <option value="summary_monthly">ตารางสรุปรายเดือน</option>
        <option value="summary_signed">รายงานพร้อมช่องลงชื่อ</option>
      </select>
    `;
    toolbar.appendChild(switcher);
    switcher.querySelector("select").addEventListener("change", summaryReportInit);
  }

  const section = document.createElement("section");
  section.id = "summary-report-section";
  section.className = "summary-report-section";
  section.innerHTML = summaryReportRenderShell();
  const reportCard = document.getElementById("reportPreview")?.closest(".card");
  (reportCard || main).insertAdjacentElement("afterend", section);
  summaryReportBindControls(section);
  summaryReportRenderControls();
  summaryReportEnsureOverlay();
}

function summaryReportRenderShell() {
  return `
    <div class="summary-report-controls-panel summary-report-screen-only">
      <div class="summary-report-controls-grid">
        <div class="summary-report-control-item">
          <label for="summary-report-type">ประเภทรายงาน</label>
          <select id="summary-report-type">
            <option value="attendance_daily">การมาเรียนรายวัน</option>
            <option value="attendance_monthly">การมาเรียนรายเดือน</option>
            <option value="milk">ดื่มนม</option>
            <option value="toothbrush">แปรงฟัน</option>
            <option value="bmi">สุขภาพ / BMI</option>
            <option value="behavior">พฤติกรรม</option>
          </select>
        </div>
        <div class="summary-report-control-item">
          <label for="summary-report-class">ระดับชั้น</label>
          <select id="summary-report-class">
            <option value="all">ทุกชั้น</option>
            <option value="ป.4">ป.4</option>
            <option value="ป.5">ป.5</option>
            <option value="ป.6">ป.6</option>
          </select>
        </div>
        <div class="summary-report-control-item" data-summary-report-date-wrap>
          <label for="summary-report-date">วันที่</label>
          <input type="date" id="summary-report-date">
        </div>
        <div class="summary-report-control-item" data-summary-report-month-wrap>
          <label for="summary-report-month">เดือน</label>
          <input type="month" id="summary-report-month">
        </div>
        <div class="summary-report-control-item">
          <label for="summary-report-year">ปีการศึกษา</label>
          <select id="summary-report-year">
            <option value="2567">2567</option>
            <option value="2568">2568</option>
            <option value="2569" selected>2569</option>
          </select>
        </div>
        <div class="summary-report-control-item">
          <label for="summary-report-term">ภาคเรียน</label>
          <select id="summary-report-term">
            <option value="1" selected>ภาคเรียนที่ 1</option>
            <option value="2">ภาคเรียนที่ 2</option>
          </select>
        </div>
      </div>
      <div class="summary-report-actions summary-report-screen-only">
        <button type="button" class="summary-report-btn summary-report-btn--primary" data-summary-report-action="generate">สร้างตารางสรุป</button>
        <button type="button" class="summary-report-btn" data-summary-report-action="print">พิมพ์ตารางสรุป</button>
        <button type="button" class="summary-report-btn" data-summary-report-action="csv">Export CSV</button>
        <button type="button" class="summary-report-btn" data-summary-report-action="copy">คัดลอกตาราง</button>
        <button type="button" class="summary-report-btn" data-summary-report-action="reload">โหลดข้อมูลใหม่</button>
      </div>
    </div>
    <div id="summary-report-output" class="summary-report-output">
      <div class="summary-report-empty-state">เลือกประเภทรายงานและกด <strong>สร้างตารางสรุป</strong> เพื่อดูข้อมูล</div>
    </div>
  `;
}

function summaryReportBindControls(section) {
  section.querySelector("#summary-report-type")?.addEventListener("change", summaryReportSyncPeriodFields);
  section.querySelector("[data-summary-report-action='generate']")?.addEventListener("click", summaryReportGenerate);
  section.querySelector("[data-summary-report-action='reload']")?.addEventListener("click", summaryReportGenerate);
  section.querySelector("[data-summary-report-action='print']")?.addEventListener("click", summaryReportPrint);
  section.querySelector("[data-summary-report-action='csv']")?.addEventListener("click", summaryReportExportCSV);
  section.querySelector("[data-summary-report-action='copy']")?.addEventListener("click", summaryReportCopyTable);
}

function summaryReportEnsureOverlay() {
  if (!document.getElementById("summary-report-print-overlay")) {
    const overlay = document.createElement("div");
    overlay.id = "summary-report-print-overlay";
    overlay.className = "summary-report-print-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "ตัวอย่างก่อนพิมพ์");
    overlay.innerHTML = `
      <div class="summary-report-print-modal">
        <div class="summary-report-print-modal-header summary-report-screen-only">
          <button type="button" class="summary-report-btn summary-report-btn--primary" data-summary-report-print-current>พิมพ์รายงาน</button>
          <button type="button" class="summary-report-btn" data-summary-report-print-close>ปิด</button>
        </div>
        <div class="summary-report-print-area" id="summary-report-print-area"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector("[data-summary-report-print-current]").addEventListener("click", summaryReportPrintCurrent);
    overlay.querySelector("[data-summary-report-print-close]").addEventListener("click", summaryReportPrintClosePreview);
  }

  if (!document.getElementById("summary-report-toast")) {
    const toast = document.createElement("div");
    toast.id = "summary-report-toast";
    toast.className = "summary-report-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
}

function summaryReportInit() {
  const mode = document.getElementById("summary-report-mode-select")?.value || "list";
  const section = document.getElementById("summary-report-section");
  if (!section) return;
  section.style.display = mode === "list" ? "none" : "block";
  summaryReportSyncPeriodFields();
}

function summaryReportRenderControls() {
  const today = new Date();
  const date = today.toISOString().slice(0, 10);
  const month = date.slice(0, 7);
  const dateInput = document.getElementById("summary-report-date");
  const monthInput = document.getElementById("summary-report-month");
  const classInput = document.getElementById("summary-report-class");
  if (dateInput && !dateInput.value) dateInput.value = date;
  if (monthInput && !monthInput.value) monthInput.value = month;
  if (classInput && typeof state !== "undefined" && state.classLevel && state.classLevel !== "all") classInput.value = state.classLevel;
  summaryReportSyncPeriodFields();
}

function summaryReportSyncPeriodFields() {
  const type = document.getElementById("summary-report-type")?.value || "";
  const mode = document.getElementById("summary-report-mode-select")?.value || "";
  const isMonthly = type === "attendance_monthly" || mode === "summary_monthly";
  const isBmi = type === "bmi";
  const dateWrap = document.querySelector("[data-summary-report-date-wrap]");
  const monthWrap = document.querySelector("[data-summary-report-month-wrap]");
  if (dateWrap) dateWrap.style.display = isMonthly || isBmi ? "none" : "block";
  if (monthWrap) monthWrap.style.display = isMonthly ? "block" : "none";
}

function summaryReportGetStateArray(name) {
  if (typeof state === "undefined" || !Array.isArray(state[name])) return [];
  return state[name];
}

function summaryReportGetSelectedClasses() {
  const selected = document.getElementById("summary-report-class")?.value || "all";
  return selected === "all" ? [...summaryReportClassOrder] : [selected];
}

function summaryReportGetClassLabel() {
  const selected = document.getElementById("summary-report-class")?.value || "all";
  return selected === "all" ? "ทุกชั้น" : selected;
}

function summaryReportGetStudents(classLevel) {
  return summaryReportGetStateArray("students")
    .filter((student) => student.classLevel === classLevel)
    .filter((student) => student.active !== false && student.status !== "ย้ายออก")
    .sort((a, b) => Number(a.studentNo || a.number || 0) - Number(b.studentNo || b.number || 0));
}

function summaryReportFilterDailyDocs(items, classLevel, date, type) {
  return items.filter((item) => item.classLevel === classLevel && item.date === date && (!type || item.type === type));
}

function summaryReportFilterMonthDocs(items, classLevel, month, type) {
  return items.filter((item) => item.classLevel === classLevel && String(item.date || "").startsWith(month) && (!type || item.type === type));
}

function summaryReportFlattenRecords(docs) {
  return docs.flatMap((doc) => Array.isArray(doc.records)
    ? doc.records.map((record) => ({ ...record, parent: doc }))
    : []);
}

function summaryReportStatusCount(records, statuses) {
  return records.filter((record) => statuses.includes(record.status)).length;
}

function summaryReportLatestDateValue(item) {
  const value = item.recordDate || item.date || item.createdAt || item.updatedAt || "";
  if (value && typeof value.toDate === "function") return value.toDate().getTime();
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function summaryReportGetLatestHealthByStudent(classLevel) {
  const latest = new Map();
  summaryReportGetStateArray("healthRecords")
    .filter((item) => item.classLevel === classLevel)
    .forEach((item) => {
      const current = latest.get(item.studentId);
      if (!current || summaryReportLatestDateValue(item) >= summaryReportLatestDateValue(current)) {
        latest.set(item.studentId, item);
      }
    });
  return latest;
}

function summaryReportClassName(classLevel) {
  return summaryReportClasses[classLevel]?.name || classLevel || "-";
}

function summaryReportCalculateTotals(rows) {
  return rows.reduce((totals, row) => {
    Object.entries(row).forEach(([key, value]) => {
      if (key !== "class" && typeof value === "number" && Number.isFinite(value)) {
        totals[key] = (totals[key] || 0) + value;
      }
    });
    return totals;
  }, {});
}

function summaryReportFormatPercent(value) {
  if (!Number.isFinite(value)) return '<span class="summary-report-pct-bad">-</span>';
  const rounded = Math.round(value * 10) / 10;
  const cls = rounded < 80 ? "summary-report-pct-bad" : rounded < 90 ? "summary-report-pct-ok" : "summary-report-pct-good";
  return `<span class="${cls}">${rounded.toFixed(1)}%</span>`;
}

function summaryReportPctText(value) {
  if (!Number.isFinite(value)) return "-";
  return `${(Math.round(value * 10) / 10).toFixed(1)}%`;
}

function summaryReportEscape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function summaryReportRenderTable(columns, rows, totals) {
  if (!rows.length) return '<div class="summary-report-empty-state">ยังไม่มีข้อมูลสำหรับสร้างตารางสรุปนี้</div>';
  const head = columns.map((col) => `<th>${summaryReportEscape(col.label)}</th>`).join("");
  const body = rows.map((row) => `
    <tr>${columns.map((col) => summaryReportRenderTableCell(col, row)).join("")}</tr>
  `).join("");
  const totalRow = summaryReportRenderTotalRow(columns, totals);
  return `
    <div class="summary-report-table-wrap">
      <table class="summary-report-table">
        <thead><tr>${head}</tr></thead>
        <tbody>${body}${totalRow}</tbody>
      </table>
    </div>
  `;
}

function summaryReportRenderTableCell(col, row) {
  if (col.type === "class") return `<td class="summary-report-td-center">${summaryReportEscape(row[col.key] ?? "-")}</td>`;
  if (col.type === "pct") return `<td class="summary-report-td-right">${summaryReportFormatPercent(row[col.key])}</td>`;
  return `<td class="summary-report-td-right">${summaryReportEscape(row[col.key] ?? "-")}</td>`;
}

function summaryReportRenderTotalRow(columns, totals) {
  if (!totals || !Object.keys(totals).length) return "";
  return `
    <tr class="summary-report-total-row">
      ${columns.map((col, index) => {
        if (index === 0) return '<td class="summary-report-td-center">รวมทั้งหมด</td>';
        if (col.type === "pct") {
          const den = totals[col.pctDenKey] || 0;
          const pct = den > 0 ? ((totals[col.pctNumKey] || 0) / den) * 100 : 0;
          return `<td class="summary-report-td-right">${summaryReportFormatPercent(pct)}</td>`;
        }
        return `<td class="summary-report-td-right">${summaryReportEscape(totals[col.key] ?? "-")}</td>`;
      }).join("")}
    </tr>
  `;
}

async function summaryReportGenerateAttendanceDaily(classLevelsForReport, date) {
  summaryReportCurrentTitle = "รายงานสรุปการมาเรียนประจำวัน";
  const rows = classLevelsForReport.map((classLevel) => {
    const students = summaryReportGetStudents(classLevel);
    const records = summaryReportFlattenRecords(summaryReportFilterDailyDocs(summaryReportGetStateArray("attendance"), classLevel, date, "daily"));
    const total = students.length;
    const present = summaryReportStatusCount(records, ["มาเรียน", "อยู่"]);
    const absent = summaryReportStatusCount(records, ["ขาด", "ขาดเรียน"]);
    const leave = summaryReportStatusCount(records, ["ลา"]);
    const late = summaryReportStatusCount(records, ["มาสาย"]);
    const notCome = absent + leave + late;
    const pct = total > 0 ? (present / total) * 100 : 0;
    return { class: summaryReportClassName(classLevel), total, present, absent, leave, late, notCome, pct };
  });
  const cols = [
    { key: "class", label: "ชั้น", type: "class" },
    { key: "total", label: "นักเรียนทั้งหมด", type: "num" },
    { key: "present", label: "มาเรียน", type: "num" },
    { key: "absent", label: "ขาด", type: "num" },
    { key: "leave", label: "ลา", type: "num" },
    { key: "late", label: "มาสาย", type: "num" },
    { key: "notCome", label: "รวมไม่มา", type: "num" },
    { key: "pct", label: "ร้อยละมาเรียน", type: "pct", pctNumKey: "present", pctDenKey: "total" }
  ];
  return { cols, rows, totals: summaryReportCalculateTotals(rows) };
}

async function summaryReportGenerateAttendanceMonthly(classLevelsForReport, month) {
  summaryReportCurrentTitle = "รายงานสรุปการมาเรียนรายเดือน";
  const rows = classLevelsForReport.map((classLevel) => {
    const students = summaryReportGetStudents(classLevel);
    const docs = summaryReportFilterMonthDocs(summaryReportGetStateArray("attendance"), classLevel, month, "daily");
    const records = summaryReportFlattenRecords(docs);
    const days = new Set(docs.map((item) => item.date)).size;
    const total = students.length;
    const expected = days * total;
    const attendTimes = summaryReportStatusCount(records, ["มาเรียน", "อยู่"]);
    const absent = summaryReportStatusCount(records, ["ขาด", "ขาดเรียน"]);
    const leave = summaryReportStatusCount(records, ["ลา"]);
    const late = summaryReportStatusCount(records, ["มาสาย"]);
    const pctAvg = expected > 0 ? (attendTimes / expected) * 100 : 0;
    return { class: summaryReportClassName(classLevel), days, total, expected, attendTimes, absent, leave, late, pctAvg };
  });
  const cols = [
    { key: "class", label: "ชั้น", type: "class" },
    { key: "days", label: "วันเรียน", type: "num" },
    { key: "total", label: "นักเรียน", type: "num" },
    { key: "expected", label: "ครั้งที่ควรมา", type: "num" },
    { key: "attendTimes", label: "ครั้งที่มา", type: "num" },
    { key: "absent", label: "ขาด", type: "num" },
    { key: "leave", label: "ลา", type: "num" },
    { key: "late", label: "มาสาย", type: "num" },
    { key: "pctAvg", label: "ร้อยละเฉลี่ย", type: "pct", pctNumKey: "attendTimes", pctDenKey: "expected" }
  ];
  return { cols, rows, totals: summaryReportCalculateTotals(rows) };
}

async function summaryReportGenerateMilk(classLevelsForReport, date) {
  summaryReportCurrentTitle = "รายงานสรุปการดื่มนม";
  const rows = classLevelsForReport.map((classLevel) => {
    const total = summaryReportGetStudents(classLevel).length;
    const records = summaryReportFlattenRecords(summaryReportFilterDailyDocs(summaryReportGetStateArray("milkRecords"), classLevel, date));
    const milkYes = summaryReportStatusCount(records, ["ดื่ม"]);
    const milkNo = summaryReportStatusCount(records, ["ไม่ดื่ม"]);
    const absent = summaryReportStatusCount(records, ["ขาด", "ลา"]);
    const pct = total > 0 ? (milkYes / total) * 100 : 0;
    return { class: summaryReportClassName(classLevel), total, milkYes, milkNo, absent, pct };
  });
  const cols = [
    { key: "class", label: "ชั้น", type: "class" },
    { key: "total", label: "นักเรียนทั้งหมด", type: "num" },
    { key: "milkYes", label: "ดื่มนม", type: "num" },
    { key: "milkNo", label: "ไม่ดื่มนม", type: "num" },
    { key: "absent", label: "ขาด/ลา", type: "num" },
    { key: "pct", label: "ร้อยละดื่มนม", type: "pct", pctNumKey: "milkYes", pctDenKey: "total" }
  ];
  return { cols, rows, totals: summaryReportCalculateTotals(rows) };
}

async function summaryReportGenerateToothbrush(classLevelsForReport, date) {
  summaryReportCurrentTitle = "รายงานสรุปการแปรงฟัน";
  const rows = classLevelsForReport.map((classLevel) => {
    const total = summaryReportGetStudents(classLevel).length;
    const records = summaryReportFlattenRecords(summaryReportFilterDailyDocs(summaryReportGetStateArray("toothbrushRecords"), classLevel, date));
    const toothYes = summaryReportStatusCount(records, ["แปรงฟัน"]);
    const toothNo = summaryReportStatusCount(records, ["ไม่แปรง"]);
    const forgot = summaryReportStatusCount(records, ["ลืมอุปกรณ์"]);
    const absent = summaryReportStatusCount(records, ["ขาด", "ลา"]);
    const pct = total > 0 ? (toothYes / total) * 100 : 0;
    return { class: summaryReportClassName(classLevel), total, toothYes, toothNo, forgot, absent, pct };
  });
  const cols = [
    { key: "class", label: "ชั้น", type: "class" },
    { key: "total", label: "นักเรียนทั้งหมด", type: "num" },
    { key: "toothYes", label: "แปรงฟัน", type: "num" },
    { key: "toothNo", label: "ไม่แปรงฟัน", type: "num" },
    { key: "forgot", label: "ลืมอุปกรณ์", type: "num" },
    { key: "absent", label: "ขาด/ลา", type: "num" },
    { key: "pct", label: "ร้อยละแปรงฟัน", type: "pct", pctNumKey: "toothYes", pctDenKey: "total" }
  ];
  return { cols, rows, totals: summaryReportCalculateTotals(rows) };
}

async function summaryReportGenerateBMI(classLevelsForReport) {
  summaryReportCurrentTitle = "รายงานสรุปสุขภาพ / BMI";
  const rows = classLevelsForReport.map((classLevel) => {
    const students = summaryReportGetStudents(classLevel);
    const latest = summaryReportGetLatestHealthByStudent(classLevel);
    const values = students.map((student) => latest.get(student.id) || latest.get(student.studentId)).filter(Boolean);
    const thin = values.filter((item) => item.bmiCategory === "ผอม" || item.bmiCategory === "thin").length;
    const normal = values.filter((item) => item.bmiCategory === "ปกติ" || item.bmiCategory === "normal").length;
    const overweight = values.filter((item) => item.bmiCategory === "เริ่มอ้วน" || item.bmiCategory === "overweight").length;
    const obese = values.filter((item) => item.bmiCategory === "อ้วน" || item.bmiCategory === "obese").length;
    return { class: summaryReportClassName(classLevel), total: students.length, thin, normal, overweight, obese, followup: thin + overweight + obese };
  });
  const cols = [
    { key: "class", label: "ชั้น", type: "class" },
    { key: "total", label: "นักเรียนทั้งหมด", type: "num" },
    { key: "thin", label: "ผอม", type: "num" },
    { key: "normal", label: "ปกติ", type: "num" },
    { key: "overweight", label: "เริ่มอ้วน", type: "num" },
    { key: "obese", label: "อ้วน", type: "num" },
    { key: "followup", label: "ควรติดตาม", type: "num" }
  ];
  return { cols, rows, totals: summaryReportCalculateTotals(rows) };
}

async function summaryReportGenerateBehavior(classLevelsForReport, date) {
  summaryReportCurrentTitle = "รายงานสรุปพฤติกรรม";
  const rows = classLevelsForReport.map((classLevel) => {
    const records = summaryReportGetStateArray("behaviorRecords").filter((item) => item.classLevel === classLevel && item.date === date);
    const goodRecords = records.filter((item) => item.behaviorType === "good" || item.behaviorType === "ความดี");
    const disciplineRecords = records.filter((item) => item.behaviorType === "discipline" || item.behaviorType === "ผิดระเบียบ");
    const disciplineByStudent = disciplineRecords.reduce((map, item) => {
      map[item.studentId] = (map[item.studentId] || 0) + 1;
      return map;
    }, {});
    return {
      class: summaryReportClassName(classLevel),
      total: summaryReportGetStudents(classLevel).length,
      goodRecords: goodRecords.length,
      disciplineRecords: disciplineRecords.length,
      goodScore: goodRecords.reduce((sum, item) => sum + Number(item.score || 0), 0),
      badScore: disciplineRecords.reduce((sum, item) => sum + Number(item.score || 0), 0),
      followup: Object.values(disciplineByStudent).filter((count) => count >= 2).length
    };
  });
  const cols = [
    { key: "class", label: "ชั้น", type: "class" },
    { key: "total", label: "นักเรียนทั้งหมด", type: "num" },
    { key: "goodRecords", label: "บันทึกความดี", type: "num" },
    { key: "disciplineRecords", label: "บันทึกผิดระเบียบ", type: "num" },
    { key: "goodScore", label: "คะแนนบวก", type: "num" },
    { key: "badScore", label: "คะแนนลบรวม", type: "num" },
    { key: "followup", label: "นักเรียนควรติดตาม", type: "num" }
  ];
  return { cols, rows, totals: summaryReportCalculateTotals(rows) };
}

async function summaryReportGenerate() {
  const output = document.getElementById("summary-report-output");
  if (!output) return;
  output.innerHTML = '<div class="summary-report-loading-state">Sensei กำลังจัดทำตารางสรุปรายงานราชการให้นะ 🌸</div>';

  try {
    if (typeof state === "undefined") throw new Error("ไม่พบ state ของระบบเดิม");
    const type = document.getElementById("summary-report-type")?.value || "attendance_daily";
    const classLevelsForReport = summaryReportGetSelectedClasses();
    const date = document.getElementById("summary-report-date")?.value || new Date().toISOString().slice(0, 10);
    const month = document.getElementById("summary-report-month")?.value || date.slice(0, 7);
    const year = document.getElementById("summary-report-year")?.value || "";
    const term = document.getElementById("summary-report-term")?.value || "";
    let result;

    if (type === "attendance_daily") result = await summaryReportGenerateAttendanceDaily(classLevelsForReport, date);
    if (type === "attendance_monthly") result = await summaryReportGenerateAttendanceMonthly(classLevelsForReport, month);
    if (type === "milk") result = await summaryReportGenerateMilk(classLevelsForReport, date);
    if (type === "toothbrush") result = await summaryReportGenerateToothbrush(classLevelsForReport, date);
    if (type === "bmi") result = await summaryReportGenerateBMI(classLevelsForReport);
    if (type === "behavior") result = await summaryReportGenerateBehavior(classLevelsForReport, date);
    if (!result) throw new Error("ไม่รู้จักประเภทรายงาน");

    summaryReportCurrentCols = result.cols;
    summaryReportCurrentRows = result.rows;
    summaryReportCurrentTotals = result.totals;
    summaryReportCurrentClassLabel = summaryReportGetClassLabel();

    const periodLabel = type === "attendance_monthly" ? month : type === "bmi" ? "ข้อมูล BMI ล่าสุด" : date;
    output.innerHTML = `
      <div class="summary-report-output-header">
        <strong>${summaryReportEscape(summaryReportCurrentTitle)}</strong>
        <span>ชั้น ${summaryReportEscape(summaryReportCurrentClassLabel)} | ${summaryReportEscape(periodLabel)} | ปีการศึกษา ${summaryReportEscape(year)} ภาคเรียนที่ ${summaryReportEscape(term)}</span>
      </div>
      ${summaryReportRenderTable(result.cols, result.rows, result.totals)}
    `;
  } catch (error) {
    console.error("[summaryReport] Error:", error);
    output.innerHTML = '<div class="summary-report-error-state">ไม่สามารถโหลดข้อมูลรายงานได้ กรุณาตรวจสอบข้อมูลเดิมหรือกดโหลดใหม่อีกครั้ง</div>';
  }
}

function summaryReportPrintFormatThaiDate(dateStr) {
  if (!dateStr) return "............";
  if (/^\d{4}-\d{2}$/.test(dateStr)) {
    const [year, month] = dateStr.split("-");
    const months = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    return `${months[Number(month)]} พ.ศ. ${Number(year) + 543}`;
  }
  const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return `${date.getDate()} ${months[date.getMonth()]} พ.ศ. ${date.getFullYear() + 543}`;
}

function summaryReportPrintRenderHeader(reportTitle, classLabel, periodLabel, year, term) {
  return `
    <div class="summary-report-print-header">
      <h1>${summaryReportEscape(summaryReportSchoolName)}</h1>
      <h2>${summaryReportEscape(reportTitle)}</h2>
      <p>ระดับชั้น ${summaryReportEscape(classLabel)} ปีการศึกษา ${summaryReportEscape(year)} ภาคเรียนที่ ${summaryReportEscape(term)}</p>
      <p>ประจำวันที่ ${summaryReportEscape(summaryReportPrintFormatThaiDate(periodLabel))}</p>
    </div>
  `;
}

function summaryReportPrintRenderTable(cols, rows, totals) {
  const head = cols.map((col) => `<th>${summaryReportEscape(col.label)}</th>`).join("");
  const body = rows.map((row) => `<tr>${cols.map((col) => summaryReportPrintRenderCell(col, row)).join("")}</tr>`).join("");
  const totalRow = totals && Object.keys(totals).length ? `
    <tr class="summary-report-print-total-row">
      ${cols.map((col, index) => {
        if (index === 0) return '<td class="summary-report-print-center">รวมทั้งหมด</td>';
        if (col.type === "pct") {
          const den = totals[col.pctDenKey] || 0;
          return `<td class="summary-report-print-right">${summaryReportPctText(den ? ((totals[col.pctNumKey] || 0) / den) * 100 : 0)}</td>`;
        }
        return `<td class="summary-report-print-right">${summaryReportEscape(totals[col.key] ?? "-")}</td>`;
      }).join("")}
    </tr>
  ` : "";
  return `<table class="summary-report-print-table"><thead><tr>${head}</tr></thead><tbody>${body}${totalRow}</tbody></table>`;
}

function summaryReportPrintRenderCell(col, row) {
  if (col.type === "class") return `<td class="summary-report-print-center">${summaryReportEscape(row[col.key] ?? "-")}</td>`;
  if (col.type === "pct") return `<td class="summary-report-print-right">${summaryReportPctText(row[col.key])}</td>`;
  return `<td class="summary-report-print-right">${summaryReportEscape(row[col.key] ?? "-")}</td>`;
}

function summaryReportPrintRenderSignature() {
  return `
    <div class="summary-report-print-signature">
      <div class="summary-report-print-signature-block">
        <div class="summary-report-print-signature-line">ลงชื่อ ........................................ ครูผู้รายงาน</div>
        <div>( ........................................ )</div>
        <div>วันที่ ........ / ........ / ........</div>
      </div>
      <div class="summary-report-print-signature-block">
        <div class="summary-report-print-signature-line">ลงชื่อ ........................................ ผู้ตรวจสอบ</div>
        <div>( ........................................ )</div>
        <div>วันที่ ........ / ........ / ........</div>
      </div>
    </div>
  `;
}

function summaryReportPrint() {
  if (!summaryReportCurrentRows.length) {
    summaryReportShowToast("กรุณาสร้างตารางสรุปก่อนพิมพ์", "error");
    return;
  }
  summaryReportEnsureOverlay();
  const type = document.getElementById("summary-report-type")?.value || "";
  const date = document.getElementById("summary-report-date")?.value || "";
  const month = document.getElementById("summary-report-month")?.value || "";
  const year = document.getElementById("summary-report-year")?.value || "";
  const term = document.getElementById("summary-report-term")?.value || "";
  const period = type === "attendance_monthly" ? month : type === "bmi" ? "" : date;
  const printArea = document.getElementById("summary-report-print-area");
  printArea.innerHTML = [
    summaryReportPrintRenderHeader(summaryReportCurrentTitle, summaryReportCurrentClassLabel, period, year, term),
    summaryReportPrintRenderTable(summaryReportCurrentCols, summaryReportCurrentRows, summaryReportCurrentTotals),
    summaryReportPrintRenderSignature()
  ].join("");
  document.getElementById("summary-report-print-overlay").style.display = "flex";
}

function summaryReportPrintCurrent() {
  window.print();
  summaryReportShowToast("เตรียมรายงานสำหรับพิมพ์แล้ว");
}

function summaryReportPrintClosePreview() {
  const overlay = document.getElementById("summary-report-print-overlay");
  if (overlay) overlay.style.display = "none";
}

function summaryReportExportCSV() {
  if (!summaryReportCurrentRows.length) {
    summaryReportShowToast("กรุณาสร้างตารางสรุปก่อน Export", "error");
    return;
  }
  const cols = summaryReportCurrentCols;
  let csv = "\uFEFF" + cols.map((col) => summaryReportCsvCell(col.label)).join(",") + "\n";
  summaryReportCurrentRows.forEach((row) => {
    csv += cols.map((col) => summaryReportCsvCell(col.type === "pct" ? summaryReportPctText(row[col.key]) : row[col.key])).join(",") + "\n";
  });
  if (summaryReportCurrentTotals && Object.keys(summaryReportCurrentTotals).length) {
    csv += cols.map((col, index) => {
      if (index === 0) return summaryReportCsvCell("รวมทั้งหมด");
      if (col.type === "pct") {
        const den = summaryReportCurrentTotals[col.pctDenKey] || 0;
        return summaryReportCsvCell(summaryReportPctText(den ? ((summaryReportCurrentTotals[col.pctNumKey] || 0) / den) * 100 : 0));
      }
      return summaryReportCsvCell(summaryReportCurrentTotals[col.key] ?? "");
    }).join(",") + "\n";
  }
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${summaryReportCurrentTitle || "summary-report"}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  summaryReportShowToast("Export CSV สำเร็จ");
}

function summaryReportCsvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function summaryReportCopyTable() {
  if (!summaryReportCurrentRows.length) {
    summaryReportShowToast("กรุณาสร้างตารางสรุปก่อนคัดลอก", "error");
    return;
  }
  const cols = summaryReportCurrentCols;
  let text = cols.map((col) => col.label).join("\t") + "\n";
  summaryReportCurrentRows.forEach((row) => {
    text += cols.map((col) => col.type === "pct" ? summaryReportPctText(row[col.key]) : (row[col.key] ?? "")).join("\t") + "\n";
  });
  navigator.clipboard?.writeText(text)
    .then(() => summaryReportShowToast("คัดลอกตารางสำเร็จ"))
    .catch(() => summaryReportShowToast("ไม่สามารถคัดลอกได้", "error"));
}

function summaryReportShowToast(message, type) {
  summaryReportEnsureOverlay();
  const toast = document.getElementById("summary-report-toast");
  toast.textContent = message;
  toast.className = "summary-report-toast summary-report-toast--show";
  if (type === "error") toast.classList.add("summary-report-toast--error");
  clearTimeout(toast.summaryReportTimer);
  toast.summaryReportTimer = setTimeout(() => {
    toast.classList.remove("summary-report-toast--show", "summary-report-toast--error");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  summaryReportMount();
  const main = document.getElementById("mainContent");
  if (main) {
    new MutationObserver(summaryReportMount).observe(main, { childList: true, subtree: true });
  }
});

window.summaryReportInit = summaryReportInit;
window.summaryReportGenerate = summaryReportGenerate;
window.summaryReportPrint = summaryReportPrint;
window.summaryReportPrintCurrent = summaryReportPrintCurrent;
window.summaryReportPrintClosePreview = summaryReportPrintClosePreview;
window.summaryReportPrintFormatThaiDate = summaryReportPrintFormatThaiDate;
window.summaryReportPrintRenderHeader = summaryReportPrintRenderHeader;
window.summaryReportPrintRenderTable = summaryReportPrintRenderTable;
window.summaryReportPrintRenderSignature = summaryReportPrintRenderSignature;
window.summaryReportExportCSV = summaryReportExportCSV;
window.summaryReportCopyTable = summaryReportCopyTable;
