# Folder Structure

```text
app/
  page.tsx                 Dashboard
  login/page.tsx           Login
  attendance/page.tsx      Daily attendance
  milk/page.tsx            Milk records
  dental/page.tsx          Dental records
  health/page.tsx          Health profile and BMI
  reports/page.tsx         Reports and exports
  admin/page.tsx           Admin console
.github/
  workflows/
    firebase-hosting.yml   GitHub Actions deploy to Firebase Hosting
components/
  dashboard/               Charts and summary cards
  layout/                  Responsive shell and navigation
  records/                 Daily student record tables
  ui/                      Shared UI primitives
lib/
  data.ts                  Sample data
  utils.ts                 Shared helpers
  firebase-rest.ts         Firebase Auth/Firestore REST adapter
  local-store.ts           Local fallback storage
  firebase-config.ts       Firebase web config
docs/
  api-structure.md
  database-schema.md
  deploy-guide.md
  diagrams.md
  folder-structure.md
prisma/
  schema.prisma            Future PostgreSQL option
firebase.json              Firebase Hosting config
```

Future Firebase structure:

```text
firebase/
  functions/
    src/
      reports/
      audit/
firestore.rules
firestore.indexes.json
```
