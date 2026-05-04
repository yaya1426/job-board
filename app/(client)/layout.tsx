import NavbarHeader from "@/components/navbar/NavbarHeader";
import NavbarFooter from "@/components/navbar/NavbarFooter";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <NavbarHeader />
            {children}
            <NavbarFooter />
        </div>
    );
}

export default AppLayout;