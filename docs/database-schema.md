# Database Schema

Target database: PostgreSQL.

## Core Tables

```sql
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  logo_url TEXT,
  academic_year INT NOT NULL,
  semester INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'executive')),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  level_name TEXT NOT NULL,
  room_name TEXT NOT NULL,
  teacher_id UUID REFERENCES users(id),
  academic_year INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  classroom_id UUID NOT NULL REFERENCES classrooms(id),
  student_code TEXT,
  number_in_room INT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  birth_date DATE NOT NULL,
  guardian_name TEXT,
  guardian_phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Daily Records

```sql
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  classroom_id UUID NOT NULL REFERENCES classrooms(id),
  student_id UUID NOT NULL REFERENCES students(id),
  record_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'leave', 'late')),
  note TEXT,
  recorded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, record_date)
);

CREATE TABLE milk_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  classroom_id UUID NOT NULL REFERENCES classrooms(id),
  student_id UUID NOT NULL REFERENCES students(id),
  record_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('drank', 'not_drank')),
  note TEXT,
  recorded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, record_date)
);

CREATE TABLE dental_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  classroom_id UUID NOT NULL REFERENCES classrooms(id),
  student_id UUID NOT NULL REFERENCES students(id),
  record_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('brushed', 'not_brushed')),
  note TEXT,
  recorded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, record_date)
);
```

## Health and Security

```sql
CREATE TABLE health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  classroom_id UUID NOT NULL REFERENCES classrooms(id),
  student_id UUID NOT NULL REFERENCES students(id),
  measured_date DATE NOT NULL,
  weight_kg NUMERIC(5,2) NOT NULL,
  height_cm NUMERIC(5,2) NOT NULL,
  bmi NUMERIC(4,1) NOT NULL,
  bmi_category TEXT NOT NULL,
  note TEXT,
  recorded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id),
  actor_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Indexes

```sql
CREATE INDEX idx_attendance_classroom_date ON attendance_records(classroom_id, record_date);
CREATE INDEX idx_milk_classroom_date ON milk_records(classroom_id, record_date);
CREATE INDEX idx_dental_classroom_date ON dental_records(classroom_id, record_date);
CREATE INDEX idx_health_student_date ON health_records(student_id, measured_date DESC);
CREATE INDEX idx_students_classroom ON students(classroom_id, is_active);
CREATE INDEX idx_audit_school_date ON audit_logs(school_id, created_at DESC);
```
