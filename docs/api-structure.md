# API Structure

Base path: `/api/v1`

## Auth

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/auth/login` | Login with email/password and return access token |
| POST | `/auth/refresh` | Refresh JWT session |
| POST | `/auth/logout` | Revoke refresh token/session |
| GET | `/auth/me` | Current user profile and permissions |

## School Admin

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/schools/current` | Current school profile |
| PATCH | `/schools/current` | Update school settings |
| GET | `/users` | List users |
| POST | `/users` | Create user |
| PATCH | `/users/:id` | Update user or role |
| GET | `/classrooms` | List classrooms |
| POST | `/classrooms` | Create classroom |
| PATCH | `/classrooms/:id` | Update classroom |
| GET | `/students` | List/search students |
| POST | `/students` | Create student |
| PATCH | `/students/:id` | Update student |

## Daily Classroom Records

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/attendance?date=&classroomId=` | Get daily attendance |
| POST | `/attendance/bulk` | Bulk save daily attendance |
| GET | `/milk?date=&classroomId=` | Get daily milk records |
| POST | `/milk/bulk` | Bulk save milk records |
| GET | `/dental?date=&classroomId=` | Get daily dental records |
| POST | `/dental/bulk` | Bulk save dental records |
| GET | `/health?studentId=&classroomId=` | Health history |
| POST | `/health` | Create health measurement |

## Dashboard and Reports

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/dashboard/overview` | School-wide dashboard summary |
| GET | `/dashboard/classroom/:id` | Teacher classroom dashboard |
| GET | `/analytics/attendance/monthly` | Monthly attendance trend |
| GET | `/analytics/health/bmi` | BMI distribution and risk list |
| POST | `/reports/export` | Create PDF/Excel export job |
| GET | `/reports/jobs/:id` | Export job status and download URL |

## Security

- JWT access token: short TTL, stored securely by the client.
- Refresh token: httpOnly cookie or secure session store.
- Passwords: bcrypt or argon2 hash.
- RBAC middleware checks role and school scope on every protected request.
- Audit logs are written for login, export, create, update, delete, and permission changes.
