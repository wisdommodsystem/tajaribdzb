import { redirect } from "next/navigation";
import { getWebsiteInsights } from "@/lib/insights";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { HwayaDashboardClient } from "@/components/hwaya/HwayaDashboardClient";

export default async function HwayaDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/hwaya/login");
  }

  const insights = await getWebsiteInsights();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 md:px-6">
      <HwayaDashboardClient insights={insights} />
    </main>
  );
}
