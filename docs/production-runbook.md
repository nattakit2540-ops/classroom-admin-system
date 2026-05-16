# Production Runbook for 18 May 2026

Production URL:

```text
https://pro-3-e6f35.web.app/
```

## What is handled by the app

- On Firebase Hosting, the app loads Firebase Web App config from `/__/firebase/init.json`.
- The production site can use Firebase Authentication without committing API keys into the repository.
- Login sessions refresh automatically so Firestore data does not disappear because of an expired token.
- Student lists are read from Firestore collections in this order: `students`, `studentProfiles`, `student_records`.
- If Firestore is unavailable, the app falls back to local sample data so the UI still opens.

## Deploy path: GitHub Actions only

Do not deploy production from the local machine with Firebase CLI. Push to the existing GitHub repository and let GitHub Actions deploy to Firebase Hosting.

Repository:

```text
https://github.com/nattakit2540-ops/classroom-admin-system
```

The workflow deploys when code is pushed to `main`.

```powershell
cd "C:\Users\Stamp\Documents\New ธุรการชั้นเรียน"
npm.cmd run build
gh auth login -h github.com
git remote add origin https://github.com/nattakit2540-ops/classroom-admin-system.git
git branch -M main
git add -A
git commit -m "Restore classroom UI and Firestore student data"
git push -u origin main
```

If `origin` already exists, use:

```powershell
git remote set-url origin https://github.com/nattakit2540-ops/classroom-admin-system.git
```

## Required GitHub Actions secrets

- `FIREBASE_PROJECT_ID` = `pro-3-e6f35`
- `FIREBASE_SERVICE_ACCOUNT` = service account JSON from Firebase project settings

Do not paste the service account JSON into source files.

## Required Firebase Console checks

1. Authentication > Sign-in method > Email/Password is enabled.
2. Authentication > Users contains the real teacher/admin account.
3. Firestore Database is created.
4. Hosting shows the site `pro-3-e6f35.web.app`.
5. Firestore rules allow signed-in users to read the student collection used by production.

## Smoke test after GitHub Actions deploy

1. Open `https://pro-3-e6f35.web.app/login`.
2. Log out once if the browser has an old session.
3. Log in with the real Firebase Authentication user.
4. Open Dashboard and confirm the student count matches Firestore.
5. Open เช็คชื่อ and confirm real student names appear.
6. Change one student's status and click บันทึกเช็คชื่อ.
7. In Firebase Console > Firestore, confirm a document appears in `attendanceRecords`.
8. Repeat a quick save for ดื่มนม and แปรงฟัน.
9. Open Reports and export Excel/PDF.
