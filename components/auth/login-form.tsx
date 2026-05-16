"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { isFirebaseConfigured } from "@/lib/firebase-config";

export function LoginForm() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    let active = true;
    isFirebaseConfigured().then((ready) => {
      if (active) setFirebaseReady(ready);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      await login(email, password);
      router.push("/");
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : "เข้าสู่ระบบไม่สำเร็จ");
    }
  }

  return (
    <form className="p-8 md:p-10" onSubmit={handleSubmit}>
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-sky-100 text-primary">
          <LockKeyhole className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">เข้าสู่ระบบ</h2>
          <p className="text-sm text-slate-500">
            {firebaseReady ? "Firebase Authentication พร้อมใช้งาน" : "โหมดสำรอง: ระบบจะบันทึกในเครื่องหากยังไม่ได้ตั้งค่า Firebase"}
          </p>
        </div>
      </div>

      <label className="mb-4 block text-sm font-medium">
        อีเมล
        <input
          className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:border-primary"
          placeholder="กรอกอีเมลผู้ใช้งาน"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label className="mb-4 block text-sm font-medium">
        รหัสผ่าน
        <input
          type="password"
          className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:border-primary"
          placeholder="กรอกรหัสผ่าน"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      {error ? <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <button className="h-11 w-full rounded-lg bg-primary font-semibold text-white disabled:opacity-60" disabled={loading}>
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}
