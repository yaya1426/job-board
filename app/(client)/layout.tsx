import NavbarHeader from "@/components/navbar/NavbarHeader";


function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <NavbarHeader />
            {children}
        </div>
    );
}

export default AppLayout;