# Classroom & Student Health Management System

## Working Agreement
- Build for Thai schools first: clear Thai labels, fast daily workflows, and mobile-friendly classroom usage.
- Prefer simple, reliable flows over complex configuration.
- Keep the UI professional SaaS-like, but dense enough for real teacher work.
- Use role-based access assumptions for Admin, Classroom Teacher, and Executive.
- Treat attendance, milk, dental care, and health records as daily operational modules with monthly reporting.

## Tech Direction
- Frontend: Next.js, React, TypeScript, TailwindCSS.
- UI system: Shadcn-inspired primitives, accessible components, responsive shell, dark mode.
- Current target: static web app for Firebase Hosting and GitHub Actions.
- Future backend target: Firebase Authentication, Firestore/Cloud Functions, or Node API when live data is needed.
- Database target: Firebase/Firestore for easy school deployment, with PostgreSQL schema kept as a future enterprise option.

## Quality Bar
- Every screen should be usable on desktop, tablet, and mobile.
- Avoid decorative-only UI. Teachers should understand the next action within seconds.
- Dashboard cards must show meaningful school data and alerts.
- Export features can begin as UI and client-side report contracts, then be wired to Firebase Functions or a separate API.
- Document schema, APIs, workflows, and reporting assumptions as the project evolves.
