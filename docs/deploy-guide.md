# Deploy Guide

## Current Direction: Static Web + Firebase Hosting

โปรเจคนี้ปรับให้เป็นเว็บ static แล้ว เหมาะกับการเก็บบน GitHub และ deploy ไป Firebase Hosting ได้ง่าย

```bash
npm install
npm run build
firebase deploy
```

ไฟล์เว็บที่ build แล้วจะอยู่ใน `out/`

## Firebase Setup

1. สร้าง Firebase project
2. เปิด Firebase Hosting
3. เปิด Authentication แบบ Email/Password
4. เปิด Firestore Database
5. ติดตั้ง Firebase CLI
6. คัดลอก `.firebaserc.example` เป็น `.firebaserc`
7. เปลี่ยน `your-firebase-project-id` เป็น project id จริง
8. คัดลอก `.env.example` เป็น `.env.local` และใส่ค่า Firebase Web App
9. รัน `npm run deploy:firebase`

## GitHub Actions Setup

เพิ่ม GitHub Secrets:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_SERVICE_ACCOUNT`

Workflow อยู่ที่ `.github/workflows/firebase-hosting.yml`

เมื่อ push เข้า branch `main` ระบบจะตรวจ type, lint, build และ deploy ไป Firebase Hosting อัตโนมัติ

## Future Backend Path

สำหรับระบบจริง แนะนำเพิ่มเป็นลำดับ:

1. Firebase Authentication สำหรับ login
2. Firestore สำหรับข้อมูลโรงเรียน นักเรียน และ daily records
3. Cloud Functions สำหรับ export PDF/Excel และ audit logs
4. Cloud Storage สำหรับเก็บไฟล์รายงาน
5. Scheduled backup สำหรับข้อมูลสำคัญ

## Production Security Checklist

- Enforce HTTPS.
- Use Firebase Security Rules for school-scoped access.
- Keep role claims in Firebase custom claims or a locked user profile document.
- Validate report/export requests in Cloud Functions.
- Record audit logs for sensitive actions.
- Schedule Firestore export backups.
