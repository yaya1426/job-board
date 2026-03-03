import { Button } from "@/components/ui/button";


function DashboardPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <Button variant="accent">Jobs</Button>
        </div>
    );
}

export default DashboardPage;