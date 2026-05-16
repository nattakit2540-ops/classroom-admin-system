import { School } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-card shadow-soft md:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-primary p-8 text-white md:p-10">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-white/15">
            <School className="h-7 w-7" />
          </div>
          <h1 className="mt-8 text-3xl font-bold">ระบบธุรการชั้นเรียนและสุขภาพนักเรียน</h1>
          <p className="mt-4 max-w-md text-blue-50">เข้าสู่ระบบเพื่อเช็คชื่อ บันทึกสุขอนามัย ติดตามสุขภาพ และดูรายงานภาพรวมของโรงเรียน</p>
          <div className="mt-10 grid gap-3 text-sm">
            <p>Admin: จัดการระบบและรายงานทั้งหมด</p>
            <p>ครูประจำชั้น: บันทึกงานประจำวันและรายงานรายห้อง</p>
            <p>ผู้บริหาร: Dashboard และ Analytics ทั้งโรงเรียน</p>
          </div>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
