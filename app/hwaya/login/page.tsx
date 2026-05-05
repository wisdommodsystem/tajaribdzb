import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/hwaya/AdminLoginForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function HwayaLoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/hwaya/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <AdminLoginForm />
    </main>
  );
}
