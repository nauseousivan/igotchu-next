import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/auth";
import { adminLogin } from "../actions";
import LoginForm from "@/components/LoginForm";
import { Icon } from "@/components/icons";

export const metadata = { title: "Admin — iGotchu" };

export default async function AdminLoginPage() {
  if (await isAdminRequest()) redirect("/admin/dashboard");

  return (
    <section className="max-w-sm mx-auto pt-20">
      <div className="card p-8 pop-in">
        <div className="w-11 h-11 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center mb-5">
          <Icon name="lock" size={20} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Admin login</h1>
        <p className="text-sm text-[#6B6455] mt-1 mb-5">For the people keeping this place clean.</p>
        <LoginForm action={adminLogin} />
      </div>
    </section>
  );
}
