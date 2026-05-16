# ระบบธุรการชั้นเรียน / Classroom Admin System

เว็บแอปสำหรับครูประจำชั้น ป.4 ป.5 ป.6 ใช้บันทึกข้อมูลนักเรียน เช็กชื่อ งานประจำชั้น ดื่มนม แปรงฟัน สุขภาพ พฤติกรรม ตารางเรียน และรายงานภาพรวม

## แผนพัฒนาระบบ

- ขั้นที่ 2: เชื่อม Firebase Authentication และ Firestore
- ขั้นที่ 3: ทำระบบนักเรียนและเช็กชื่อ
- ขั้นที่ 4: ทำดื่มนม แปรงฟัน สุขภาพ BMI อายุ
- ขั้นที่ 5: ทำพฤติกรรม ตารางเรียน และรายงาน
- ขั้นที่ 6: ตรวจ Bug ปรับ Responsive และเตรียม Deploy Firebase Hosting

## ไฟล์ในโปรเจกต์

- `index.html` หน้าเว็บหลัก
- `style.css` ธีม สี responsive layout, dark mode, animation
- `app.js` ฟังก์ชันระบบทั้งหมดและการเชื่อม Firebase
- `firebase-config.js` ใส่ค่า Firebase config ของโรงเรียน
- `firestore.rules` กฎความปลอดภัย Firestore เบื้องต้น
- `firebase.json` ตั้งค่า Firebase Hosting และ Firestore rules

## วิธีสร้าง Firebase Project

1. เข้า [Firebase Console](https://console.firebase.google.com/)
2. กด Add project
3. ตั้งชื่อโปรเจกต์ เช่น `classroom-admin-system`
4. เลือกเปิดหรือปิด Google Analytics ได้ตามต้องการ
5. เมื่อสร้างเสร็จ ให้เพิ่ม Web App แล้วคัดลอกค่า `firebaseConfig`

## วิธีใส่ firebaseConfig

เปิดไฟล์ `firebase-config.js` แล้วแทนที่ placeholder:

```js
window.firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

เมื่อยังไม่ใส่ค่า config ระบบจะเปิดโหมดทดลองด้วยข้อมูลตัวอย่าง เพื่อให้ดู UI และทดลองเมนูได้ก่อน

## วิธีเปิด Authentication

1. ใน Firebase Console ไปที่ Authentication
2. กด Get started
3. เปิด Sign-in method:
   - Anonymous
   - Email/Password
4. เพิ่มผู้ใช้ Admin ในแท็บ Users ด้วยอีเมลและรหัสผ่าน

ระบบรองรับ role เบื้องต้นผ่าน collection `userRoles`:

```txt
userRoles/{uid}
- role: "admin" หรือ "teacher"
```

ถ้าไม่ได้สร้าง role ระบบ rules จะถือว่าเป็น `teacher` สำหรับผู้ที่ login แล้ว

## วิธีเปิด Firestore

1. ไปที่ Firestore Database
2. กด Create database
3. เลือก Production mode
4. เลือก region ตามที่ต้องการ
5. Deploy rules จากไฟล์ `firestore.rules`

## โครงสร้างฐานข้อมูล Firestore

### `students`

- `studentNo`
- `studentCode`
- `prefix`
- `firstName`
- `lastName`
- `nickname`
- `gender`
- `classLevel`
- `birthDate`
- `weight`
- `height`
- `parentPhone`
- `address`
- `status`
- `createdAt`
- `updatedAt`

### `attendance`

- `date`
- `classLevel`
- `type`: `daily`, `subject`
- `subject`
- `period`
- `teacher`
- `records`: array ของ `{ studentId, status, note }`
- `createdAt`
- `updatedAt`

### `milkRecords`

- `date`
- `classLevel`
- `records`: array ของ `{ studentId, status, note }`
- `createdAt`

### `toothbrushRecords`

- `date`
- `classLevel`
- `records`: array ของ `{ studentId, status, note }`
- `createdAt`

### `healthRecords`

- `studentId`
- `classLevel`
- `weight`
- `height`
- `bmi`
- `bmiCategory`
- `recordDate`
- `createdAt`

### `behaviorRecords`

- `date`
- `studentId`
- `classLevel`
- `behaviorType`: `good` หรือ `discipline`
- `category`
- `detail`
- `score`
- `teacher`
- `note`
- `createdAt`

### `schedules`

- `classLevel`
- `dayOfWeek`
- `period`
- `time`
- `subject`
- `teacher`
- `room`
- `note`

### `settings`

- `schoolName`
- `academicYear`
- `semester`
- `teacherName`
- `theme`
- `darkMode`

## วิธีรันเว็บในเครื่อง

สามารถเปิดไฟล์ `index.html` ได้โดยตรงเพื่อใช้งานโหมดทดลอง หรือเปิดผ่าน local server:

```bash
python -m http.server 5500
```

หรือใช้ server เล็ก ๆ ที่เตรียมไว้:

```bash
node dev-server.cjs
```

แล้วเปิด:

```txt
http://localhost:5500
```

## นำเข้านักเรียนจาก CSV

ในเมนูนักเรียน กด `ดาวน์โหลดไฟล์ตัวอย่าง CSV` ก่อน แล้วกรอกข้อมูลตามหัวตาราง:

```txt
เลขที่,รหัส,ชื่อ-สกุล,ชื่อเล่น,ชั้น,ผู้ปกครอง,วันเกิด
```

ระบบรองรับไฟล์ที่คั่นด้วย comma หรือ tab และวันเกิดควรใช้รูปแบบ `YYYY-MM-DD` เช่น `2016-05-12`

## วิธี Deploy ไป Firebase Hosting

ติดตั้ง Firebase CLI:

```bash
npm install -g firebase-tools
```

เข้าสู่ระบบ:

```bash
firebase login
```

ผูกโปรเจกต์:

```bash
firebase use --add
```

Deploy:

```bash
firebase deploy
```

ถ้าต้องการ deploy เฉพาะ hosting:

```bash
firebase deploy --only hosting
```

ถ้าต้องการ deploy rules:

```bash
firebase deploy --only firestore:rules
```

## ฟังก์ชันสำคัญในระบบ

- `initFirebase()`
- `loginAnonymous()`
- `loginAdmin()`
- `logout()`
- `loadStudents(classLevel)`
- `addStudent()`
- `updateStudent()`
- `deleteStudent()`
- `saveAttendance()`
- `loadAttendanceReport()`
- `saveMilkRecord()`
- `saveToothbrushRecord()`
- `saveHealthRecord()`
- `calculateBMI(weight, height)`
- `getBMICategory(bmi)`
- `calculateAge(birthDate)`
- `saveBehaviorRecord()`
- `loadDashboard()`
- `renderSchedule()`
- `saveSchedule()`
- `toggleDarkMode()`
- `showToast()`
- `playSuccessSound()`
- `exportCSV()`
- `printReport()`

## หมายเหตุด้านความปลอดภัย

Rules ที่ให้มาเป็นโครงเริ่มต้นสำหรับระบบโรงเรียนขนาดเล็ก:

- ผู้ใช้ต้อง login ก่อนอ่านข้อมูล
- Admin เพิ่ม แก้ไข ลบข้อมูลหลักได้
- Teacher บันทึกงานประจำวันได้
- ผู้ใช้ที่ไม่ login อ่านหรือเขียนไม่ได้

ก่อนใช้งานจริงควรตรวจ role, สิทธิ์รายโรงเรียน และ validation ของข้อมูลให้ตรงนโยบายของโรงเรียนอีกครั้ง
