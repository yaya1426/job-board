import AdminSidebar from "@/components/navbar/AdminSidebar";
import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login?callbackUrl=/dashboard");
  }

  if (currentUser.role !== "ADMIN") {
    redirect("/not-authorized");
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}

export default DashboardLayout;
