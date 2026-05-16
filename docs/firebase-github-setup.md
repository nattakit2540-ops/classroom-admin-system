# Firebase + GitHub Setup

## 1. ใส่ค่า Firebase จริงใน `.env.local`

สร้างไฟล์ `.env.local` จาก `.env.example` แล้วใส่ค่า Firebase Web App จริง

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## 2. สร้างผู้ใช้จริงใน Firebase Authentication

ทำผ่าน Firebase Console:

1. ไปที่ Firebase Console
2. เลือกโปรเจค
3. Authentication
4. Sign-in method
5. เปิด Email/Password
6. ไปที่ Users
7. Add user

หรือใช้ Firebase Admin SDK/CLI ภายหลังเมื่อมี service account

## 3. Deploy Firestore Rules และ Hosting

```bash
firebase login
firebase use your-project-id
firebase deploy --only firestore,hosting
```

## 4. ตั้ง GitHub Remote และ Push

```bash
git remote add origin https://github.com/YOUR_ORG/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## 5. เพิ่ม GitHub Secrets

ใน GitHub repo:

1. Settings
2. Secrets and variables
3. Actions
4. New repository secret

เพิ่ม:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_SERVICE_ACCOUNT`

ค่า `FIREBASE_SERVICE_ACCOUNT` เป็น JSON ทั้งก้อนจาก Firebase service account

## 6. สิ่งที่ระบบทำแล้ว

- Login ผ่าน Firebase Auth REST เมื่อมี config จริง
- บันทึกเช็คชื่อ/ดื่มนม/แปรงฟันลง Firestore REST เมื่อ login แล้ว
- Dashboard อ่านข้อมูลล่าสุดจาก Firestore หรือ localStorage fallback
- Health อ่าน `healthRecords` จาก Firestore หรือ sample fallback
- Reports export CSV สำหรับ Excel และ Print/Save as PDF
