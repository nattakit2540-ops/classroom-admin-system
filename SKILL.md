# Project Skill: Thai Classroom Operations

Use this skill when designing or implementing this system.

## Domain Rules
- Attendance statuses: present, absent, leave, late.
- Milk statuses: drank, not_drank.
- Dental statuses: brushed, not_brushed.
- Health tracking includes birth date, age calculation, weight, height, BMI, BMI category, and growth trend.
- Reports are needed daily, monthly, by classroom, and school-wide.

## UX Rules
- Daily recording screens should support quick bulk actions and per-student notes.
- Color states must be readable in light and dark mode.
- Mobile screens should prioritize one-handed actions and compact student rows.
- Executive dashboards should show trends, not raw forms.
- Teacher dashboards should surface today's tasks and students needing follow-up.

## Data Rules
- Keep master data separate from daily records.
- Every daily record should include date, student, classroom, recorder, status, optional note, and timestamps.
- Use audit logs for security-sensitive actions and record updates.
- Exports should be reproducible from saved report filters.
