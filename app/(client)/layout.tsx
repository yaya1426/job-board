import NavbarHeader from "@/components/navbar/NavbarHeader";
import NavbarFooter from "@/components/navbar/NavbarFooter";


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