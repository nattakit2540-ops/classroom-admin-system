const firebaseConfig = window.firebaseConfig;
const isFirebaseConfigured = window.isFirebaseConfigured;

let initializeApp;
let getAuth;
let signInAnonymously;
let signInWithEmailAndPassword;
let onAuthStateChanged;
let signOut;
let getFirestore;
let collection;
let doc;
let getDocs;
let addDoc;
let setDoc;
let deleteDoc;
let query;
let where;
let serverTimestamp;

const adminEmails = ["stampnattaki17@gmail.com"];

const classLevels = ["ป.4", "ป.5", "ป.6"];
const uiDefaultSchoolName = "โรงเรียนชุมชนบ้านหนองผึ้ง";
const localStorageKey = "sakura-sensei-classroom-v1";
const localStateCollections = [
  "students",
  "attendance",
  "milkRecords",
  "toothbrushRecords",
  "healthRecords",
  "behaviorRecords",
  "schedules"
];
const todayISO = () => new Date().toISOString().slice(0, 10);
const schedulePeriods = [
  { period: 1, time: "09.00-10.00", label: "คาบที่ 1" },
  { period: 2, time: "10.00-11.00", label: "คาบที่ 2" },
  { period: 3, time: "11.00-12.00", label: "คาบที่ 3" },
  { period: 4, time: "12.00-13.00", label: "คาบที่ 4", note: "พักรับประทานอาหารกลางวัน" },
  { period: 5, time: "13.00-14.00", label: "คาบที่ 5" },
  { period: 6, time: "14.00-15.00", label: "คาบที่ 6" },
  { period: 7, time: "15.00-16.00", label: "คาบที่ 7" }
];

const menuItems = [
  { id: "dashboard", icon: "🌸", title: "Dashboard", subtitle: "วันนี้เด็ก ๆ มาเรียนกี่คนนะ? 🏫" },
  { id: "daily", icon: "🏫", title: "เช็กชื่อรายวัน", subtitle: "บันทึกการมาเรียนประจำวัน" },
  { id: "classwork", icon: "🗂️", title: "งานประจำชั้น", subtitle: "ภาพรวมวันนี้และงานที่ต้องติดตาม" },
  { id: "milk", icon: "🥛", title: "ดื่มนม", subtitle: "บันทึกดื่มนมเรียบร้อยแล้ว 🥛" },
  { id: "toothbrush", icon: "🪥", title: "แปรงฟัน", subtitle: "สุขนิสัยดีเริ่มทุกวัน" },
  { id: "health", icon: "💪", title: "สุขภาพ / BMI", subtitle: "สุขภาพดี เริ่มต้นที่การดูแลทุกวัน 💜" },
  { id: "behavior", icon: "🌟", title: "พฤติกรรม", subtitle: "เพิ่มความดีให้นักเรียน 🌟" },
  { id: "schedule", icon: "🗓️", title: "ตารางเรียน", subtitle: "จัดตารางสอนรายชั้น" },
  { id: "reports", icon: "📊", title: "รายงาน", subtitle: "สรุปข้อมูลเพื่อพิมพ์หรือส่งออก" },
  { id: "students", icon: "👧", title: "นักเรียน", subtitle: "จัดการข้อมูลนักเรียน" },
  { id: "settings", icon: "⚙️", title: "ตั้งค่า", subtitle: "ข้อมูลโรงเรียนและระบบ" }
];

const state = {
  firebaseReady: false,
  app: null,
  auth: null,
  db: null,
  user: null,
  role: "teacher",
  activePage: "dashboard",
  classLevel: "all",
  students: [],
  attendance: [],
  milkRecords: [],
  toothbrushRecords: [],
  healthRecords: [],
  behaviorRecords: [],
  schedules: [],
  editingStudentId: null,
  settings: {
    schoolName: uiDefaultSchoolName,
    academicYear: "2569",
    semester: "1",
    teacherName: "ครูประจำชั้น",
    theme: "purple",
    darkMode: false
  }
};

const demoStudents = [
  { id: "s1", studentNo: 1, studentCode: "P401", prefix: "ด.ช.", firstName: "ภาคิน", lastName: "ใจดี", nickname: "คิน", gender: "ชาย", classLevel: "ป.4", birthDate: "2016-02-10", weight: 32, height: 138, parentPhone: "0800000001", address: "ในเขตบริการ", status: "กำลังศึกษา" },
  { id: "s2", studentNo: 2, studentCode: "P402", prefix: "ด.ญ.", firstName: "ณิชา", lastName: "สดใส", nickname: "นิ", gender: "หญิง", classLevel: "ป.4", birthDate: "2016-08-21", weight: 29, height: 134, parentPhone: "0800000002", address: "ในเขตบริการ", status: "กำลังศึกษา" },
  { id: "s3", studentNo: 1, studentCode: "P501", prefix: "ด.ช.", firstName: "ธันวา", lastName: "ตั้งใจ", nickname: "วา", gender: "ชาย", classLevel: "ป.5", birthDate: "2015-05-04", weight: 37, height: 145, parentPhone: "0800000003", address: "ในเขตบริการ", status: "กำลังศึกษา" },
  { id: "s4", studentNo: 2, studentCode: "P502", prefix: "ด.ญ.", firstName: "ปุณยา", lastName: "แบ่งปัน", nickname: "ปัน", gender: "หญิง", classLevel: "ป.5", birthDate: "2015-11-12", weight: 35, height: 143, parentPhone: "0800000004", address: "ในเขตบริการ", status: "กำลังศึกษา" },
  { id: "s5", studentNo: 1, studentCode: "P601", prefix: "ด.ช.", firstName: "กฤต", lastName: "ขยัน", nickname: "กฤต", gender: "ชาย", classLevel: "ป.6", birthDate: "2014-03-17", weight: 43, height: 151, parentPhone: "0800000005", address: "ในเขตบริการ", status: "กำลังศึกษา" },
  { id: "s6", studentNo: 2, studentCode: "P602", prefix: "ด.ญ.", firstName: "มนัสวี", lastName: "เมตตา", nickname: "มีน", gender: "หญิง", classLevel: "ป.6", birthDate: "2014-09-30", weight: 41, height: 149, parentPhone: "0800000006", address: "ในเขตบริการ", status: "กำลังศึกษา" }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function loadLocalState() {
  try {
    const raw = localStorage.getItem(localStorageKey);
    if (!raw) {
      state.students = demoStudents.map((student) => ({ ...student }));
      return;
    }

    const saved = JSON.parse(raw);
    localStateCollections.forEach((name) => {
      if (Array.isArray(saved[name])) state[name] = saved[name];
    });
    state.settings = { ...state.settings, ...(saved.settings || {}) };
    if (state.settings.schoolName === "โรงเรียนของเรา") state.settings.schoolName = uiDefaultSchoolName;
    if (!state.students.length) state.students = demoStudents.map((student) => ({ ...student }));
  } catch (error) {
    console.warn("Local demo data could not be loaded", error);
    state.students = demoStudents.map((student) => ({ ...student }));
  }
}

function persistLocalState() {
  if (state.firebaseReady) return;
  try {
    const snapshot = localStateCollections.reduce((data, name) => {
      data[name] = state[name];
      return data;
    }, { settings: state.settings });
    localStorage.setItem(localStorageKey, JSON.stringify(snapshot));
  } catch (error) {
    console.warn("Local demo data could not be saved", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  bindGlobalEvents();
  offlineInit();
  renderMenu();
  setThaiDate();
  applyStoredTheme();
  renderSakuraLayer();
  await initFirebase();
});

function offlineInit() {
  offlineRenderWarning();
  window.addEventListener("online", offlineRenderWarning);
  window.addEventListener("offline", offlineRenderWarning);
}

function offlineRenderWarning() {
  let banner = $("#offlineWarning");
  if (navigator.onLine) {
    banner?.remove();
    return;
  }
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "offlineWarning";
    banner.className = "offline-warning";
    banner.innerHTML = `
      <span>📡 ตอนนี้ออฟไลน์ ข้อมูลบางส่วนอาจบันทึกในเครื่องก่อน</span>
      <button type="button" data-offline-retry>ลองใหม่</button>
    `;
    document.body.prepend(banner);
    banner.querySelector("[data-offline-retry]").addEventListener("click", () => window.location.reload());
  }
}

function offlineShowFriendlyError(title, error) {
  const old = $(".offline-error-state");
  old?.remove();
  const box = document.createElement("div");
  box.className = "offline-error-state";
  box.innerHTML = `
    <strong>🌸 ${title}</strong>
    <span>${navigator.onLine ? "ระบบเชื่อมต่อข้อมูลไม่ได้ชั่วคราว" : "ตอนนี้ออฟไลน์อยู่"}</span>
    <button type="button" data-offline-retry>ลองใหม่</button>
  `;
  $("#mainContent")?.prepend(box);
  box.querySelector("[data-offline-retry]").addEventListener("click", () => window.location.reload());
  console.warn(title, error);
}

function bindGlobalEvents() {
  $("#anonymousLoginBtn").addEventListener("click", loginAnonymous);
  $("#adminLoginForm").addEventListener("submit", loginAdmin);
  $("#logoutBtn").addEventListener("click", logout);
  $("#darkModeBtn").addEventListener("click", toggleDarkMode);
  uiInitGlobalClassSegment();
  $("#globalClassSelect").addEventListener("change", (event) => {
    state.classLevel = event.target.value;
    uiSyncGlobalClassSegment();
    renderActivePage();
  });
  $("#menuToggle").addEventListener("click", () => $(".sidebar").classList.toggle("open"));
  $("#mainContent").addEventListener("input", uiSaveDraft);
  $("#mainContent").addEventListener("change", uiSaveDraft);
}

function uiInitGlobalClassSegment() {
  const select = $("#globalClassSelect");
  if (!select || $(".dashboard-class-segment")) return;
  const segment = document.createElement("div");
  segment.className = "dashboard-class-segment";
  segment.setAttribute("aria-label", "เลือกชั้นเรียน");
  segment.innerHTML = [
    ["all", "ทุกชั้น"],
    ["ป.4", "ป.4"],
    ["ป.5", "ป.5"],
    ["ป.6", "ป.6"]
  ].map(([value, label]) => `<button type="button" class="dashboard-class-segment-btn" data-ui-class="${value}">${label}</button>`).join("");
  select.insertAdjacentElement("afterend", segment);
  select.classList.add("dashboard-native-class-select");
  segment.querySelectorAll("[data-ui-class]").forEach((button) => {
    button.addEventListener("click", () => {
      state.classLevel = button.dataset.uiClass;
      select.value = state.classLevel;
      uiSyncGlobalClassSegment();
      renderActivePage();
    });
  });
  uiSyncGlobalClassSegment();
}

function uiSyncGlobalClassSegment() {
  $$("[data-ui-class]").forEach((button) => {
    button.classList.toggle("active", button.dataset.uiClass === state.classLevel);
  });
}

function uiDraftKey() {
  return `nongpeung-draft-${state.activePage}-${state.classLevel}`;
}

function uiSaveDraft(event) {
  const field = event.target;
  if (!field || !["INPUT", "TEXTAREA", "SELECT"].includes(field.tagName) || !field.id) return;
  const fields = {};
  $$("#mainContent input[id], #mainContent textarea[id], #mainContent select[id]").forEach((input) => {
    if (input.type === "file") return;
    fields[input.id] = input.type === "checkbox" ? input.checked : input.value;
  });
  if (!Object.keys(fields).length) return;
  localStorage.setItem(uiDraftKey(), JSON.stringify({ fields, savedAt: new Date().toISOString() }));
}

function uiOfferDraftRestore() {
  if (state.activePage === "dashboard") return;
  const raw = localStorage.getItem(uiDraftKey());
  if (!raw || !$("#mainContent input[id], #mainContent textarea[id], #mainContent select[id]")) return;
  const notice = document.createElement("div");
  notice.className = "dashboard-draft-restore";
  notice.innerHTML = `
    <span>🌸 พบข้อมูลแบบร่างที่กรอกค้างไว้</span>
    <div>
      <button type="button" data-ui-restore-draft>กู้คืน</button>
      <button type="button" data-ui-discard-draft>ไม่ใช้</button>
    </div>
  `;
  $("#mainContent").prepend(notice);
  notice.querySelector("[data-ui-restore-draft]").addEventListener("click", () => uiRestoreDraft(notice));
  notice.querySelector("[data-ui-discard-draft]").addEventListener("click", () => {
    uiClearDraft();
    notice.remove();
  });
}

function uiRestoreDraft(notice) {
  try {
    const draft = JSON.parse(localStorage.getItem(uiDraftKey()) || "{}");
    Object.entries(draft.fields || {}).forEach(([id, value]) => {
      const input = document.getElementById(id);
      if (!input) return;
      if (input.type === "checkbox") input.checked = Boolean(value);
      else input.value = value;
    });
    showToast("กู้คืนแบบร่างเรียบร้อยแล้ว Sensei! 🌸");
  } catch (error) {
    console.warn("Draft restore failed", error);
  }
  notice?.remove();
}

function uiClearDraft() {
  localStorage.removeItem(uiDraftKey());
}

async function initFirebase() {
  if (!isFirebaseConfigured()) {
    loadLocalState();
    state.firebaseReady = false;
    showToast("เปิดโหมดทดลอง ใส่ firebaseConfig เพื่อใช้ฐานข้อมูลจริง ✅");
    showApp();
    return;
  }

  try {
    await loadFirebaseModules();
    state.app = initializeApp(firebaseConfig);
    state.auth = getAuth(state.app);
    state.db = getFirestore(state.app);
    state.firebaseReady = true;

    onAuthStateChanged(state.auth, async (user) => {
      state.user = user;
      if (user) {
        state.role = isConfiguredAdminEmail(user.email) ? "admin" : "teacher";
        await loadAllData();
        showApp();
      } else {
        state.role = "teacher";
        showLogin();
      }
    });
  } catch (error) {
    console.error(error);
    loadLocalState();
    state.firebaseReady = false;
    showToast("เชื่อม Firebase ไม่สำเร็จ ใช้โหมดทดลองชั่วคราว");
    showApp();
  }
}

async function loadFirebaseModules() {
  const [appModule, authModule, firestoreModule] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js")
  ]);

  initializeApp = appModule.initializeApp;
  getAuth = authModule.getAuth;
  signInAnonymously = authModule.signInAnonymously;
  signInWithEmailAndPassword = authModule.signInWithEmailAndPassword;
  onAuthStateChanged = authModule.onAuthStateChanged;
  signOut = authModule.signOut;
  getFirestore = firestoreModule.getFirestore;
  collection = firestoreModule.collection;
  doc = firestoreModule.doc;
  getDocs = firestoreModule.getDocs;
  addDoc = firestoreModule.addDoc;
  setDoc = firestoreModule.setDoc;
  deleteDoc = firestoreModule.deleteDoc;
  query = firestoreModule.query;
  where = firestoreModule.where;
  serverTimestamp = firestoreModule.serverTimestamp;
}

async function loginAnonymous() {
  state.role = "teacher";
  if (state.firebaseReady) {
    try {
      showLoading(true);
      await signInAnonymously(state.auth);
      showToast("เข้าสู่ระบบครูทั่วไปแล้ว ✅");
      return;
    } catch (error) {
      if (error.code === "auth/configuration-not-found" || error.code === "auth/admin-restricted-operation") {
        state.firebaseReady = false;
        loadLocalState();
        state.user = { uid: "local-teacher", isAnonymous: true };
        showApp();
        showToast("Firebase Anonymous ยังไม่ได้เปิด ใช้โหมดทดลองชั่วคราว ✅");
        return;
      }
      handleError(error, "เข้าสู่ระบบครูทั่วไปไม่สำเร็จ");
      return;
    } finally {
      showLoading(false);
    }
  }

  state.user = { uid: "local-teacher", isAnonymous: true };
  showApp();
  showToast("เข้าสู่ระบบครูทั่วไปแล้ว ✅");
}

async function loginAdmin(event) {
  event.preventDefault();
  const username = $("#adminEmail").value.trim();
  const password = $("#adminPassword").value.trim();
  if (!username || !password) {
    showToast("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
    return;
  }
  if (!state.firebaseReady) {
    showToast("Firebase ยังไม่พร้อมใช้งาน Admin กรุณาตรวจการเชื่อมต่อ Firebase");
    return;
  }
  if (!username.includes("@")) {
    showToast("Admin ต้องเข้าสู่ระบบด้วยอีเมล Firebase เท่านั้น");
    return;
  }
  try {
    showLoading(true);
    const credential = await signInWithEmailAndPassword(state.auth, username, password);
    if (!isConfiguredAdminEmail(credential.user.email)) {
      await signOut(state.auth);
      showToast("บัญชีนี้ยังไม่ได้รับสิทธิ์ Admin");
      return;
    }
    state.role = "admin";
    showToast("เข้าสู่ระบบ Admin สำเร็จ ✅");
  } catch (error) {
    if (error.code === "auth/configuration-not-found") {
      showToast("Firebase Auth ยังไม่ได้เปิดใช้งาน กรุณาเปิด Email/Password ใน Firebase Console");
    } else if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
      showToast("อีเมลหรือรหัสผ่าน Admin ไม่ถูกต้อง กรุณาตรวจผู้ใช้ใน Firebase Auth");
    } else {
      handleError(error, "เข้าสู่ระบบ Admin ไม่สำเร็จ");
    }
  } finally {
    showLoading(false);
  }
}

function isConfiguredAdminEmail(email) {
  return adminEmails.includes(String(email || "").trim().toLowerCase());
}

async function logout() {
  if (state.firebaseReady && state.auth.currentUser) {
    await signOut(state.auth);
  }
  state.user = null;
  showLogin();
  showToast("ออกจากระบบแล้ว");
}

async function loadAllData() {
  showLoading(true);
  try {
    await Promise.all([
      loadStudents("all"),
      loadCollection("attendance"),
      loadCollection("milkRecords"),
      loadCollection("toothbrushRecords"),
      loadCollection("healthRecords"),
      loadCollection("behaviorRecords"),
      loadCollection("schedules")
    ]);
  } finally {
    showLoading(false);
  }
}

async function loadCollection(name) {
  if (!state.firebaseReady) return;
  try {
    const snap = await getDocs(collection(state.db, name));
    state[name] = snap.docs.map((item) => ({ id: item.id, ...item.data() }));
  } catch (error) {
    handleError(error, `โหลดข้อมูล ${name} ไม่สำเร็จ`);
  }
}

async function loadStudents(classLevel = state.classLevel) {
  if (!state.firebaseReady) {
    if (!state.students.length) loadLocalState();
    return filterByClass(state.students, classLevel);
  }
  try {
    const ref = collection(state.db, "students");
    const snap = classLevel && classLevel !== "all"
      ? await getDocs(query(ref, where("classLevel", "==", classLevel)))
      : await getDocs(ref);
    state.students = snap.docs.map((item) => ({ id: item.id, ...item.data() }));
    return state.students;
  } catch (error) {
    handleError(error, "โหลดข้อมูลนักเรียนไม่สำเร็จ");
    return [];
  }
}

function renderMenu() {
  $("#menuList").innerHTML = menuItems.map((item) => `
    <button class="menu-btn ${item.id === state.activePage ? "active" : ""}" data-page="${item.id}">
      <span>${item.icon}</span><span>${item.title}</span>
    </button>
  `).join("");

  $$(".menu-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.activePage = button.dataset.page;
      $(".sidebar").classList.remove("open");
      renderMenu();
      renderActivePage();
    });
  });
}

function renderActivePage() {
  if (state.activePage === "subject") state.activePage = "daily";
  const item = menuItems.find((menu) => menu.id === state.activePage) || menuItems[0];
  $("#pageTitle").textContent = item.title;
  $("#mainContent").style.animation = "none";
  $("#mainContent").offsetHeight;
  $("#mainContent").style.animation = "";

  const renderers = {
    dashboard: loadDashboard,
    daily: () => renderAttendancePage("daily"),
    classwork: renderClasswork,
    milk: renderMilk,
    toothbrush: renderToothbrush,
    health: renderHealth,
    behavior: renderBehavior,
    schedule: renderSchedule,
    reports: renderReports,
    students: renderStudents,
    settings: renderSettings
  };
  (renderers[state.activePage] || renderers.dashboard)();
  uiOfferDraftRestore();
}

function showApp() {
  $("#loginView").classList.add("hidden");
  $("#appView").classList.remove("hidden");
  $("#schoolNameSide").textContent = state.settings.schoolName;
  renderActivePage();
}

function showLogin() {
  $("#appView").classList.add("hidden");
  $("#loginView").classList.remove("hidden");
}

function sectionHeader(title, subtitle, action = "") {
  return `
    <div class="section-head">
      <div>
        <h3>${title}</h3>
        <p>${subtitle}</p>
      </div>
      ${action}
    </div>
  `;
}

function commonToolbar(extra = "") {
  return `
    <div class="toolbar">
      <input type="date" id="workDate" value="${todayISO()}">
      <select id="pageClassSelect">
        ${classLevels.map((level) => `<option value="${level}" ${level === selectedClass() ? "selected" : ""}>${level}</option>`).join("")}
      </select>
      <input type="search" id="studentSearch" placeholder="ค้นหานักเรียน">
      ${extra}
    </div>
  `;
}

function selectedClass() {
  return state.classLevel === "all" ? "ป.4" : state.classLevel;
}

function loadDashboard() {
  const students = filterByClass(state.students, state.classLevel);
  const todayAttendance = recordsForToday(state.attendance).flatMap((item) => item.records || []);
  const milkToday = recordsForToday(state.milkRecords).flatMap((item) => item.records || []);
  const brushToday = recordsForToday(state.toothbrushRecords).flatMap((item) => item.records || []);
  const todayBehavior = recordsForToday(state.behaviorRecords);
  const goodToday = todayBehavior.filter((item) => item.behaviorType === "good");
  const disciplineToday = todayBehavior.filter((item) => item.behaviorType === "discipline");
  const present = countStatus(todayAttendance, ["มาเรียน", "อยู่", "เข้าเรียน"]);
  const absent = countStatus(todayAttendance, ["ขาด", "ขาดเรียน"]);
  const leave = countStatus(todayAttendance, ["ลา"]);
  const late = countStatus(todayAttendance, ["มาสาย"]);
  const milkDone = countStatus(milkToday, ["ดื่ม"]);
  const brushDone = countStatus(brushToday, ["แปรงฟัน"]);
  const bmiSummary = getHealthSummary(students);
  const total = students.length;
  const presentPercent = percent(present, total);
  const milkPercent = percent(milkDone, total);
  const brushPercent = percent(brushDone, total);
  const currentClass = state.classLevel === "all" ? "รวมทุกชั้น" : state.classLevel;
  const context = getDashboardContext({ absent, total, milkDone, brushDone });
  const scheduleToday = getTodaySchedule();
  const topGoodStudent = getTopBehaviorStudent(goodToday, true);
  const watchStudent = getTopBehaviorStudent(disciplineToday, false);
  const recent = getRecentActivities();
  const dashboardTasks = dashboardBuildTasks({ todayAttendance, milkToday, brushToday, todayBehavior });
  const dashboardAlerts = dashboardBuildAlerts({ students, todayAttendance, milkToday, brushToday, absent, late, total, bmiSummary });
  const dashboardFollowUps = dashboardBuildFollowUps(students);

  $("#mainContent").innerHTML = `
    <section class="dashboard-page">
      <div class="dashboard-nav card">
        <div class="dashboard-logo">
          <span>🌸</span>
          <div>
            <strong>Nongpeung 4 - 6 Classroom</strong>
            <small>ระบบจัดการชั้นเรียน ป.4 - ป.6</small>
          </div>
        </div>
        <div class="dashboard-controls">
          <div class="class-pill-row">
            ${["all", ...classLevels].map((level) => `<button class="class-pill ${state.classLevel === level ? "active" : ""}" data-dashboard-class="${level}">${level === "all" ? "รวมทั้งหมด" : level}</button>`).join("")}
          </div>
          <input id="dashboardDate" type="date" value="${todayISO()}">
          <input id="dashboardSearch" type="search" placeholder="ค้นหานักเรียน">
          <button class="teacher-avatar" type="button" title="${state.settings.teacherName}">👩‍🏫</button>
        </div>
      </div>

      <div class="dashboard-bento">
        <article class="bento-card hero-bento span-8">
          <img src="assets/hero-classroom.png" alt="Nongpeung classroom">
          <div class="hero-bento-copy">
            <span class="soft-label">Modern Japan Classroom UI</span>
            <h3>おはよう Sensei 🌸</h3>
            <p>วันนี้พร้อมดูแลเด็ก ๆ แล้วหรือยัง?</p>
            <div class="hero-meta">
              <span>${new Intl.DateTimeFormat("th-TH", { dateStyle: "full" }).format(new Date())}</span>
              <span>${currentClass}</span>
              <span>มาเรียน ${present}/${total} คน</span>
            </div>
          </div>
        </article>

        <article class="bento-card context-card span-4 ${context.urgent ? "urgent" : ""}">
          <span class="soft-label">งานถัดไปของคุณครู</span>
          <h3>${context.title}</h3>
          <p>${context.message}</p>
          <button class="primary-btn" data-dashboard-link="${context.page}">${context.button}</button>
        </article>

        ${dashboardRenderQuickActions()}
        ${dashboardRenderTasks(dashboardTasks)}
        ${dashboardRenderAlerts(dashboardAlerts)}
        ${dashboardRenderFollowUps(dashboardFollowUps)}
        ${dashboardRenderStudentProfiles(students)}
        ${dashboardRenderPrintTools()}

        ${dashboardMetricCard("👧", "นักเรียนทั้งหมด", total, "คน", "พร้อมดูแลวันนี้", "soft")}
        ${dashboardMetricCard("✅", "มาเรียนวันนี้", present, "คน", `${presentPercent}% ของห้อง`, "success")}
        ${dashboardMetricCard("❌", "ขาดเรียน", absent, "คน", absent ? "ควรตรวจสอบ" : "ไม่มีนักเรียนขาด", "danger")}
        ${dashboardMetricCard("🟡", "มาสาย", late, "คน", late ? "ติดตามเวลาเข้าเรียน" : "ตรงเวลาดีมาก", "warning")}
        ${dashboardMetricCard("🥛", "ดื่มนมแล้ว", milkDone, "คน", `${milkPercent}% สำเร็จ`, "sky")}
        ${dashboardMetricCard("🪥", "แปรงฟันแล้ว", brushDone, "คน", `${brushPercent}% สำเร็จ`, "mint")}
        ${dashboardMetricCard("💪", "BMI ปกติ", bmiSummary.normal, "คน", "สุขภาพอยู่ในเกณฑ์", "success")}
        ${dashboardMetricCard("🌟", "ความดีวันนี้", goodToday.length, "รายการ", "ชื่นชมเด็ก ๆ", "pink")}
        ${dashboardMetricCard("⚠️", "ผิดระเบียบวันนี้", disciplineToday.length, "รายการ", disciplineToday.length ? "ควรติดตาม" : "เรียบร้อยดี", "warning")}

        <article class="bento-card span-4">
          <div class="card-head"><h3>Attendance Overview</h3><button class="ghost-btn" data-dashboard-link="daily">ดูรายละเอียด</button></div>
          <p>วันนี้มาเรียน ${present}/${total} คน</p>
          ${progressBar("มาเรียน", presentPercent, "success")}
          ${progressBar("ขาด", percent(absent, total), "danger")}
          ${progressBar("ลา", percent(leave, total), "info")}
          ${progressBar("มาสาย", percent(late, total), "warning")}
        </article>

        <article class="bento-card span-4">
          <div class="card-head"><h3>Daily Tasks</h3><span class="badge warning">วันนี้</span></div>
          ${taskRow("เช็กชื่อรายวัน", todayAttendance.length > 0, true)}
          ${taskRow("บันทึกดื่มนม", milkToday.length > 0, milkToday.length === 0)}
          ${taskRow("บันทึกแปรงฟัน", brushToday.length > 0, false)}
          ${taskRow("บันทึกพฤติกรรม", todayBehavior.length > 0, false)}
          ${taskRow("ตรวจข้อมูลสุขภาพ", state.healthRecords.length > 0, false)}
        </article>

        <article class="bento-card span-4">
          <div class="card-head"><h3>Health / BMI Snapshot</h3><button class="ghost-btn" data-dashboard-link="health">เปิดข้อมูลสุขภาพ</button></div>
          ${miniBar("ปกติ", bmiSummary.normal, total, "success")}
          ${miniBar("ผอม", bmiSummary.thin, total, "info")}
          ${miniBar("เริ่มอ้วน", bmiSummary.overweight, total, "warning")}
          ${miniBar("อ้วน", bmiSummary.obese, total, "danger")}
          <p class="muted-line">นักเรียนที่ควรติดตาม ${bmiSummary.thin + bmiSummary.overweight + bmiSummary.obese} คน</p>
        </article>

        <article class="bento-card span-4">
          <div class="card-head"><h3>Behavior Snapshot</h3><button class="ghost-btn" data-dashboard-link="behavior">เปิดพฤติกรรม</button></div>
          <div class="split-stat"><span>🌟 ความดีวันนี้</span><strong>${goodToday.length}</strong></div>
          <div class="split-stat"><span>⚠️ ผิดระเบียบวันนี้</span><strong>${disciplineToday.length}</strong></div>
          <p>🎖️ ดีเด่น: ${topGoodStudent}</p>
          <p>💜 ควรดูแล: ${watchStudent}</p>
        </article>

        <article class="bento-card span-4">
          <div class="card-head"><h3>Milk & Toothbrush</h3><button class="ghost-btn" data-dashboard-link="milk">บันทึก</button></div>
          <div class="dual-progress">
            ${ringProgress("🥛", "ดื่มนมแล้ว", milkPercent, "เด็ก ๆ ดื่มนมแล้ว ${milkDone} จาก ${total} คน")}
            ${ringProgress("🪥", "แปรงฟันแล้ว", brushPercent, "ห้องนี้ยิ้มสดใส ${brushPercent}%")}
          </div>
        </article>

        <article class="bento-card span-4">
          <div class="card-head"><h3>Upcoming Schedule</h3><button class="ghost-btn" data-dashboard-link="schedule">ตารางเรียน</button></div>
          <div class="schedule-timeline">
            ${scheduleToday.length ? scheduleToday.map((item) => scheduleTimelineItem(item)).join("") : `<p class="empty-mini">ยังไม่มีตารางเรียนวันนี้</p>`}
          </div>
        </article>

        <article class="bento-card span-4">
          <div class="card-head"><h3>Birthday / Highlight</h3><button class="ghost-btn" data-dashboard-link="students">นักเรียน</button></div>
          <p>🎂 วันเกิดเดือนนี้: ${birthdaysThisMonth().length} คน</p>
          <p>🌟 นักเรียนดีเด่น: ${topGoodStudent}</p>
          <p>💜 นักเรียนที่ควรดูแล: ${watchStudent}</p>
          <div class="highlight-list">
            ${birthdaysThisMonth().slice(0, 3).map((s) => `<span>${fullName(s)}</span>`).join("") || `<span>ยังไม่มีวันเกิดเดือนนี้</span>`}
          </div>
        </article>

        <article class="bento-card span-4">
          <div class="card-head"><h3>Recent Activity</h3><button class="ghost-btn" data-dashboard-link="reports">รายงาน</button></div>
          <div class="activity-list">
            ${recent.map((item) => `<p><span></span>${item}</p>`).join("")}
          </div>
        </article>
      </div>
      ${dashboardRenderProfileModal()}
    </section>
  `;

  bindDashboardActions();
}
function statCard(icon, label, value) {
  return `<div class="card stat-card"><span class="icon">${icon}</span><span>${label}</span><strong>${value}</strong></div>`;
}

function dashboardMetricCard(icon, label, value, unit, hint, tone) {
  return `
    <article class="bento-card metric-card tone-${tone}">
      <span class="metric-icon">${icon}</span>
      <div>
        <p>${label}</p>
        <strong>${value}<small>${unit}</small></strong>
        <span>${hint}</span>
      </div>
    </article>
  `;
}

function dashboardBuildTasks({ milkToday, brushToday, todayBehavior }) {
  const dailyDone = state.attendance.some((item) => item.date === todayISO() && item.type === "daily");
  return [
    { label: "เช็กชื่อโฮมรูม", done: dailyDone, urgent: !dailyDone, page: "daily" },
    { label: "บันทึกดื่มนม", done: milkToday.length > 0, urgent: milkToday.length === 0, page: "milk" },
    { label: "บันทึกแปรงฟัน", done: brushToday.length > 0, urgent: brushToday.length === 0, page: "toothbrush" },
    { label: "บันทึกพฤติกรรม", done: todayBehavior.length > 0, urgent: false, page: "behavior" }
  ];
}

function dashboardRenderTasks(tasks) {
  return `
    <article class="dashboard-card dashboard-task-card dashboard-span-4">
      <div class="dashboard-card-head">
        <div>
          <span>Today Task Checklist</span>
          <h3>งานประจำวันที่ Sensei ต้องทำ</h3>
        </div>
        <strong>${tasks.filter((task) => task.done).length}/${tasks.length}</strong>
      </div>
      <div class="dashboard-task-list">
        ${tasks.map((task) => `
          <button type="button" class="dashboard-task-item ${task.done ? "dashboard-task-done" : ""} ${task.urgent && !task.done ? "dashboard-task-urgent" : ""}" data-dashboard-link="${task.page}">
            <span>${task.done ? "✓" : task.urgent ? "!" : "•"}</span>
            <strong>${task.label}</strong>
            <em>${task.done ? "เสร็จแล้ว" : task.urgent ? "ด่วน" : "ยังไม่เสร็จ"}</em>
          </button>
        `).join("")}
      </div>
    </article>
  `;
}

function dashboardBuildAlerts({ students, milkToday, brushToday, absent, late, total, bmiSummary }) {
  const alerts = [];
  const repeatedLate = dashboardRepeatedLateStudents(students);
  const bmiWatch = bmiSummary.thin + bmiSummary.overweight + bmiSummary.obese;

  if (total && absent > Math.max(1, Math.ceil(total * 0.2))) {
    alerts.push({ tone: "danger", icon: "⚠️", title: "นักเรียนขาดมากกว่าปกติ", message: `วันนี้ขาด ${absent} จาก ${total} คน ควรตรวจสอบผู้ปกครอง`, page: "reports" });
  }
  if (late > 0 || repeatedLate.length) {
    alerts.push({ tone: "warning", icon: "🟡", title: "นักเรียนมาสายซ้ำ", message: repeatedLate.length ? `${repeatedLate.slice(0, 2).map(fullName).join(", ")} ควรติดตามเวลาเข้าเรียน` : `วันนี้มีมาสาย ${late} คน`, page: "daily" });
  }
  if (total && milkToday.length === 0) {
    alerts.push({ tone: "sky", icon: "🥛", title: "ยังไม่ได้บันทึกดื่มนม", message: "เปิดเมนูดื่มนมเพื่อบันทึกสุขนิสัยประจำวัน", page: "milk" });
  }
  if (total && brushToday.length === 0) {
    alerts.push({ tone: "mint", icon: "🪥", title: "ยังไม่ได้บันทึกแปรงฟัน", message: "บันทึกหลังอาหารกลางวันเพื่อสรุปงานประจำชั้น", page: "toothbrush" });
  }
  if (bmiWatch > 0) {
    alerts.push({ tone: "pink", icon: "💪", title: "มีนักเรียน BMI ที่ควรติดตาม", message: `${bmiWatch} คนอยู่ในกลุ่มที่ควรดูแลต่อเนื่อง`, page: "health" });
  }

  return alerts.length ? alerts : [
    { tone: "success", icon: "🌸", title: "วันนี้ภาพรวมเรียบร้อยดี", message: "Dashboard ยังไม่พบสัญญาณเร่งด่วน", page: "reports" }
  ];
}

function dashboardRenderAlerts(alerts) {
  return `
    <article class="dashboard-card dashboard-alert-card dashboard-span-4">
      <div class="dashboard-card-head">
        <div>
          <span>Smart Alert</span>
          <h3>แจ้งเตือนตามบริบทห้องเรียน</h3>
        </div>
      </div>
      <div class="dashboard-alert-list">
        ${alerts.slice(0, 4).map((alert) => `
          <button type="button" class="dashboard-alert-item dashboard-alert-${alert.tone}" data-dashboard-link="${alert.page}">
            <span>${alert.icon}</span>
            <div>
              <strong>${alert.title}</strong>
              <p>${alert.message}</p>
            </div>
          </button>
        `).join("")}
      </div>
    </article>
  `;
}

function dashboardBuildFollowUps(students) {
  return students.map((student) => {
    const reasons = [];
    const absentCount = dashboardStudentStatusCount(state.attendance, student.id, ["ขาด", "ขาดเรียน"]);
    const lateCount = dashboardStudentStatusCount(state.attendance, student.id, ["มาสาย"]);
    const milkMiss = dashboardStudentStatusCount(state.milkRecords, student.id, ["ไม่ดื่ม", "ขาด", "ลา"]);
    const brushMiss = dashboardStudentStatusCount(state.toothbrushRecords, student.id, ["ไม่แปรง", "ลืมอุปกรณ์", "ขาด", "ลา"]);
    const discipline = state.behaviorRecords.filter((item) => item.studentId === student.id && item.behaviorType === "discipline").length;
    const bmi = calculateBMI(student.weight, student.height);
    const bmiCategory = getBMICategory(bmi);

    if (absentCount >= 2) reasons.push("ขาดเรียนต่อเนื่อง");
    if (lateCount >= 2) reasons.push("มาสายซ้ำ");
    if (milkMiss >= 2) reasons.push("ไม่ดื่มนมบ่อย");
    if (brushMiss >= 2) reasons.push("ไม่แปรงฟันต่อเนื่อง");
    if (["ผอม", "เริ่มอ้วน", "อ้วน"].includes(bmiCategory)) reasons.push(`BMI ${bmiCategory}`);
    if (discipline >= 2) reasons.push("ผิดระเบียบซ้ำ");

    return { student, reasons };
  }).filter((item) => item.reasons.length);
}

function dashboardRenderFollowUps(items) {
  return `
    <article class="dashboard-card dashboard-follow-card dashboard-span-4">
      <div class="dashboard-card-head">
        <div>
          <span>Smart Follow-up Students</span>
          <h3>นักเรียนที่ควรติดตาม</h3>
        </div>
        <strong>${items.length}</strong>
      </div>
      <div class="dashboard-follow-list">
        ${items.slice(0, 5).map(({ student, reasons }) => `
          <button type="button" class="dashboard-follow-item" data-dashboard-student="${student.id}">
            <span>${student.gender === "หญิง" ? "👧" : "👦"}</span>
            <div>
              <strong>${fullName(student)}</strong>
              <p>${reasons.slice(0, 3).join(" • ")}</p>
            </div>
          </button>
        `).join("") || `<p class="dashboard-empty">ยังไม่มีนักเรียนที่ต้องติดตามเป็นพิเศษวันนี้ 🌸</p>`}
      </div>
    </article>
  `;
}

function dashboardRenderQuickActions() {
  const actions = [
    ["เช็กชื่อวันนี้", "daily", "🏫"],
    ["บันทึกดื่มนม", "milk", "🥛"],
    ["บันทึกแปรงฟัน", "toothbrush", "🪥"],
    ["เพิ่มพฤติกรรม", "behavior", "🌟"],
    ["เพิ่มนักเรียน", "students", "👧"]
  ];
  return `
    <article class="dashboard-card dashboard-action-card dashboard-span-4">
      <div class="dashboard-card-head">
        <div>
          <span>Quick Action</span>
          <h3>ปุ่มลัดงานประจำวัน</h3>
        </div>
      </div>
      <div class="dashboard-action-grid">
        ${actions.map(([label, page, icon]) => `<button type="button" class="dashboard-action-button" data-dashboard-link="${page}"><span>${icon}</span>${label}</button>`).join("")}
      </div>
    </article>
  `;
}

function dashboardRenderPrintTools() {
  return `
    <article class="dashboard-card dashboard-print-card dashboard-span-4">
      <div class="dashboard-card-head">
        <div>
          <span>One-Click Print Report</span>
          <h3>พิมพ์รายงานจาก Dashboard</h3>
        </div>
      </div>
      <div class="dashboard-print-actions">
        <button type="button" class="dashboard-print-button" data-dashboard-print="today">รายงานวันนี้</button>
        <button type="button" class="dashboard-print-button" data-dashboard-print="month">รายงานรายเดือน</button>
        <button type="button" class="dashboard-print-button" data-dashboard-print="student">รายงานนักเรียนรายคน</button>
        <button type="button" class="dashboard-print-button" data-dashboard-export="today-csv">Export CSV วันนี้</button>
      </div>
    </article>
  `;
}

function dashboardRenderStudentProfiles(students) {
  const visibleStudents = students.slice(0, 8);
  return `
    <article class="dashboard-card dashboard-student-card dashboard-span-4">
      <div class="dashboard-card-head">
        <div>
          <span>Student Profile</span>
          <h3>คลิกชื่อนักเรียนเพื่อดูข้อมูลรวม</h3>
        </div>
      </div>
      <div class="dashboard-student-list">
        ${visibleStudents.map((student) => `
          <button type="button" class="dashboard-student-button" data-dashboard-student="${student.id}">
            <span>${student.gender === "หญิง" ? "👧" : "👦"}</span>
            <div>
              <strong>${fullName(student)}</strong>
              <small>เลขที่ ${student.studentNo || "-"} • ${student.classLevel || "-"}</small>
            </div>
          </button>
        `).join("") || `<p class="dashboard-empty">ยังไม่มีรายชื่อนักเรียน</p>`}
      </div>
    </article>
  `;
}

function dashboardRenderProfileModal() {
  return `
    <div id="dashboardProfileModal" class="dashboard-profile-modal hidden" role="dialog" aria-modal="true" aria-labelledby="dashboardProfileTitle">
      <div class="dashboard-profile-panel">
        <button type="button" class="dashboard-profile-close" aria-label="ปิดข้อมูลนักเรียน">×</button>
        <div id="dashboardProfileContent"></div>
      </div>
    </div>
  `;
}

function dashboardOpenStudentProfile(studentId) {
  const student = state.students.find((item) => item.id === studentId);
  if (!student) return;
  const summary = dashboardStudentSummary(student);
  $("#dashboardProfileContent").innerHTML = `
    <div class="dashboard-profile-head">
      <span>${student.gender === "หญิง" ? "👧" : "👦"}</span>
      <div>
        <p>${student.classLevel || "-"} • เลขที่ ${student.studentNo || "-"}</p>
        <h3 id="dashboardProfileTitle">${fullName(student)}</h3>
        <small>${student.studentCode || "ยังไม่มีรหัสนักเรียน"}</small>
      </div>
    </div>
    <div class="dashboard-profile-grid">
      ${dashboardProfileStat("การมาเรียน", summary.attendance)}
      ${dashboardProfileStat("ดื่มนม", summary.milk)}
      ${dashboardProfileStat("แปรงฟัน", summary.brush)}
      ${dashboardProfileStat("BMI ล่าสุด", summary.bmi)}
      ${dashboardProfileStat("อายุ", student.birthDate ? calculateAge(student.birthDate) : "-")}
      ${dashboardProfileStat("พฤติกรรมดี", `${summary.good} รายการ`)}
      ${dashboardProfileStat("ผิดระเบียบ", `${summary.discipline} รายการ`)}
      ${dashboardProfileStat("เบอร์ผู้ปกครอง", student.parentPhone || "-")}
    </div>
    <div class="dashboard-profile-note">
      <strong>ข้อมูลพื้นฐาน</strong>
      <p>ชื่อเล่น ${student.nickname || "-"} • สถานะ ${student.status || "-"} • ที่อยู่ ${student.address || "-"}</p>
    </div>
  `;
  $("#dashboardProfileModal").classList.remove("hidden");
}

function dashboardProfileStat(label, value) {
  return `<div class="dashboard-profile-stat"><span>${label}</span><strong>${value || "-"}</strong></div>`;
}

function dashboardCloseStudentProfile() {
  $("#dashboardProfileModal")?.classList.add("hidden");
}

function dashboardStudentSummary(student) {
  const attendanceRecords = state.attendance
    .flatMap((item) => (item.records || []).map((record) => ({ ...record, date: item.date, type: item.type })))
    .filter((record) => record.studentId === student.id);
  const todayAttend = attendanceRecords.find((record) => record.date === todayISO()) || attendanceRecords.at(-1);
  const milk = dashboardRecordStatus(state.milkRecords, student.id);
  const brush = dashboardRecordStatus(state.toothbrushRecords, student.id);
  const health = state.healthRecords
    .filter((item) => item.studentId === student.id)
    .sort((a, b) => String(b.recordDate || b.createdAt || "").localeCompare(String(a.recordDate || a.createdAt || "")))[0];
  const bmi = health?.bmi || calculateBMI(student.weight, student.height);
  const behaviors = state.behaviorRecords.filter((item) => item.studentId === student.id);
  return {
    attendance: todayAttend?.status || "รอข้อมูล",
    milk,
    brush,
    bmi: bmi ? `${bmi} • ${getBMICategory(bmi)}` : "รอข้อมูล",
    good: behaviors.filter((item) => item.behaviorType === "good").length,
    discipline: behaviors.filter((item) => item.behaviorType === "discipline").length
  };
}

function dashboardRecordStatus(collectionItems, studentId) {
  const record = collectionItems
    .filter((item) => item.date === todayISO())
    .flatMap((item) => item.records || [])
    .find((item) => item.studentId === studentId);
  return record?.status || "รอข้อมูล";
}

function dashboardRepeatedLateStudents(students) {
  const month = todayISO().slice(0, 7);
  return students.filter((student) => {
    const lateCount = dashboardStudentStatusCount(state.attendance, student.id, ["มาสาย"], month);
    return lateCount >= 2;
  });
}

function dashboardStudentStatusCount(collectionItems, studentId, statuses, month = todayISO().slice(0, 7)) {
  return collectionItems
    .filter((item) => String(item.date || item.recordDate || "").startsWith(month))
    .flatMap((item) => item.records || [])
    .filter((record) => record.studentId === studentId && statuses.includes(record.status))
    .length;
}

function dashboardPrintReport(type) {
  const students = filterByClass(state.students, state.classLevel);
  const titleMap = {
    today: "รายงานวันนี้",
    month: "รายงานรายเดือน",
    student: "รายงานนักเรียนรายคน"
  };
  const rows = students.map((student) => {
    const summary = dashboardStudentSummary(student);
    return `
      <tr>
        <td>${student.studentNo || "-"}</td>
        <td>${fullName(student)}</td>
        <td>${student.classLevel || "-"}</td>
        <td>${summary.attendance}</td>
        <td>${summary.milk}</td>
        <td>${summary.brush}</td>
        <td>${summary.bmi}</td>
        <td>${summary.good}/${summary.discipline}</td>
      </tr>
    `;
  }).join("");
  const sheet = document.createElement("section");
  sheet.className = "dashboard-print-sheet print-report-sheet";
  sheet.innerHTML = `
    <div class="print-report-head">
      <h1>${state.settings.schoolName || uiDefaultSchoolName}</h1>
      <h2>${titleMap[type] || titleMap.today}</h2>
      <p>ระดับชั้น ${state.classLevel === "all" ? "ป.4 - ป.6" : state.classLevel} • วันที่ ${new Intl.DateTimeFormat("th-TH", { dateStyle: "full" }).format(new Date())}</p>
    </div>
    <table>
      <thead><tr><th>เลขที่</th><th>ชื่อ</th><th>ชั้น</th><th>มาเรียน</th><th>นม</th><th>แปรงฟัน</th><th>BMI</th><th>ดี/ผิด</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="print-report-signature">
      <span>ลงชื่อ................................................ ครูประจำชั้น</span>
      <span>(${state.settings.teacherName || "ครูประจำชั้น"})</span>
    </div>
  `;
  document.body.classList.add("dashboard-printing");
  document.body.appendChild(sheet);
  window.print();
  setTimeout(() => {
    sheet.remove();
    document.body.classList.remove("dashboard-printing");
  }, 300);
}

function dashboardExportTodayCSV() {
  const students = filterByClass(state.students, state.classLevel);
  const rows = [
    ["โรงเรียน", state.settings.schoolName || uiDefaultSchoolName],
    ["วันที่", todayISO()],
    [],
    ["เลขที่", "ชื่อ", "ชั้น", "มาเรียน", "ดื่มนม", "แปรงฟัน", "BMI", "พฤติกรรมดี", "ผิดระเบียบ", "เบอร์ผู้ปกครอง"],
    ...students.map((student) => {
      const summary = dashboardStudentSummary(student);
      return [
        student.studentNo || "",
        fullName(student),
        student.classLevel || "",
        summary.attendance,
        summary.milk,
        summary.brush,
        summary.bmi,
        summary.good,
        summary.discipline,
        student.parentPhone || ""
      ];
    })
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
  downloadTextFile(`dashboard-today-${todayISO()}.csv`, "\ufeff" + csv, "text/csv;charset=utf-8");
  showToast("Export CSV วันนี้เรียบร้อยแล้ว Sensei! 🌸✅");
}

function percent(value, total) {
  return total ? Math.round((Number(value) / Number(total)) * 100) : 0;
}

function getDashboardContext({ absent, total, milkDone, brushDone }) {
  const hour = new Date().getHours();
  if (total && absent / total >= 0.2) {
    return {
      title: "⚠️ วันนี้มีนักเรียนขาดมากกว่าปกติ",
      message: "ควรตรวจสอบรายงานการมาเรียนและติดตามผู้ปกครอง",
      button: "ดูรายงานการมาเรียน",
      page: "reports",
      urgent: true
    };
  }
  if (hour < 11) {
    return {
      title: "🌅 ถึงเวลาเช็กชื่อรายวันแล้ว",
      message: "เริ่มจากเลือกชั้นเรียน แล้วกดสถานะของเด็ก ๆ ได้ทันที",
      button: "เริ่มเช็กชื่อ",
      page: "daily",
      urgent: false
    };
  }
  if (hour < 13 || milkDone === 0) {
    return {
      title: "🥛 อย่าลืมบันทึกการดื่มนมวันนี้",
      message: "เด็ก ๆ ดื่มนมครบแล้วหรือยัง Sensei?",
      button: "บันทึกดื่มนม",
      page: "milk",
      urgent: milkDone === 0
    };
  }
  return {
    title: "🪥 ตรวจการแปรงฟันและสรุปพฤติกรรมวันนี้",
    message: brushDone ? "ห้องนี้ยิ้มสดใสแล้ว ไปสรุปงานประจำวันกัน" : "ยังมีรายการสุขนิสัยที่ควรบันทึกต่อ",
    button: "เปิดงานประจำชั้น",
    page: "classwork",
    urgent: brushDone === 0
  };
}

function progressBar(label, value, tone) {
  return `
    <div class="dash-progress-row">
      <span>${label}</span>
      <div class="dash-progress-track"><i class="tone-${tone}" style="width:${value}%"></i></div>
      <strong>${value}%</strong>
    </div>
  `;
}

function miniBar(label, value, total, tone) {
  return `
    <div class="mini-bar">
      <div><span>${label}</span><strong>${value}</strong></div>
      <div class="dash-progress-track"><i class="tone-${tone}" style="width:${percent(value, total)}%"></i></div>
    </div>
  `;
}

function taskRow(label, done, urgent) {
  return `
    <div class="task-row">
      <span class="${done ? "done" : ""}">${done ? "✓" : ""}</span>
      <strong>${label}</strong>
      ${urgent && !done ? `<em>ด่วน</em>` : ""}
    </div>
  `;
}

function ringProgress(icon, label, value, hint) {
  return `
    <div class="ring-progress">
      <div class="ring" style="--value:${value}%"><span>${icon}</span></div>
      <strong>${label} ${value}%</strong>
      <p>${hint}</p>
    </div>
  `;
}

function getTodaySchedule() {
  const dayMap = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
  const day = dayMap[new Date().getDay()];
  return state.schedules
    .filter((item) => item.classLevel === selectedClass() && item.dayOfWeek === day)
    .sort((a, b) => Number(a.period) - Number(b.period))
    .slice(0, 4);
}

function scheduleTimelineItem(item) {
  const currentHour = new Date().getHours();
  const isCurrent = item.time && item.time.startsWith(String(currentHour).padStart(2, "0"));
  return `
    <div class="schedule-timeline-item ${isCurrent ? "current" : ""}">
      <span>${item.period}</span>
      <div>
        <strong>${subjectEmoji(item.subject || "")} ${item.subject || "ยังไม่ระบุวิชา"}</strong>
        <p>${item.time || "-"} • ${item.teacher || "ยังไม่ระบุครู"} • ${item.room || "ห้องเรียน"}</p>
      </div>
    </div>
  `;
}

function getTopBehaviorStudent(records, positive) {
  if (!records.length) return positive ? "รอบันทึกความดี" : "ยังไม่มี";
  const scores = records.reduce((map, record) => {
    map[record.studentId] = (map[record.studentId] || 0) + Number(record.score || 0);
    return map;
  }, {});
  const [studentId] = Object.entries(scores).sort((a, b) => positive ? b[1] - a[1] : a[1] - b[1])[0];
  const student = state.students.find((item) => item.id === studentId);
  return student ? fullName(student) : "ยังไม่มี";
}

function getRecentActivities() {
  const items = [];
  if (recordsForToday(state.attendance).length) items.push(`ครูบันทึกเช็กชื่อ ${selectedClass()} แล้ว`);
  if (recordsForToday(state.milkRecords).length) items.push(`บันทึกดื่มนม ${selectedClass()} สำเร็จ`);
  if (recordsForToday(state.toothbrushRecords).length) items.push(`บันทึกแปรงฟัน ${selectedClass()} สำเร็จ`);
  if (recordsForToday(state.behaviorRecords).length) items.push("เพิ่มบันทึกพฤติกรรมวันนี้แล้ว");
  if (state.healthRecords.length) items.push(`อัปเดตน้ำหนัก/ส่วนสูง ${selectedClass()}`);
  return items.length ? items.slice(-5).reverse() : [
    "ยังไม่มีรายการวันนี้ เริ่มจากเช็กชื่อรายวันได้เลย",
    "ระบบพร้อมช่วย Sensei จัดการห้องเรียน 🌸"
  ];
}

function bindDashboardActions() {
  $$("[data-dashboard-link]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activePage = button.dataset.dashboardLink;
      renderMenu();
      renderActivePage();
    });
  });
  $$("[data-dashboard-class]").forEach((button) => {
    button.addEventListener("click", () => {
      state.classLevel = button.dataset.dashboardClass;
      $("#globalClassSelect").value = state.classLevel;
      uiSyncGlobalClassSegment();
      loadDashboard();
    });
  });
  $("#dashboardSearch")?.addEventListener("input", (event) => {
    const queryText = event.target.value.trim().toLowerCase();
    if (!queryText) return;
    const found = state.students.find((student) => fullName(student).toLowerCase().includes(queryText));
    if (found) showToast(`พบข้อมูล ${fullName(found)} อยู่ชั้น ${found.classLevel}`);
  });
  $$("[data-dashboard-student]").forEach((button) => {
    button.addEventListener("click", () => dashboardOpenStudentProfile(button.dataset.dashboardStudent));
  });
  $$("[data-dashboard-print]").forEach((button) => {
    button.addEventListener("click", () => dashboardPrintReport(button.dataset.dashboardPrint));
  });
  $$("[data-dashboard-export]").forEach((button) => {
    button.addEventListener("click", dashboardExportTodayCSV);
  });
  $(".dashboard-profile-close")?.addEventListener("click", dashboardCloseStudentProfile);
  $("#dashboardProfileModal")?.addEventListener("click", (event) => {
    if (event.target.id === "dashboardProfileModal") dashboardCloseStudentProfile();
  });
}

function renderAttendancePage(type) {
  if (type === "subject") type = "daily";
  const config = {
    daily: { title: "ระบบเช็กชื่อรายวัน", statuses: ["มาเรียน", "ขาด", "ลา", "มาสาย"], extra: "" }
  }[type];

  $("#mainContent").innerHTML = `
    ${sectionHeader(config.title, menuItems.find((item) => item.id === type)?.subtitle || "บันทึกข้อมูลการมาเรียน")}
    ${commonToolbar(config.extra)}
    <div id="attendanceTable"></div>
    <div class="form-actions">
      <button id="saveAttendanceBtn" class="primary-btn">บันทึกทั้งหมด</button>
      <button id="editPastBtn" class="soft-btn">แก้ไขย้อนหลัง</button>
      <button id="dailyReportBtn" class="ghost-btn">ดูรายงานรายวัน</button>
      <button id="monthlyReportBtn" class="ghost-btn">ดูรายงานรายเดือน</button>
    </div>
  `;
  bindPageClassSync();
  renderAttendanceTable(type, config.statuses);
  $("#studentSearch").addEventListener("input", () => renderAttendanceTable(type, config.statuses));
  $("#saveAttendanceBtn").addEventListener("click", () => saveAttendance(type));
  $("#dailyReportBtn").addEventListener("click", loadAttendanceReport);
  $("#monthlyReportBtn").addEventListener("click", loadAttendanceReport);
  $("#editPastBtn").addEventListener("click", () => showToast("เลือกวันที่ย้อนหลังแล้วแก้ไขสถานะได้เลย"));
}

function renderAttendanceTable(type, statuses) {
  const students = searchStudents(selectedClass());
  if (!students.length) {
    $("#attendanceTable").innerHTML = emptyState("ยังไม่มีรายชื่อนักเรียน", "เพิ่มนักเรียนในเมนูนักเรียนก่อนเริ่มเช็กชื่อ");
    return;
  }
  $("#attendanceTable").innerHTML = `
    <div class="student-card-grid">
      ${students.map((student) => studentRecordCard(student, statuses)).join("")}
    </div>
  `;
  bindStatusCards();
}

async function saveAttendance(type = "daily") {
  const classLevel = selectedClass();
  const payload = {
    date: $("#workDate").value,
    classLevel,
    type,
    subject: $("#subjectName")?.value || "",
    period: $("#period")?.value || "",
    teacher: $("#teacherName")?.value || state.settings.teacherName,
    checkTime: $("#checkTime")?.value || "",
    records: collectRecordRows(),
    createdAt: nowValue(),
    updatedAt: nowValue()
  };
  const saved = await saveToFirestore("attendance", payload, "บันทึกเรียบร้อยแล้ว Sensei! 🌸✅");
  if (saved) {
    state.attendance.push({ id: saved, ...payload });
    persistLocalState();
  }
}

function loadAttendanceReport() {
  state.activePage = "reports";
  renderMenu();
  renderReports("attendance");
}

function renderClasswork() {
  $("#mainContent").innerHTML = `
    ${sectionHeader("งานประจำชั้น", "รายงานรายห้อง สถิติรายเดือน และภาพรวมวันนี้")}
    <div class="stats-grid">
      ${statCard("✅", "การมาเรียน", recordsForToday(state.attendance).length)}
      ${statCard("🥛", "การดื่มนม", recordsForToday(state.milkRecords).length)}
      ${statCard("🪥", "การแปรงฟัน", recordsForToday(state.toothbrushRecords).length)}
      ${statCard("🌟", "พฤติกรรม", state.behaviorRecords.length)}
      ${statCard("💜", "สุขภาพ", state.healthRecords.length)}
      ${statCard("🎂", "วันเกิดเดือนนี้", birthdaysThisMonth().length)}
    </div>
    <div class="grid two" style="margin-top:1rem">
      <div class="card">
        <h3>นักเรียนที่ต้องติดตามเป็นพิเศษ</h3>
        ${renderBehaviorWatchList()}
      </div>
      <div class="card">
        <h3>วันเกิดนักเรียน</h3>
        ${birthdaysThisMonth().length ? birthdaysThisMonth().map((s) => `<p>${fullName(s)} ${formatDateThai(s.birthDate)}</p>`).join("") : "<p class=\"empty-state\">ยังไม่มีวันเกิดเดือนนี้</p>"}
      </div>
    </div>
  `;
}

function renderMilk() {
  renderDailyRecordPage({
    title: "ระบบบันทึกดื่มนม",
    subtitle: "บันทึกรายวัน รายงานห้อง รายงานรายเดือน และภาพรวมการดื่มนม",
    target: "milkRecords",
    statuses: ["ดื่ม", "ไม่ดื่ม", "ลา", "ขาด"],
    save: saveMilkRecord
  });
}

function renderToothbrush() {
  renderDailyRecordPage({
    title: "แบบบันทึกการแปรงฟัน",
    subtitle: "บันทึกรายวัน รายงานห้อง รายงานรายเดือน และภาพรวมการแปรงฟัน",
    target: "toothbrushRecords",
    statuses: ["แปรงฟัน", "ไม่แปรง", "ลืมอุปกรณ์", "ลา", "ขาด"],
    save: saveToothbrushRecord
  });
}

function renderDailyRecordPage({ title, subtitle, target, statuses, save }) {
  const doneStatus = statuses[0];
  const todayRecords = recordsForToday(state[target]).flatMap((item) => item.records || []);
  const done = countStatus(todayRecords, [doneStatus]);
  const total = filterByClass(state.students, selectedClass()).length || searchStudents(selectedClass()).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  const missionTitle = target === "milkRecords" ? "ภารกิจดื่มนมวันนี้ 🥛✨" : "Smile Check 🪥😁";
  $("#mainContent").innerHTML = `
    ${sectionHeader(title, subtitle)}
    ${commonToolbar()}
    <div class="card mission-card">
      <div class="mission-title">
        <div>
          <h3><span class="mission-emoji">${target === "milkRecords" ? "🥛" : "😁"}</span> ${missionTitle}</h3>
          <p>${doneStatus}แล้ว ${done} / ${total} คน (${percent}%)</p>
        </div>
        <strong>${percent}%</strong>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
      ${percent === 100 && total ? "<p class=\"confetti-note\">ครบ 100% แล้ว Sensei! ✨🌸</p>" : ""}
    </div>
    <div class="card">
      <h3>เมนูย่อย</h3>
      <div class="form-actions">
        <button class="soft-btn">บันทึกรายวัน</button>
        <button class="ghost-btn">รายงานห้อง</button>
        <button class="ghost-btn">รายงานรายเดือน</button>
        <button class="ghost-btn">ภาพรวม</button>
      </div>
    </div>
    <div id="dailyRecordTable" style="margin-top:1rem"></div>
    <div class="form-actions">
      <button id="saveDailyRecordBtn" class="primary-btn">บันทึกข้อมูล</button>
      <button id="summaryBtn" class="soft-btn">สรุปรายวัน</button>
    </div>
  `;
  bindPageClassSync();
  renderDailyRecordTable(statuses);
  $("#studentSearch").addEventListener("input", () => renderDailyRecordTable(statuses));
  $("#saveDailyRecordBtn").addEventListener("click", save);
  $("#summaryBtn").addEventListener("click", () => showToast(`สรุปวันนี้ ${recordsForToday(state[target]).length} รายการ`));
}

function renderDailyRecordTable(statuses) {
  const students = searchStudents(selectedClass());
  if (!students.length) {
    $("#dailyRecordTable").innerHTML = emptyState("ยังไม่มีรายชื่อนักเรียน", "เพิ่มนักเรียนก่อนบันทึกข้อมูลประจำวัน");
    return;
  }
  $("#dailyRecordTable").innerHTML = `
    <div class="student-card-grid">
      ${students.map((student) => studentRecordCard(student, statuses)).join("")}
    </div>
  `;
  bindStatusCards();
}

function studentRecordCard(student, statuses) {
  const firstStatus = statuses[0];
  return `
    <article class="student-card status-${firstStatus}" data-student-id="${student.id}" data-status="${firstStatus}">
      <div class="student-card-head">
        <div class="student-avatar">${student.gender === "หญิง" ? "👧" : "👦"}</div>
        <div>
          <p class="student-meta">เลขที่ ${String(student.studentNo).padStart(2, "0")} • ${student.classLevel}</p>
          <h4 class="student-name">${fullName(student)}</h4>
        </div>
      </div>
      <div class="status-actions">
        ${statuses.map((status) => `
          <button type="button" class="status-chip ${status === firstStatus ? "active" : ""}" data-status="${status}">
            ${statusEmoji(status)} ${status}
          </button>
        `).join("")}
      </div>
      <input class="record-note" placeholder="หมายเหตุ">
    </article>
  `;
}

function bindStatusCards() {
  $$(".student-card .status-chip").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".student-card");
      card.dataset.status = button.dataset.status;
      card.className = `student-card status-${button.dataset.status} bump`;
      card.querySelectorAll(".status-chip").forEach((item) => item.classList.toggle("active", item === button));
      setTimeout(() => card.classList.remove("bump"), 280);
    });
  });
}

function statusEmoji(status) {
  return {
    "มาเรียน": "✅",
    "อยู่": "✅",
    "เข้าเรียน": "✅",
    "ดื่ม": "🥛",
    "แปรงฟัน": "🪥",
    "ขาด": "❌",
    "ขาดเรียน": "❌",
    "ไม่อยู่": "❌",
    "ไม่ดื่ม": "😅",
    "ไม่แปรง": "😬",
    "มาสาย": "🟡",
    "ลา": "🔵",
    "ลืมอุปกรณ์": "🎒"
  }[status] || "🌸";
}

function bmiClass(category) {
  return {
    "ผอม": "bmi-thin",
    "ปกติ": "bmi-normal",
    "เริ่มอ้วน": "bmi-over",
    "อ้วน": "bmi-obese"
  }[category] || "bmi-normal";
}

async function saveMilkRecord() {
  const payload = dailyPayload();
  const saved = await saveToFirestore("milkRecords", payload, "บันทึกเรียบร้อยแล้ว Sensei! 🌸✅");
  if (saved) {
    state.milkRecords.push({ id: saved, ...payload });
    persistLocalState();
  }
}

async function saveToothbrushRecord() {
  const payload = dailyPayload();
  const saved = await saveToFirestore("toothbrushRecords", payload, "บันทึกเรียบร้อยแล้ว Sensei! 🌸✅");
  if (saved) {
    state.toothbrushRecords.push({ id: saved, ...payload });
    persistLocalState();
  }
}

function dailyPayload() {
  return {
    date: $("#workDate").value,
    classLevel: selectedClass(),
    records: collectRecordRows(),
    createdAt: nowValue()
  };
}

function renderHealth() {
  const students = filterByClass(state.students, selectedClass());
  $("#mainContent").innerHTML = `
    ${sectionHeader("ข้อมูลสุขภาพนักเรียน", "สุขภาพดี เริ่มต้นที่การดูแลทุกวัน 💜")}
    ${commonToolbar()}
    <div class="card">
      <h3>บันทึกน้ำหนัก / ส่วนสูง / วันเกิด</h3>
      <div class="form-grid">
        <label>นักเรียน<select id="healthStudent">${students.map((s) => `<option value="${s.id}">${fullName(s)}</option>`).join("")}</select></label>
        <label>น้ำหนัก (กก.)<input id="healthWeight" type="number" step="0.1" placeholder="เช่น 35.5"></label>
        <label>ส่วนสูง (ซม.)<input id="healthHeight" type="number" step="0.1" placeholder="เช่น 145"></label>
        <label>วันเกิด<input id="healthBirthDate" type="date"></label>
        <label>วันที่บันทึก<input id="healthRecordDate" type="date" value="${todayISO()}"></label>
      </div>
      <div class="form-actions">
        <button id="saveHealthBtn" class="primary-btn">บันทึกสุขภาพ</button>
        <button id="healthReportBtn" class="soft-btn">รายงาน BMI / อายุ</button>
      </div>
    </div>
    <div style="margin-top:1rem">${renderHealthTable()}</div>
  `;
  bindPageClassSync(() => renderHealth());
  $("#saveHealthBtn").addEventListener("click", saveHealthRecord);
  $("#healthReportBtn").addEventListener("click", () => renderReports("health"));
}

function renderHealthTable() {
  const students = searchStudents(selectedClass());
  if (!students.length) return emptyState("ยังไม่มีข้อมูลสุขภาพ", "เพิ่มนักเรียนหรือเลือกชั้นเรียนอื่น");
  return `
    <div class="health-card-grid">
      ${students.map((student) => {
        const bmi = calculateBMI(student.weight, student.height);
        const category = getBMICategory(bmi);
        const gauge = Math.min(100, Math.max(8, Math.round((Number(bmi) / 30) * 100)));
        return `
          <article class="card health-card">
            <div class="bmi-gauge" style="--gauge:${gauge}%"><span>💜</span></div>
            <div>
              <h3>${student.gender === "หญิง" ? "👧" : "👦"} ${fullName(student)}</h3>
              <p>น้ำหนัก: ${student.weight || "-"} kg • ส่วนสูง: ${student.height || "-"} cm</p>
              <p>BMI: ${bmi || "-"} • <strong class="${bmiClass(category)}">${category}</strong></p>
              <p>อายุ: ${student.birthDate ? calculateAge(student.birthDate) : "-"}</p>
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

async function saveHealthRecord() {
  const studentId = $("#healthStudent").value;
  const weight = Number($("#healthWeight").value);
  const height = Number($("#healthHeight").value);
  const bmi = calculateBMI(weight, height);
  const payload = {
    studentId,
    classLevel: selectedClass(),
    weight,
    height,
    bmi,
    bmiCategory: getBMICategory(bmi),
    birthDate: $("#healthBirthDate").value,
    recordDate: $("#healthRecordDate").value,
    createdAt: nowValue()
  };
  const saved = await saveToFirestore("healthRecords", payload, "บันทึกสุขภาพสำเร็จแล้ว 💜");
  if (saved) {
    state.healthRecords.push({ id: saved, ...payload });
    if (!state.firebaseReady) {
      state.students = state.students.map((student) => student.id === studentId
        ? {
            ...student,
            weight: weight || student.weight,
            height: height || student.height,
            birthDate: payload.birthDate || student.birthDate
          }
        : student);
    }
    persistLocalState();
    renderHealth();
  }
}

function calculateBMI(weight, height) {
  const w = Number(weight);
  const h = Number(height) / 100;
  if (!w || !h) return 0;
  return Number((w / (h * h)).toFixed(2));
}

function getBMICategory(bmi) {
  const value = Number(bmi);
  if (!value) return "รอข้อมูล";
  if (value < 18.5) return "ผอม";
  if (value < 23) return "ปกติ";
  if (value < 25) return "เริ่มอ้วน";
  return "อ้วน";
}

function calculateAge(birthDate) {
  if (!birthDate) return "-";
  const birth = new Date(birthDate);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return `${years} ปี ${months} เดือน ${days} วัน`;
}

function renderBehavior() {
  const students = filterByClass(state.students, selectedClass());
  $("#mainContent").innerHTML = `
    ${sectionHeader("ระบบบันทึกพฤติกรรม", "เพิ่มความดีให้นักเรียน 🌟")}
    ${commonToolbar()}
    <div class="grid two">
      <div class="card">
        <h3>บันทึกพฤติกรรม</h3>
        <div class="form-grid">
          <label>นักเรียน<select id="behaviorStudent">${students.map((s) => `<option value="${s.id}">${fullName(s)}</option>`).join("")}</select></label>
          <label>ประเภท<select id="behaviorType"><option value="good">บันทึกความดี</option><option value="discipline">บันทึกผิดระเบียบ</option></select></label>
          <label>หมวดหมู่<select id="behaviorCategory">${behaviorOptions().map((item) => `<option>${item}</option>`).join("")}</select></label>
          <label>คะแนน<input id="behaviorScore" type="number" value="1"></label>
          <label>ครูผู้บันทึก<input id="behaviorTeacher" value="${state.settings.teacherName}"></label>
          <label>วันที่<input id="behaviorDate" type="date" value="${todayISO()}"></label>
        </div>
        <label style="margin-top:.8rem">รายละเอียด<textarea id="behaviorDetail" rows="3" placeholder="รายละเอียดพฤติกรรม"></textarea></label>
        <label style="margin-top:.8rem">หมายเหตุเพิ่มเติม<textarea id="behaviorNote" rows="2" placeholder="หมายเหตุ"></textarea></label>
        <div class="form-actions">
          <button id="saveBehaviorBtn" class="primary-btn">บันทึกพฤติกรรม</button>
        </div>
      </div>
      <div class="card">
        <h3>รายงานพฤติกรรม</h3>
        ${renderBehaviorSummary()}
      </div>
    </div>
  `;
  bindPageClassSync(() => renderBehavior());
  $("#behaviorType").addEventListener("change", (event) => {
    $("#behaviorCategory").innerHTML = behaviorOptions(event.target.value).map((item) => `<option>${item}</option>`).join("");
  });
  $("#saveBehaviorBtn").addEventListener("click", saveBehaviorRecord);
}

function behaviorOptions(type = "good") {
  return type === "good"
    ? ["ช่วยเหลือเพื่อน", "เก็บของได้ส่งคืน", "มีจิตอาสา", "ตั้งใจเรียน", "รับผิดชอบงาน"]
    : ["มาสาย", "ไม่ส่งงาน", "แต่งกายผิดระเบียบ", "พูดไม่สุภาพ", "ทะเลาะวิวาท", "ไม่เข้าแถว"];
}

async function saveBehaviorRecord() {
  const type = $("#behaviorType").value;
  const rawScore = Number($("#behaviorScore").value || 0);
  const payload = {
    date: $("#behaviorDate").value,
    studentId: $("#behaviorStudent").value,
    classLevel: selectedClass(),
    behaviorType: type,
    category: $("#behaviorCategory").value,
    detail: $("#behaviorDetail").value,
    score: type === "discipline" ? -Math.abs(rawScore) : Math.abs(rawScore),
    teacher: $("#behaviorTeacher").value,
    note: $("#behaviorNote").value,
    createdAt: nowValue()
  };
  const saved = await saveToFirestore("behaviorRecords", payload, "บันทึกพฤติกรรมสำเร็จแล้ว 🌟");
  if (saved) {
    state.behaviorRecords.push({ id: saved, ...payload });
    persistLocalState();
  }
  renderBehavior();
}

function renderBehaviorSummary() {
  const records = filterByClass(state.behaviorRecords, selectedClass());
  const good = records.filter((item) => item.behaviorType === "good");
  const discipline = records.filter((item) => item.behaviorType === "discipline");
  return `
    <p>${statusBadge("ความดี")} ${good.length} รายการ</p>
    <p>${statusBadge("ผิดระเบียบ")} ${discipline.length} รายการ</p>
    <h4>นักเรียนที่ควรชื่นชม</h4>
    ${studentScoreList(good, true)}
    <h4>นักเรียนที่ควรติดตาม</h4>
    ${studentScoreList(discipline, false)}
  `;
}

function renderSchedule() {
  const days = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"];
  $("#mainContent").innerHTML = `
    ${sectionHeader("ตารางเรียน / ตารางสอน", "แสดงผลเป็นตารางสวยงาม อ่านง่าย และแก้ไขได้")}
    <div class="toolbar">
      <select id="pageClassSelect">${classLevels.map((level) => `<option value="${level}" ${level === selectedClass() ? "selected" : ""}>${level}</option>`).join("")}</select>
      <button id="saveScheduleBtn" class="primary-btn">บันทึกตารางเรียน</button>
    </div>
    <div class="table-wrap">
      <table class="schedule-grid">
        <thead>
          <tr><th>วัน / คาบ</th>${schedulePeriods.map((item) => `<th>${item.label}<br><small>${item.time}</small>${item.note ? `<br><small>${item.note}</small>` : ""}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${days.map((day) => `
            <tr>
              <th>${day}</th>
              ${schedulePeriods.map((item) => scheduleCell(day, item.period)).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
  bindPageClassSync(() => renderSchedule());
  $("#saveScheduleBtn").addEventListener("click", saveSchedule);
}

function scheduleCell(day, period) {
  const item = state.schedules.find((schedule) => schedule.classLevel === selectedClass() && schedule.dayOfWeek === day && Number(schedule.period) === period) || {};
  const periodInfo = schedulePeriods.find((entry) => entry.period === Number(period)) || {};
  const icon = subjectEmoji(item.subject || "");
  return `
    <td data-day="${day}" data-period="${period}">
      ${item.subject ? `<div class="subject-pill" title="ครูผู้สอน: ${item.teacher || "-"}"><strong>${icon} ${item.subject}</strong><small>${item.teacher || "ยังไม่ระบุครู"} • ${item.room || "ห้องเรียน"}</small></div>` : ""}
      ${periodInfo.note ? `<div class="lunch-note">🍱 ${periodInfo.note}</div>` : ""}
      <input class="schedule-subject" placeholder="รายวิชา" value="${item.subject || ""}">
      <input class="schedule-teacher" placeholder="ครู" value="${item.teacher || ""}">
      <input class="schedule-room" placeholder="ห้อง" value="${item.room || ""}">
      <input class="schedule-note" placeholder="หมายเหตุ" value="${item.note || periodInfo.note || ""}">
    </td>
  `;
}

function subjectEmoji(subject) {
  if (subject.includes("ไทย")) return "📖";
  if (subject.includes("คณิต")) return "🧮";
  if (subject.includes("วิทย")) return "🔬";
  if (subject.includes("อังกฤษ")) return "🔤";
  if (subject.includes("พละ") || subject.includes("สุขศึกษา")) return "⚽";
  if (subject.includes("ศิลป")) return "🎨";
  if (subject.includes("สังคม")) return "🗺️";
  return "📚";
}

function periodTime(period) {
  return schedulePeriods.find((item) => item.period === Number(period))?.time || "";
}

async function saveSchedule() {
  const rows = $$("td[data-day]").map((cell) => ({
    classLevel: selectedClass(),
    dayOfWeek: cell.dataset.day,
    period: Number(cell.dataset.period),
    time: periodTime(Number(cell.dataset.period)),
    subject: cell.querySelector(".schedule-subject").value,
    teacher: cell.querySelector(".schedule-teacher").value,
    room: cell.querySelector(".schedule-room").value,
    note: cell.querySelector(".schedule-note").value || schedulePeriods.find((item) => item.period === Number(cell.dataset.period))?.note || ""
  })).filter((item) => item.subject || item.teacher || item.room || item.note);

  if (state.firebaseReady) {
    for (const row of rows) {
      await addDoc(collection(state.db, "schedules"), { ...row, createdAt: serverTimestamp() });
    }
  }
  state.schedules = [...state.schedules.filter((item) => item.classLevel !== selectedClass()), ...rows.map((row) => ({ id: crypto.randomUUID(), ...row }))];
  persistLocalState();
  uiClearDraft();
  showToast("บันทึกตารางเรียนสำเร็จแล้ว ✅");
  playSuccessSound();
}

function renderReports(kind = "all") {
  const reportTypes = [
    "รายงานการมาเรียนรายวัน", "รายงานการมาเรียนรายเดือน",
    "รายงานดื่มนม", "รายงานดื่มนมรายเดือน",
    "รายงานแปรงฟัน", "รายงานแปรงฟันรายเดือน", "รายงาน BMI",
    "รายงานสุขภาพรายเดือน", "รายงานอายุ", "รายงานพฤติกรรม", "รายงานภาพรวมรายห้อง"
  ];
  const visibleReportTypes = reportTypes;
  $("#mainContent").innerHTML = `
    ${sectionHeader("ระบบรายงาน", "กรองข้อมูล พิมพ์รายงาน และ Export CSV")}
    <div class="toolbar">
      <input id="reportDate" type="date" value="${todayISO()}">
      <select id="pageClassSelect">${classLevels.map((level) => `<option value="${level}" ${level === selectedClass() ? "selected" : ""}>${level}</option>`).join("")}</select>
      <input id="reportStudent" type="search" placeholder="กรองชื่อนักเรียน">
      <select id="reportType">${visibleReportTypes.map((type) => `<option ${kind !== "all" && type.includes(kind) ? "selected" : ""}>${type}</option>`).join("")}</select>
      <button id="printReportBtn" class="soft-btn">พิมพ์รายงาน</button>
      <button id="exportCsvBtn" class="primary-btn">Export CSV</button>
      <button id="exportPdfBtn" class="ghost-btn">Export PDF</button>
    </div>
    <div class="report-card-grid" style="margin-bottom:1rem">
      ${visibleReportTypes.map((type) => `<button class="card report-type-card" data-report="${type}">${reportIcon(type)} ${type}</button>`).join("")}
    </div>
    <div class="card">
      <h3 id="reportTitle">${reportTypes[0]}</h3>
      <div id="reportPreview">${renderReportTable()}</div>
    </div>
  `;
  bindPageClassSync(() => renderReports(kind));
  $("#printReportBtn").addEventListener("click", printReport);
  $("#exportCsvBtn").addEventListener("click", exportCSV);
  $("#exportPdfBtn").addEventListener("click", exportPDF);
  ["reportDate", "reportStudent", "reportType"].forEach((id) => {
    $(`#${id}`).addEventListener("input", refreshReportPreview);
    $(`#${id}`).addEventListener("change", refreshReportPreview);
  });
  $$(".report-type-card").forEach((button) => button.addEventListener("click", () => {
    $("#reportType").value = button.dataset.report;
    refreshReportPreview();
  }));
  refreshReportPreview();
}

function reportIcon(type) {
  if (type.includes("วัน")) return "📅";
  if (type.includes("เดือน")) return "📊";
  if (type.includes("ห้อง")) return "🏫";
  if (type.includes("ดื่มนม")) return "🥛";
  if (type.includes("แปรงฟัน")) return "🪥";
  if (type.includes("BMI") || type.includes("อายุ")) return "💪";
  if (type.includes("พฤติกรรม")) return "🌟";
  return "👧";
}

function renderReportTable() {
  const report = buildCurrentReport();
  if (!report.rows.length) return emptyState("ยังไม่มีข้อมูลรายงาน", "เลือกวันที่ ชั้นเรียน หรือชื่อนักเรียนอีกครั้ง");
  return tableWrap(`
    <table>
      <thead><tr>${report.headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
      <tbody>
        ${report.rows.map((row) => `<tr>${row.map((cell) => `<td>${statusCell(cell)}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
  `);
}

function refreshReportPreview() {
  const report = buildCurrentReport();
  $("#reportTitle").textContent = report.title;
  $("#reportPreview").innerHTML = renderReportTable();
}

function buildCurrentReport() {
  const type = $("#reportType")?.value || "รายงานภาพรวมรายห้อง";
  const date = $("#reportDate")?.value || todayISO();
  const classLevel = $("#pageClassSelect")?.value || selectedClass();
  const studentText = ($("#reportStudent")?.value || "").trim().toLowerCase();
  const students = filterReportStudents(classLevel, studentText);
  const title = `${type} (${classLevel})`;

  if (type.includes("รายวัน") && type.includes("มาเรียน")) {
    return attendanceReport("รายงานการมาเรียนรายวัน", date, classLevel, students, (item) => item.type === "daily" && item.date === date);
  }
  if (type.includes("รายเดือน") && type.includes("มาเรียน")) {
    const month = date.slice(0, 7);
    return monthlyAttendanceSummaryReport("รายงานการมาเรียนรายเดือน", month, classLevel, students);
  }
  if (type.includes("ดื่มนมรายเดือน")) {
    return monthlyDailyRecordSummaryReport("รายงานดื่มนมรายเดือน", date.slice(0, 7), classLevel, students, state.milkRecords, ["ดื่ม", "ไม่ดื่ม", "ลา", "ขาด"]);
  }
  if (type.includes("ดื่มนม")) {
    return dailyRecordReport("รายงานดื่มนม", date, classLevel, students, state.milkRecords, "ดื่ม");
  }
  if (type.includes("แปรงฟันรายเดือน")) {
    return monthlyDailyRecordSummaryReport("รายงานแปรงฟันรายเดือน", date.slice(0, 7), classLevel, students, state.toothbrushRecords, ["แปรงฟัน", "ไม่แปรง", "ลืมอุปกรณ์", "ลา", "ขาด"]);
  }
  if (type.includes("แปรงฟัน")) {
    return dailyRecordReport("รายงานแปรงฟัน", date, classLevel, students, state.toothbrushRecords, "แปรงฟัน");
  }
  if (type.includes("สุขภาพรายเดือน")) {
    return monthlyHealthSummaryReport("รายงานสุขภาพรายเดือน", date.slice(0, 7), classLevel, students);
  }
  if (type.includes("BMI")) {
    return bmiReport(title, students);
  }
  if (type.includes("อายุ")) {
    return ageReport(title, students);
  }
  if (type.includes("พฤติกรรม")) {
    return behaviorReport(title, date, classLevel, students);
  }
  return roomOverviewReport(title, date, classLevel, students);
}

function filterReportStudents(classLevel, searchText = "") {
  return filterByClass(state.students, classLevel)
    .filter((student) => !searchText || fullName(student).toLowerCase().includes(searchText) || String(student.studentNo).includes(searchText))
    .sort((a, b) => Number(a.studentNo) - Number(b.studentNo));
}

function attendanceReport(title, date, classLevel, students, predicate, includeDate = false, includeSubject = false) {
  const records = filterByClass(state.attendance, classLevel).filter(predicate);
  const rows = [];
  students.forEach((student) => {
    const matched = records.flatMap((item) => (item.records || []).map((record) => ({ ...record, parent: item })))
      .filter((record) => record.studentId === student.id);
    if (matched.length) {
      matched.forEach((record) => rows.push([
        ...(includeDate ? [record.parent.date || date] : []),
        student.studentNo,
        fullName(student),
        student.classLevel,
        ...(includeSubject ? [record.parent.period || "-", record.parent.subject || "-", record.parent.teacher || "-"] : []),
        record.status || "รอข้อมูล",
        record.note || "-"
      ]));
    } else {
      rows.push([
        ...(includeDate ? [date] : []),
        student.studentNo,
        fullName(student),
        student.classLevel,
        ...(includeSubject ? ["-", "-", "-"] : []),
        "รอข้อมูล",
        "-"
      ]);
    }
  });
  return {
    title,
    headers: [
      ...(includeDate ? ["วันที่"] : []),
      "เลขที่", "ชื่อ-สกุล", "ชั้น",
      ...(includeSubject ? ["คาบ", "รายวิชา", "ครูผู้สอน"] : []),
      "สถานะ", "หมายเหตุ"
    ],
    rows
  };
}

function monthlyAttendanceSummaryReport(title, month, classLevel, students) {
  const monthlyRecords = filterByClass(state.attendance, classLevel)
    .filter((item) => item.type === "daily" && String(item.date || "").startsWith(month));
  const rows = students.map((student) => {
    const counts = { present: 0, absent: 0, late: 0, leave: 0, pending: 0 };
    monthlyRecords.forEach((item) => {
      const record = (item.records || []).find((entry) => entry.studentId === student.id);
      const status = record?.status || "รอข้อมูล";
      if (status === "มาเรียน" || status === "อยู่" || status === "เข้าเรียน") counts.present += 1;
      else if (status === "ขาด" || status === "ขาดเรียน") counts.absent += 1;
      else if (status === "มาสาย") counts.late += 1;
      else if (status === "ลา") counts.leave += 1;
      else counts.pending += 1;
    });
    const totalRecorded = counts.present + counts.absent + counts.late + counts.leave;
    return [
      student.studentNo,
      fullName(student),
      student.classLevel,
      counts.present,
      counts.absent,
      counts.late,
      counts.leave,
      totalRecorded,
      totalRecorded ? `${Math.round((counts.present / totalRecorded) * 100)}%` : "0%"
    ];
  });
  const summary = rows.reduce((sum, row) => {
    sum.present += Number(row[3] || 0);
    sum.absent += Number(row[4] || 0);
    sum.late += Number(row[5] || 0);
    sum.leave += Number(row[6] || 0);
    sum.total += Number(row[7] || 0);
    return sum;
  }, { present: 0, absent: 0, late: 0, leave: 0, total: 0 });
  rows.push([
    "",
    "รวมทั้งเดือน",
    classLevel,
    summary.present,
    summary.absent,
    summary.late,
    summary.leave,
    summary.total,
    summary.total ? `${Math.round((summary.present / summary.total) * 100)}%` : "0%"
  ]);
  return {
    title: `${title} ${month}`,
    headers: ["เลขที่", "ชื่อ-สกุล", "ชั้น", "มา", "ขาด", "สาย", "ลา", "รวมบันทึก", "ร้อยละมาเรียน"],
    rows
  };
}

function dailyRecordReport(title, date, classLevel, students, collectionItems, successStatus) {
  const records = filterByClass(collectionItems, classLevel).filter((item) => item.date === date);
  const rows = students.map((student) => {
    const record = records.flatMap((item) => item.records || []).find((item) => item.studentId === student.id);
    return [
      student.studentNo,
      fullName(student),
      student.classLevel,
      record?.status || "รอข้อมูล",
      record?.note || "-"
    ];
  });
  const done = rows.filter((row) => row[3] === successStatus).length;
  return {
    title: `${title} - สำเร็จ ${done}/${students.length} คน`,
    headers: ["เลขที่", "ชื่อ-สกุล", "ชั้น", "สถานะ", "หมายเหตุ"],
    rows
  };
}

function monthlyDailyRecordSummaryReport(title, month, classLevel, students, collectionItems, statuses) {
  const monthlyRecords = filterByClass(collectionItems, classLevel)
    .filter((item) => String(item.date || "").startsWith(month));
  const rows = students.map((student) => {
    const counts = Object.fromEntries(statuses.map((status) => [status, 0]));
    monthlyRecords.forEach((item) => {
      const record = (item.records || []).find((entry) => entry.studentId === student.id);
      const status = record?.status || "รอข้อมูล";
      if (counts[status] !== undefined) counts[status] += 1;
    });
    const total = statuses.reduce((sum, status) => sum + counts[status], 0);
    const successStatus = statuses[0];
    return [
      student.studentNo,
      fullName(student),
      student.classLevel,
      ...statuses.map((status) => counts[status]),
      total,
      total ? `${Math.round((counts[successStatus] / total) * 100)}%` : "0%"
    ];
  });
  const summary = statuses.reduce((sum, status) => ({ ...sum, [status]: 0 }), {});
  let summaryTotal = 0;
  rows.forEach((row) => {
    statuses.forEach((status, index) => {
      summary[status] += Number(row[index + 3] || 0);
    });
    summaryTotal += Number(row[statuses.length + 3] || 0);
  });
  rows.push([
    "",
    "รวมทั้งเดือน",
    classLevel,
    ...statuses.map((status) => summary[status]),
    summaryTotal,
    summaryTotal ? `${Math.round((summary[statuses[0]] / summaryTotal) * 100)}%` : "0%"
  ]);
  return {
    title: `${title} ${month}`,
    headers: ["เลขที่", "ชื่อ-สกุล", "ชั้น", ...statuses, "รวมบันทึก", "ร้อยละสำเร็จ"],
    rows
  };
}

function monthlyHealthSummaryReport(title, month, classLevel, students) {
  const monthlyRecords = filterByClass(state.healthRecords, classLevel)
    .filter((item) => String(item.recordDate || "").startsWith(month));
  const rows = students.map((student) => {
    const records = monthlyRecords
      .filter((item) => item.studentId === student.id)
      .sort((a, b) => String(a.recordDate || "").localeCompare(String(b.recordDate || "")));
    const latest = records.at(-1);
    const averageWeight = average(records.map((item) => Number(item.weight || 0)).filter(Boolean));
    const averageHeight = average(records.map((item) => Number(item.height || 0)).filter(Boolean));
    const latestBmi = latest?.bmi || calculateBMI(latest?.weight, latest?.height);
    return [
      student.studentNo,
      fullName(student),
      student.classLevel,
      records.length,
      latest?.recordDate || "-",
      averageWeight || "-",
      averageHeight || "-",
      latestBmi || "-",
      latestBmi ? getBMICategory(latestBmi) : "รอข้อมูล",
      student.birthDate ? calculateAge(student.birthDate) : "-"
    ];
  });
  const summary = rows.reduce((sum, row) => {
    const category = row[8];
    if (sum[category] !== undefined) sum[category] += 1;
    return sum;
  }, { "ผอม": 0, "ปกติ": 0, "เริ่มอ้วน": 0, "อ้วน": 0, "รอข้อมูล": 0 });
  rows.push([
    "",
    "สรุปทั้งเดือน",
    classLevel,
    rows.reduce((sum, row) => sum + Number(row[3] || 0), 0),
    "-",
    "-",
    "-",
    "-",
    `ปกติ ${summary["ปกติ"]} / ผอม ${summary["ผอม"]} / เริ่มอ้วน ${summary["เริ่มอ้วน"]} / อ้วน ${summary["อ้วน"]}`,
    "-"
  ]);
  return {
    title: `${title} ${month}`,
    headers: ["เลขที่", "ชื่อ-สกุล", "ชั้น", "จำนวนบันทึก", "วันที่ล่าสุด", "น้ำหนักเฉลี่ย", "ส่วนสูงเฉลี่ย", "BMI ล่าสุด", "แปลผล", "อายุ"],
    rows
  };
}

function average(values) {
  if (!values.length) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function bmiReport(title, students) {
  return {
    title,
    headers: ["เลขที่", "ชื่อ-สกุล", "ชั้น", "น้ำหนัก", "ส่วนสูง", "BMI", "แปลผล"],
    rows: students.map((student) => {
      const bmi = calculateBMI(student.weight, student.height);
      return [student.studentNo, fullName(student), student.classLevel, student.weight || "-", student.height || "-", bmi || "-", bmi ? getBMICategory(bmi) : "รอข้อมูล"];
    })
  };
}

function ageReport(title, students) {
  return {
    title,
    headers: ["เลขที่", "ชื่อ-สกุล", "ชั้น", "วันเกิด", "อายุปัจจุบัน", "สถานะ"],
    rows: students.map((student) => [student.studentNo, fullName(student), student.classLevel, student.birthDate || "-", student.birthDate ? calculateAge(student.birthDate) : "-", student.status || "รอข้อมูล"])
  };
}

function behaviorReport(title, date, classLevel, students) {
  const studentIds = new Set(students.map((student) => student.id));
  const rows = filterByClass(state.behaviorRecords, classLevel)
    .filter((item) => item.date === date && studentIds.has(item.studentId))
    .map((item) => {
      const student = state.students.find((s) => s.id === item.studentId) || {};
      return [item.date, fullName(student), item.classLevel, item.behaviorType === "good" ? "ความดี" : "ผิดระเบียบ", item.category || "-", item.detail || "-", item.score || 0, item.teacher || "-", item.note || "-"];
    });
  return {
    title,
    headers: ["วันที่", "ชื่อ-สกุล", "ชั้น", "ประเภท", "หมวดหมู่", "รายละเอียด", "คะแนน", "ครูผู้บันทึก", "หมายเหตุ"],
    rows
  };
}

function roomOverviewReport(title, date, classLevel, students) {
  const attendance = attendanceReport(title, date, classLevel, students, (item) => item.type === "daily" && item.date === date);
  return {
    title,
    headers: ["เลขที่", "ชื่อ-สกุล", "ชั้น", "มาเรียน", "ดื่มนม", "แปรงฟัน", "BMI", "พฤติกรรมวันนี้"],
    rows: students.map((student) => {
      const attendStatus = attendance.rows.find((row) => row[1] === fullName(student))?.[3] || "รอข้อมูล";
      const milk = recordStatusForStudent(state.milkRecords, date, classLevel, student.id);
      const brush = recordStatusForStudent(state.toothbrushRecords, date, classLevel, student.id);
      const bmi = calculateBMI(student.weight, student.height);
      const behaviors = filterByClass(state.behaviorRecords, classLevel).filter((item) => item.date === date && item.studentId === student.id).length;
      return [student.studentNo, fullName(student), student.classLevel, attendStatus, milk, brush, bmi ? getBMICategory(bmi) : "รอข้อมูล", `${behaviors} รายการ`];
    })
  };
}

function recordStatusForStudent(items, date, classLevel, studentId) {
  return filterByClass(items, classLevel)
    .filter((item) => item.date === date)
    .flatMap((item) => item.records || [])
    .find((record) => record.studentId === studentId)?.status || "รอข้อมูล";
}

function statusCell(value) {
  const text = String(value ?? "");
  if (["มาเรียน", "เข้าเรียน", "ดื่ม", "แปรงฟัน", "ปกติ", "กำลังศึกษา", "ความดี"].includes(text)) return statusBadge(text);
  if (["ขาด", "ขาดเรียน", "ผิดระเบียบ", "อ้วน"].includes(text)) return statusBadge(text);
  if (["ลา"].includes(text)) return statusBadge(text);
  if (["มาสาย", "เริ่มอ้วน", "รอข้อมูล"].includes(text)) return statusBadge(text);
  return escapeHTML(text);
}

function renderStudents() {
  const editingStudent = state.students.find((item) => item.id === state.editingStudentId);
  $("#mainContent").innerHTML = `
    ${sectionHeader("ระบบจัดการข้อมูลนักเรียน", "เพิ่ม / แก้ไข / ลบ นักเรียน")}
    ${commonToolbar()}
    <div class="card">
      <h3>เพิ่มนักเรียน</h3>
      <div class="form-grid">
        <label>เลขที่<input id="studentNo" type="number"></label>
        <label>รหัสนักเรียน<input id="studentCode"></label>
        <label>คำนำหน้า<select id="prefix"><option>ด.ช.</option><option>ด.ญ.</option><option>เด็กชาย</option><option>เด็กหญิง</option></select></label>
        <label>ชื่อ<input id="firstName"></label>
        <label>นามสกุล<input id="lastName"></label>
        <label>ชื่อเล่น<input id="nickname"></label>
        <label>เพศ<select id="gender"><option>ชาย</option><option>หญิง</option><option>อื่น ๆ</option></select></label>
        <label>ชั้นเรียน<select id="studentClass">${classLevels.map((level) => `<option>${level}</option>`).join("")}</select></label>
        <label>วันเกิด<input id="birthDate" type="date"></label>
        <label>น้ำหนัก<input id="weight" type="number" step="0.1"></label>
        <label>ส่วนสูง<input id="height" type="number" step="0.1"></label>
        <label>เบอร์ผู้ปกครอง<input id="parentPhone"></label>
        <label>สถานะ<select id="status"><option>กำลังศึกษา</option><option>ย้าย</option><option>ออก</option></select></label>
      </div>
      <label style="margin-top:.8rem">ที่อยู่<textarea id="address" rows="2"></textarea></label>
      <div class="form-actions">
        <button id="addStudentBtn" class="primary-btn">เพิ่มนักเรียน</button>
        <button id="downloadStudentCsvBtn" type="button" class="soft-btn">ดาวน์โหลดไฟล์ตัวอย่าง CSV</button>
        <label class="ghost-btn csv-import-label" for="studentCsvInput">นำเข้านักเรียนจาก CSV</label>
        <input id="studentCsvInput" type="file" accept=".csv,text/csv,.txt" class="hidden">
      </div>
    </div>
    <div id="studentTable" style="margin-top:1rem"></div>
  `;
  bindPageClassSync(() => renderStudents());
  renderStudentTable();
  hydrateStudentForm(editingStudent);
  $("#studentSearch").addEventListener("input", renderStudentTable);
  $("#addStudentBtn").addEventListener("click", addStudent);
  $("#downloadStudentCsvBtn").addEventListener("click", downloadStudentCsvTemplate);
  $("#studentCsvInput").addEventListener("change", importStudentsFromCSV);
}

function hydrateStudentForm(student) {
  const submitButton = $("#addStudentBtn");
  const heading = $("#mainContent .card h3");
  if (!student) {
    if (submitButton) submitButton.textContent = "เพิ่มนักเรียน";
    if (heading) heading.textContent = "เพิ่มนักเรียน";
    return;
  }

  if (heading) heading.textContent = "แก้ไขข้อมูลนักเรียน";
  if (submitButton) submitButton.textContent = "บันทึกการแก้ไข";

  $("#studentNo").value = student.studentNo || "";
  $("#studentCode").value = student.studentCode || "";
  $("#prefix").value = student.prefix || "ด.ช.";
  $("#firstName").value = student.firstName || "";
  $("#lastName").value = student.lastName || "";
  $("#nickname").value = student.nickname || "";
  $("#gender").value = student.gender || "ชาย";
  $("#studentClass").value = student.classLevel || selectedClass();
  $("#birthDate").value = student.birthDate || "";
  $("#weight").value = student.weight || "";
  $("#height").value = student.height || "";
  $("#parentPhone").value = student.parentPhone || "";
  $("#status").value = student.status || "กำลังศึกษา";
  $("#address").value = student.address || "";

  const cancelButton = document.createElement("button");
  cancelButton.id = "cancelEditStudentBtn";
  cancelButton.type = "button";
  cancelButton.className = "ghost-btn";
  cancelButton.textContent = "ยกเลิกแก้ไข";
  cancelButton.addEventListener("click", () => {
    state.editingStudentId = null;
    renderStudents();
  });
  submitButton.insertAdjacentElement("afterend", cancelButton);
}

function renderStudentTable() {
  const students = searchStudents(state.classLevel === "all" ? "all" : selectedClass());
  if (!students.length) {
    $("#studentTable").innerHTML = emptyState("ยังไม่มีข้อมูลนักเรียน", "เพิ่มนักเรียนคนแรกเพื่อเริ่มใช้งานระบบ");
    return;
  }
  $("#studentTable").innerHTML = tableWrap(`
    <table>
      <thead><tr><th>เลขที่</th><th>รหัส</th><th>ชื่อ-สกุล</th><th>ชื่อเล่น</th><th>ชั้น</th><th>ผู้ปกครอง</th><th>สถานะ</th><th>จัดการ</th></tr></thead>
      <tbody>
        ${students.map((student) => `
          <tr>
            <td>${student.studentNo}</td>
            <td>${student.studentCode || "-"}</td>
            <td>${fullName(student)}</td>
            <td>${student.nickname || "-"}</td>
            <td>${student.classLevel}</td>
            <td>${student.parentPhone || "-"}</td>
            <td>${statusBadge(student.status || "รอข้อมูล")}</td>
            <td>
              <button class="soft-btn" data-edit="${student.id}">แก้ไข</button>
              <button class="danger-btn" data-delete="${student.id}">ลบ</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `);
  $$("[data-edit]").forEach((button) => button.addEventListener("click", () => updateStudent(button.dataset.edit)));
  $$("[data-delete]").forEach((button) => button.addEventListener("click", () => deleteStudent(button.dataset.delete)));
}

async function addStudent() {
  if (!canManageStudents()) {
    showToast("ต้องเข้าสู่ระบบ Admin ก่อนเพิ่มข้อมูลนักเรียน");
    return;
  }
  const payload = {
    studentNo: Number($("#studentNo").value),
    studentCode: $("#studentCode").value,
    prefix: $("#prefix").value,
    firstName: $("#firstName").value,
    lastName: $("#lastName").value,
    nickname: $("#nickname").value,
    gender: $("#gender").value,
    classLevel: $("#studentClass").value,
    birthDate: $("#birthDate").value,
    weight: Number($("#weight").value),
    height: Number($("#height").value),
    parentPhone: $("#parentPhone").value,
    address: $("#address").value,
    status: $("#status").value,
    createdAt: nowValue(),
    updatedAt: nowValue()
  };
  if (!payload.firstName || !payload.lastName || !payload.classLevel) {
    showToast("กรุณากรอกชื่อ นามสกุล และชั้นเรียน");
    return;
  }

  if (state.editingStudentId) {
    try {
      showLoading(true);
      const current = state.students.find((item) => item.id === state.editingStudentId);
      const updated = { ...payload, createdAt: current?.createdAt || payload.createdAt };
      if (state.firebaseReady) await setDoc(doc(state.db, "students", state.editingStudentId), updated, { merge: true });
      state.students = state.students.map((item) => item.id === state.editingStudentId ? { id: item.id, ...updated } : item);
      state.editingStudentId = null;
      persistLocalState();
      uiClearDraft();
      showToast("แก้ไขข้อมูลนักเรียนสำเร็จแล้ว ✅");
      playSuccessSound();
      renderStudents();
    } catch (error) {
      if (error.code === "permission-denied") {
        showToast("แก้ไขไม่สำเร็จ: บัญชีนี้ยังไม่มีสิทธิ์ Admin ใน Firestore");
      } else {
        handleError(error, "แก้ไขข้อมูลนักเรียนไม่สำเร็จ");
      }
    } finally {
      showLoading(false);
    }
    return;
  }

  const saved = await saveToFirestore("students", payload, "เพิ่มนักเรียนสำเร็จแล้ว ✅");
  if (saved) {
    state.students.push({ id: saved, ...payload });
    persistLocalState();
    renderStudents();
  }
}

function downloadStudentCsvTemplate() {
  const rows = [
    ["เลขที่", "รหัส", "ชื่อ-สกุล", "ชื่อเล่น", "ชั้น", "ผู้ปกครอง", "วันเกิด"],
    ["1", "P401", "ด.ช.ก้องภพ ใจดี", "ก้อง", "ป.4", "0812345678", "2016-05-12"],
    ["2", "P402", "ด.ญ.มินนี่ สดใส", "มินนี่", "ป.4", "0899999999", "2016-08-20"]
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
  downloadTextFile(`student-template-${todayISO()}.csv`, "\ufeff" + csv, "text/csv;charset=utf-8");
  showToast("ดาวน์โหลดไฟล์ตัวอย่าง CSV แล้ว");
}

async function importStudentsFromCSV(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!canManageStudents()) {
    showToast("ต้องเข้าสู่ระบบ Admin ก่อนนำเข้านักเรียนจาก CSV");
    event.target.value = "";
    return;
  }

  try {
    const text = await file.text();
    const rows = parseDelimitedRows(text);
    if (rows.length < 2) {
      showToast("ไฟล์ CSV ยังไม่มีข้อมูลนักเรียน");
      return;
    }

    const headers = rows[0].map((item) => normalizeHeader(item));
    const students = rows.slice(1)
      .filter((row) => row.some((cell) => String(cell || "").trim()))
      .map((row) => studentFromCsvRow(headers, row))
      .filter((student) => student.firstName && student.lastName && student.classLevel);

    if (!students.length) {
      showToast("ไม่พบข้อมูลที่นำเข้าได้ กรุณาตรวจหัวตาราง CSV");
      return;
    }

    const ok = await confirmAction("นำเข้านักเรียนจาก CSV", `ต้องการเพิ่มนักเรียน ${students.length} คนใช่ไหม?`);
    if (!ok) return;

    showLoading(true);
    if (state.firebaseReady) {
      for (const student of students) {
        await addDoc(collection(state.db, "students"), student);
      }
    }
    state.students.push(...students.map((student) => ({ id: crypto.randomUUID(), ...student })));
    persistLocalState();
    showToast(`นำเข้านักเรียน ${students.length} คนสำเร็จแล้ว ✅`);
    playSuccessSound();
    renderStudents();
  } catch (error) {
    if (error.code === "permission-denied") {
      showToast("นำเข้า CSV ไม่สำเร็จ: บัญชี Admin ยังไม่มีสิทธิ์เขียนข้อมูลนักเรียน");
    } else {
      handleError(error, "นำเข้า CSV ไม่สำเร็จ");
    }
  } finally {
    showLoading(false);
    event.target.value = "";
  }
}

function parseDelimitedRows(text) {
  const clean = text.replace(/^\ufeff/, "").trim();
  const delimiter = clean.includes("\t") ? "\t" : clean.includes(";") ? ";" : ",";
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < clean.length; index += 1) {
    const char = clean[index];
    const next = clean[index + 1];
    if (char === "\"" && quoted && next === "\"") {
      cell += "\"";
      index += 1;
    } else if (char === "\"") {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell.trim());
  rows.push(row);
  return rows;
}

function normalizeHeader(header) {
  return String(header || "").replace(/\s+/g, "").toLowerCase();
}

function csvValue(headers, row, names) {
  const index = headers.findIndex((header) => names.includes(header));
  return index >= 0 ? String(row[index] || "").trim() : "";
}

function studentFromCsvRow(headers, row) {
  const full = csvValue(headers, row, ["ชื่อ-สกุล", "ชื่อสกุล", "fullname", "name"]);
  const nameParts = splitThaiFullName(full);
  return {
    studentNo: Number(csvValue(headers, row, ["เลขที่", "no", "studentno"])) || 0,
    studentCode: csvValue(headers, row, ["รหัส", "รหัสนักเรียน", "code", "studentcode"]),
    prefix: nameParts.prefix,
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    nickname: csvValue(headers, row, ["ชื่อเล่น", "nickname"]),
    gender: nameParts.prefix.includes("ญ") || nameParts.prefix.includes("หญิง") ? "หญิง" : "ชาย",
    classLevel: csvValue(headers, row, ["ชั้น", "ชั้นเรียน", "class", "classlevel"]) || selectedClass(),
    birthDate: normalizeBirthDate(csvValue(headers, row, ["วันเกิด", "birthdate", "birthday"])),
    weight: 0,
    height: 0,
    parentPhone: csvValue(headers, row, ["ผู้ปกครอง", "เบอร์ผู้ปกครอง", "parentphone", "phone"]),
    address: "",
    status: "กำลังศึกษา",
    createdAt: nowValue(),
    updatedAt: nowValue()
  };
}

function canManageStudents() {
  return state.role === "admin";
}

function normalizeBirthDate(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

  const match = text.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
  if (!match) return text;

  const day = Number(match[1]);
  const month = Number(match[2]);
  let year = Number(match[3]);
  if (year > 2400) year -= 543;

  return [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0")
  ].join("-");
}

function splitThaiFullName(fullNameText) {
  const prefixes = ["ด.ช.", "ด.ญ.", "เด็กชาย", "เด็กหญิง", "นาย", "นางสาว"];
  const prefix = prefixes.find((item) => fullNameText.startsWith(item)) || "";
  const rest = prefix ? fullNameText.slice(prefix.length).trim() : fullNameText.trim();
  const [firstName = "", ...lastParts] = rest.split(/\s+/);
  return {
    prefix,
    firstName,
    lastName: lastParts.join(" ")
  };
}

function downloadTextFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

async function updateStudent(id) {
  if (!canManageStudents()) {
    showToast("ต้องเข้าสู่ระบบ Admin ก่อนแก้ไขข้อมูลนักเรียน");
    return;
  }
  const student = state.students.find((item) => item.id === id);
  if (!student) return;
  state.editingStudentId = id;
  renderStudents();
  document.querySelector(".card")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteStudent(id) {
  const ok = await confirmAction("ยืนยันการลบนักเรียน", "ต้องการลบข้อมูลนักเรียนคนนี้ใช่ไหม?");
  if (!ok) return;
  if (state.role !== "admin") {
    showToast("ครูทั่วไปไม่สามารถลบข้อมูลสำคัญได้");
    return;
  }
  if (state.firebaseReady) await deleteDoc(doc(state.db, "students", id));
  state.students = state.students.filter((student) => student.id !== id);
  persistLocalState();
  showToast("ลบข้อมูลนักเรียนแล้ว");
  renderStudentTable();
}

function renderSettings() {
  $("#mainContent").innerHTML = `
    ${sectionHeader("ตั้งค่าระบบ", "ข้อมูลโรงเรียน ปีการศึกษา และธีม")}
    <div class="card">
      <div class="form-grid">
        <label>ชื่อโรงเรียน<input id="settingSchoolName" value="${state.settings.schoolName}"></label>
        <label>ปีการศึกษา<input id="settingYear" value="${state.settings.academicYear}"></label>
        <label>ภาคเรียน<input id="settingSemester" value="${state.settings.semester}"></label>
        <label>ชื่อครู<input id="settingTeacher" value="${state.settings.teacherName}"></label>
        <label>ธีม<select id="settingTheme"><option>purple</option><option>indigo</option><option>sky</option></select></label>
      </div>
      <div class="form-actions">
        <button id="saveSettingsBtn" class="primary-btn">บันทึกตั้งค่า</button>
        <button id="toggleDarkSettingsBtn" class="soft-btn">Dark Mode / Light Mode</button>
        <button id="exportLocalBackupBtn" type="button" class="ghost-btn">สำรองข้อมูลทดลอง</button>
        <button id="resetLocalDemoBtn" type="button" class="danger-btn">รีเซ็ตข้อมูลทดลอง</button>
      </div>
    </div>
  `;
  $("#saveSettingsBtn").addEventListener("click", saveSettings);
  $("#toggleDarkSettingsBtn").addEventListener("click", toggleDarkMode);
  $("#exportLocalBackupBtn").addEventListener("click", exportLocalBackup);
  $("#resetLocalDemoBtn").addEventListener("click", resetLocalDemoData);
}

async function saveSettings() {
  state.settings = {
    ...state.settings,
    schoolName: $("#settingSchoolName").value,
    academicYear: $("#settingYear").value,
    semester: $("#settingSemester").value,
    teacherName: $("#settingTeacher").value,
    theme: $("#settingTheme").value
  };
  $("#schoolNameSide").textContent = state.settings.schoolName;
  if (state.firebaseReady) await setDoc(doc(state.db, "settings", "main"), state.settings, { merge: true });
  persistLocalState();
  uiClearDraft();
  showToast("บันทึกตั้งค่าระบบสำเร็จแล้ว ✅");
  playSuccessSound();
}

function exportLocalBackup() {
  if (state.firebaseReady) {
    showToast("สำรองข้อมูลทดลองใช้ได้ในโหมดทดลองเท่านั้น");
    return;
  }
  const snapshot = localStateCollections.reduce((data, name) => {
    data[name] = state[name];
    return data;
  }, { settings: state.settings, exportedAt: new Date().toISOString() });
  downloadTextFile(`classroom-backup-${todayISO()}.json`, JSON.stringify(snapshot, null, 2), "application/json;charset=utf-8");
  showToast("สำรองข้อมูลทดลองเรียบร้อยแล้ว Sensei! 🌸✅");
}

async function resetLocalDemoData() {
  if (state.firebaseReady) {
    showToast("รีเซ็ตข้อมูลทดลองใช้ได้ในโหมดทดลองเท่านั้น");
    return;
  }
  const ok = await confirmAction("รีเซ็ตข้อมูลทดลอง", "ต้องการล้างข้อมูลทดลองในเครื่องนี้และกลับไปใช้ข้อมูลตัวอย่างใช่ไหม?");
  if (!ok) return;

  localStorage.removeItem(localStorageKey);
  localStateCollections.forEach((name) => {
    state[name] = [];
  });
  state.students = demoStudents.map((student) => ({ ...student }));
  state.settings = {
    schoolName: uiDefaultSchoolName,
    academicYear: "2569",
    semester: "1",
    teacherName: "ครูประจำชั้น",
    theme: "purple",
    darkMode: state.settings.darkMode
  };
  persistLocalState();
  $("#schoolNameSide").textContent = state.settings.schoolName;
  showToast("รีเซ็ตข้อมูลทดลองแล้ว Sensei! 🌸✅");
  renderActivePage();
}

async function saveToFirestore(collectionName, payload, message) {
  try {
    const ok = await confirmAction("ตรวจสอบก่อนบันทึก", "ตรวจสอบก่อนบันทึกข้อมูลนะครับ ✅");
    if (!ok) return false;
    showLoading(true);
    let savedId = crypto.randomUUID();
    if (state.firebaseReady) {
      const savedDoc = await addDoc(collection(state.db, collectionName), payload);
      savedId = savedDoc.id;
    }
    showToast(message);
    playSuccessSound();
    uiClearDraft();
    return savedId;
  } catch (error) {
    handleError(error, "บันทึกข้อมูลไม่สำเร็จ");
    return false;
  } finally {
    showLoading(false);
  }
}

function collectRecordRows() {
  const cardRows = $$(".student-card[data-student-id]");
  if (cardRows.length) {
    return cardRows.map((card) => ({
      studentId: card.dataset.studentId,
      status: card.dataset.status,
      note: card.querySelector(".record-note").value
    }));
  }
  return $$("tr[data-student-id]").map((row) => ({
    studentId: row.dataset.studentId,
    status: row.querySelector(".record-status").value,
    note: row.querySelector(".record-note").value
  }));
}

function filterByClass(items, classLevel) {
  if (!classLevel || classLevel === "all") return items;
  return items.filter((item) => item.classLevel === classLevel);
}

function searchStudents(classLevel) {
  const search = ($("#studentSearch")?.value || "").trim().toLowerCase();
  return filterByClass(state.students, classLevel)
    .filter((student) => fullName(student).toLowerCase().includes(search) || String(student.studentNo).includes(search))
    .sort((a, b) => Number(a.studentNo) - Number(b.studentNo));
}

function recordsForToday(items) {
  return filterByClass(items, state.classLevel).filter((item) => item.date === todayISO());
}

function countStatus(records, statuses) {
  return records.filter((record) => statuses.includes(record.status)).length;
}

function getHealthSummary(students) {
  return students.reduce((summary, student) => {
    const category = getBMICategory(calculateBMI(student.weight, student.height));
    if (category === "ผอม") summary.thin += 1;
    else if (category === "ปกติ") summary.normal += 1;
    else if (category === "เริ่มอ้วน") summary.overweight += 1;
    else if (category === "อ้วน") summary.obese += 1;
    return summary;
  }, { thin: 0, normal: 0, overweight: 0, obese: 0 });
}

function fullName(student) {
  return `${student.prefix || ""}${student.firstName || ""} ${student.lastName || ""}`.trim();
}

function statusBadge(status) {
  const statusClass = {
    "มาเรียน": "success", "ปกติ": "success", "สำเร็จ": "success", "กำลังศึกษา": "success", "ดื่ม": "success", "แปรงฟัน": "success", "เข้าเรียน": "success", "อยู่": "success",
    "ขาด": "danger", "ผิดระเบียบ": "danger", "ขาดเรียน": "danger", "ไม่อยู่": "danger", "ไม่ดื่ม": "danger", "ไม่แปรง": "danger", "อ้วน": "danger",
    "ลา": "info",
    "มาสาย": "warning", "เริ่มอ้วน": "warning", "ลืมอุปกรณ์": "warning",
    "รอข้อมูล": "pending",
    "ความดี": "good"
  }[status] || "pending";
  return `<span class="badge ${statusClass}">${status}</span>`;
}

function tableWrap(content) {
  return `<div class="table-wrap">${content}</div>`;
}

function emptyState(title, message) {
  return `<div class="card empty-state dashboard-empty-state"><span>🌸</span><strong>${title}</strong><small>${message}</small></div>`;
}

function bindPageClassSync(callback = renderActivePage) {
  $("#pageClassSelect")?.addEventListener("change", (event) => {
    state.classLevel = event.target.value;
    $("#globalClassSelect").value = event.target.value;
    callback();
  });
}

function setThaiDate() {
  $("#thaiDate").textContent = new Intl.DateTimeFormat("th-TH", {
    dateStyle: "full"
  }).format(new Date());
}

function formatDateThai(date) {
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(date));
}

function birthdaysThisMonth() {
  const month = new Date().getMonth();
  return state.students.filter((student) => student.birthDate && new Date(student.birthDate).getMonth() === month);
}

function renderBehaviorWatchList() {
  const discipline = state.behaviorRecords.filter((item) => item.behaviorType === "discipline");
  return discipline.length ? studentScoreList(discipline, false) : "<p class=\"empty-state\">ยังไม่มีนักเรียนที่ต้องติดตาม</p>";
}

function studentScoreList(records, positive) {
  const scores = records.reduce((map, record) => {
    map[record.studentId] = (map[record.studentId] || 0) + record.score;
    return map;
  }, {});
  const rows = Object.entries(scores)
    .sort((a, b) => positive ? b[1] - a[1] : a[1] - b[1])
    .slice(0, 5)
    .map(([id, score]) => {
      const student = state.students.find((item) => item.id === id);
      return `<p>${student ? fullName(student) : id}: ${score} คะแนน</p>`;
    });
  return rows.length ? rows.join("") : "<p class=\"empty-state\">ยังไม่มีข้อมูล</p>";
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  const enabled = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", enabled ? "true" : "false");
  $("#darkModeBtn").textContent = enabled ? "☀️" : "🌙";
}

function applyStoredTheme() {
  const enabled = localStorage.getItem("darkMode") === "true";
  document.body.classList.toggle("dark", enabled);
  $("#darkModeBtn").textContent = enabled ? "☀️" : "🌙";
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function playSuccessSound() {
  try {
    const audio = new AudioContext();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = 660;
    gain.gain.setValueAtTime(0.001, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audio.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.16);
    osc.connect(gain).connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + 0.18);
  } catch (error) {
    console.warn("Audio unavailable", error);
  }
}

function exportCSV() {
  const report = buildCurrentReport();
  const rows = [report.headers, ...report.rows];
  const csv = rows.map((row) => row.map((cell) => `"${plainText(cell).replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
  downloadTextFile(`${slugifyThai(report.title)}-${todayISO()}.csv`, "\ufeff" + csv, "text/csv;charset=utf-8");
  showToast(`Export CSV: ${report.title} สำเร็จแล้ว ✅`);
}

function printReport() {
  exportPDF();
}

function exportPDF() {
  const report = buildCurrentReport();
  const html = buildPrintableReportHTML(report);
  const printWindow = window.open("", "_blank", "width=1200,height=800");
  if (!printWindow) {
    showToast("เบราว์เซอร์บล็อกหน้าต่าง PDF กรุณาอนุญาต pop-up แล้วลองใหม่");
    return;
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.addEventListener("load", () => {
    printWindow.print();
  });
  showToast("เปิดหน้ารายงาน PDF แล้ว เลือก Save as PDF ได้เลย 📄");
}

function buildPrintableReportHTML(report) {
  const generatedAt = new Intl.DateTimeFormat("th-TH", { dateStyle: "full", timeStyle: "short" }).format(new Date());
  const schoolName = "โรงเรียนชุมชนบ้านหนองผึ้ง (ประพันธ์คุรุราษฎร์อุทิศ)";
  const logoUrl = new URL("assets/obec-logo.png", window.location.href).href;
  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>${escapeHTML(report.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Itim&display=swap" rel="stylesheet">
  <style>
    body { font-family: "Itim", sans-serif; margin: 24px 30px; color: #1f2937; }
    header { text-align: center; border-bottom: 2px solid #6366f1; margin-bottom: 16px; padding-bottom: 12px; }
    .report-logo { width: 72px; height: auto; object-fit: contain; display: block; margin: 0 auto 8px; }
    h1 { margin: 0; color: #312e81; font-size: 30px; line-height: 1.15; }
    h2 { margin: 4px 0 0; color: #1f2937; font-size: 20px; font-weight: 600; }
    p { margin: 4px 0; color: #475569; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th, td { border: 1px solid #dbe3ff; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #eef2ff; color: #312e81; }
    tr:nth-child(even) td { background: #fafaff; }
    .summary { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin: 12px 0 18px; }
    .pill { border-radius: 999px; padding: 5px 10px; background: #f8f5ff; color: #312e81; }
    .signature { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; margin-top: 42px; font-size: 16px; }
    .signature-box { text-align: center; min-height: 104px; }
    .signature-line { display: inline-block; min-width: 260px; border-bottom: 1px dotted #111827; height: 22px; vertical-align: bottom; }
    .name-line { margin-top: 14px; }
    .role-line { margin-top: 2px; }
    @page { size: A4 landscape; margin: 12mm; }
  </style>
</head>
<body>
  <header>
    <img class="report-logo" src="${escapeHTML(logoUrl)}" alt="โลโก้ สพฐ.">
    <h1>${escapeHTML(report.title)}</h1>
    <h2>${escapeHTML(schoolName)}</h2>
    <p>สร้างรายงานเมื่อ ${escapeHTML(generatedAt)}</p>
  </header>
  <div class="summary">
    <span class="pill">จำนวนรายการ ${report.rows.length}</span>
    <span class="pill">ชั้น ${escapeHTML($("#pageClassSelect")?.value || selectedClass())}</span>
    <span class="pill">วันที่ ${escapeHTML($("#reportDate")?.value || todayISO())}</span>
  </div>
  <table>
    <thead><tr>${report.headers.map((header) => `<th>${escapeHTML(header)}</th>`).join("")}</tr></thead>
    <tbody>${report.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHTML(plainText(cell))}</td>`).join("")}</tr>`).join("")}</tbody>
  </table>
  <section class="signature">
    <div class="signature-box">
      <div>ลงชื่อ<span class="signature-line"></span>ครูผู้สอน/ครูประจำชั้น</div>
      <div class="name-line">( <span class="signature-line"></span> )</div>
    </div>
    <div class="signature-box">
      <div>ลงชื่อ<span class="signature-line"></span>ผู้อำนวยการโรงเรียน</div>
      <div class="name-line">( <span class="signature-line"></span> )</div>
    </div>
  </section>
</body>
</html>`;
}

function plainText(value) {
  const div = document.createElement("div");
  div.innerHTML = String(value ?? "");
  return (div.textContent || div.innerText || "").trim();
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function slugifyThai(value) {
  return String(value || "report")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function showLoading(show) {
  $("#loadingOverlay p").textContent = "🌸 Sensei กำลังเตรียมข้อมูลให้นะ...";
  $("#loadingOverlay").classList.toggle("hidden", !show);
}

function renderSakuraLayer() {
  const layer = document.createElement("div");
  layer.className = "sakura-layer";
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = Array.from({ length: 10 }, (_, index) => `
    <span class="sakura" style="left:${8 + index * 9}%; animation-delay:${index * 0.75}s; animation-duration:${8 + (index % 4)}s">🌸</span>
  `).join("");
  document.body.prepend(layer);
}

function handleError(error, fallbackMessage) {
  console.error(error);
  offlineShowFriendlyError(fallbackMessage, error);
  showToast(`${fallbackMessage}: ${error.message || "เกิดข้อผิดพลาด"}`);
}

function confirmAction(title, message) {
  const dialog = $("#confirmDialog");
  $("#confirmTitle").textContent = title;
  $("#confirmMessage").textContent = message;
  if (!dialog.showModal) return Promise.resolve(confirm(message));
  dialog.showModal();
  return new Promise((resolve) => {
    dialog.addEventListener("close", () => resolve(dialog.returnValue === "ok"), { once: true });
  });
}

function nowValue() {
  return state.firebaseReady ? serverTimestamp() : new Date().toISOString();
}

window.calculateBMI = calculateBMI;
window.getBMICategory = getBMICategory;
window.calculateAge = calculateAge;




