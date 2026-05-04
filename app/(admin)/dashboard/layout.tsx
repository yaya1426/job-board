import AdminSidebar from "@/components/navbar/AdminSidebar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}

export default DashboardLayout;
