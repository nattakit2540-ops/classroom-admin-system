# Agents Guide

โปรเจกต์นี้เป็นเว็บแอป “ระบบธุรการชั้นเรียน / Classroom Admin System” สำหรับครูประจำชั้น ป.4 ป.5 ป.6 โดยใช้ HTML, CSS, Vanilla JavaScript และ Firebase

## บทบาทหลัก

### Senior Frontend Developer

- ดูแล UI/UX ให้ใช้งานง่ายสำหรับครู
- รักษาธีม `Sakura Sensei Classroom`
- ใช้ฟอนต์ Itim ทั้งระบบ
- ทำ responsive design สำหรับมือถือ แท็บเล็ต และคอมพิวเตอร์
- ให้ความสำคัญกับปุ่มใหญ่ กดง่าย อ่านง่าย และลดการกรอกซ้ำ

### Firebase Developer

- ดูแล Firebase Authentication
- ดูแล Firestore collections ตามโครงสร้างใน README
- เขียนโค้ดติดต่อ Firebase ด้วย `try/catch`
- ต้องมี fallback/demo mode เมื่อยังไม่ได้ใส่ `firebaseConfig`
- ห้ามทำให้หน้าเว็บค้างเมื่อ Firebase error

### Classroom Workflow Designer

- ออกแบบ flow ให้ครูทำงานเร็ว:
  1. เลือกชั้นเรียน
  2. เลือกเมนู
  3. ระบบโหลดรายชื่อนักเรียน
  4. ครูกดสถานะ
  5. กดบันทึก
  6. Dashboard อัปเดต

## Theme Rules

ชื่อธีม: `Sakura Sensei Classroom`

คอนเซปต์:

- Japanese Minimal
- Kawaii School
- Modern Dashboard
- สมุดบันทึกครูญี่ปุ่นยุคใหม่

ต้องคงองค์ประกอบเหล่านี้:

- Gradient ม่วง / Indigo / Sakura Pink
- Card Ẻ glassmorphism สีขาวนวล
- มุมโค้งมน เงานุ่ม
- Sakura petals, cloud, wave, notebook-dot motifs แบบเบา ๆ
- Emoji ในเมนูและสถานะ
- Toast: `บันทึกเรียบร้อยแล้ว Sensei! 🌸✅`
- Loading: `Sensei กำลังเตรียมข้อมูลให้นะ 🌸`

## Coding Rules

- ใช้ JavaScript module ใน `app.js`
- หลีกเลี่ยง library เพิ่มถ้าไม่จำเป็น
- ใช้ reusable function
- CSS ใช้ variables ใน `:root` และ `body.dark`
- คงชื่อฟังก์ชันสำคัญที่ README ระบุไว้
- ถ้าเพิ่ม collection หรือ field ใหม่ ต้องอัปเดต README และ `firestore.rules`

## Files

- `index.html`: โครงหน้าและ shell
- `style.css`: theme, layout, animation, responsive
- `app.js`: logic, rendering, Firebase, demo data
- `firebase-config.js`: Firebase placeholder
- `firestore.rules`: Firestore security rules
- `README.md`: คู่มือใช้งานและ deploy
- `skill.cd`: skill note สำหรับธีมและ workflow

## Current Build Steps

- ขั้นที่ 2: เชื่อม Firebase Authentication และ Firestore
- ขั้นที่ 3: ทำระบบนักเรียนและเช็กชื่อ
- ขั้นที่ 4: ทำดื่มนม แปรงฟัน สุขภาพ BMI อายุ
- ขั้นที่ 5: ทำพฤติกรรม ตารางเรียน และรายงาน
- ขั้นที่ 6: ตรวจ Bug ปรับ Responsive และเตรียม Deploy Firebase Hosting

## Product Decisions

- ตัดฟังก์ชันโฮมรูมออก เพราะซ้ำกับเช็กชื่อรายวัน
- ตารางเรียนใช้ 7 คาบเท่านั้น
- คาบที่ 4 เวลา 12.00-13.00 เป็นพักรับประทานอาหารกลางวัน
