# Agent Handoff

## Current Objective

Prepare the classroom and student health management web app for practical use on 18 May 2026.

## Latest Changes

- Fixed mojibake Thai text in the daily record workspace source.
- Added runtime Firebase Hosting config loading from `/__/firebase/init.json` so production can use Firebase Auth without committing Web App config.
- Added `.firebaserc` for project `pro-3-e6f35`.
- Added `docs/production-runbook.md` for 18 May 2026 deployment and smoke testing.
- Kept the existing quick daily workflow: search, status summary cards, bulk status actions, per-student status changes, notes, and save.
- Preserved Firebase Hosting static export direction.
- Did not change Firebase rules, auth settings, database structure, API keys, service accounts, or secret configuration.

## Verification

- `npm.cmd run lint` passed.
- `npm.cmd run typecheck -- --pretty false` passed.
- `npm.cmd run build` passed.
- Next.js static export completed successfully.
- `firebase.cmd --version` works when `XDG_CONFIG_HOME` is pointed at a writable workspace folder.

## Known Environment Limitation

- The Codex in-app browser blocks `localhost` / `127.0.0.1` with `ERR_BLOCKED_BY_CLIENT`, so visual browser verification could not be completed inside Codex.
- Running `npm.cmd run dev -- --hostname 127.0.0.1 --port 3000` starts the app successfully when executed directly.
- Firebase CLI deploy cannot be completed inside this sandbox because Firebase authentication is not available here. Run `firebase.cmd login` from the user's normal Windows session.

## Remaining Before Real Deployment

- Deploy from the user's authenticated Windows session using `firebase.cmd deploy --only hosting`.
- Perform production smoke testing at `https://pro-3-e6f35.web.app/`.
- Add GitHub remote and push from the owner user account when the repository URL is ready.
- Add GitHub Secrets: `FIREBASE_PROJECT_ID` and `FIREBASE_SERVICE_ACCOUNT`.
- Perform a real browser smoke test on the user's browser before 18 May 2026.
