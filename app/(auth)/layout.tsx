import Link from "next/link";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ADMIN_HOSTS = ["admin.wazifa.app", "dev-admin.wazifa.app"];

async function AuthLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const host = (headersList.get("host") ?? "").toLowerCase();
  const isAdminHost = ADMIN_HOSTS.includes(host);

  if (isAdminHost) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid grid-cols-1 lg:grid-cols-2">
      <section className="hidden lg:flex brutal-border border-y-0 border-l-0 p-10 flex-col justify-between bg-accent text-accent-foreground">
        <Link href="/" className="font-heading text-3xl font-bold">
          WAZIFA<span className="text-background">_</span>
        </Link>

        <div>
          <p className="font-heading text-5xl font-bold leading-tight">
            FIND THE RIGHT ROLE. FAST.
          </p>
          <p className="font-mono text-sm mt-6 max-w-md">
            Sign in to apply for jobs, manage your profile, and track your
            applications.
          </p>
        </div>

        <p className="font-mono text-xs">AI-POWERED JOB BOARD</p>
      </section>

      <main className="flex min-h-screen items-center justify-center px-6 py-12">
        {children}
      </main>
    </div>
  );
}

export default AuthLayout;
