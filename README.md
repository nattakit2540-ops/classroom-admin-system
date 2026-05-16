# ระบบธุรการชั้นเรียนและสุขภาพนักเรียน

เว็บระบบธุรการชั้นเรียนสำหรับโรงเรียนไทย ครอบคลุม Dashboard, เช็คชื่อ, ดื่มนม, แปรงฟัน, สุขภาพนักเรียน, รายงาน และผู้ดูแลระบบ

Production URL:

```text
https://pro-3-e6f35.web.app/
```

## ใช้งานระหว่างพัฒนา

```bash
npm install
npm run dev
```

เปิดที่ `http://localhost:3000`

## ตรวจคุณภาพ

```bash
npm run typecheck
npm run lint
npm run build
```

## Deploy ไป Firebase Hosting

โปรเจคนี้เป็น static web export แล้ว หลัง build ไฟล์จะอยู่ใน `out/`

```bash
npm run build
firebase deploy
```

หรือใช้คำสั่งรวม:

```bash
npm run deploy:firebase
```

## Firebase Web App Config

เมื่อ deploy บน Firebase Hosting แล้ว ระบบจะพยายามอ่าน config อัตโนมัติจาก:

```text
/__/firebase/init.json
```

ถ้าต้องการรัน local ด้วย Firebase จริง ให้คัดลอก `.env.example` เป็น `.env.local` แล้วใส่ค่า Firebase Web App:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pro-3-e6f35
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

ถ้ายังไม่ใส่ค่า ระบบจะทำงานเป็นโหมดสำรองและบันทึกลง localStorage

## ก่อนใช้งานจริง 18 พ.ค. 2569

- ยืนยันว่า Email/Password provider เปิดใน Firebase Authentication
- ใช้บัญชีผู้ใช้จริงที่สร้างไว้ใน Firebase Authentication
- ทดสอบ Login ที่ `https://pro-3-e6f35.web.app/login`
- ทดลองบันทึกเช็คชื่อ ดื่มนม และแปรงฟัน
- ตรวจว่า Firestore มีเอกสารใน `attendanceRecords`, `milkRecords`, และ `dentalRecords`
- ทดสอบ Export Excel/PDF จากหน้า Reports

## GitHub Actions

มี workflow ที่ `.github/workflows/firebase-hosting.yml`

ตั้งค่า GitHub Secrets:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_SERVICE_ACCOUNT`

เมื่อ push เข้า `main` ระบบจะตรวจ `typecheck`, `lint`, `build` แล้ว deploy ไป Firebase Hosting

## เอกสาร

- `docs/database-schema.md`
- `docs/api-structure.md`
- `docs/diagrams.md`
- `docs/deploy-guide.md`
- `docs/firebase-github-setup.md`
- `docs/production-runbook.md`
- `prisma/schema.prisma`
