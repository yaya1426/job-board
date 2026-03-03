import Link from "next/link";

const NavbarHeader = () => {
  return (
    <nav className="brutal-border border-t-0 border-x-0 bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-heading text-2xl font-bold tracking-tight"
        >
          WAZIFA<span className="text-accent">_</span>
        </Link>
        <div className="flex items-center gap-0">
          <Link
            href="/"
            className="brutal-border px-5 py-2 font-heading text-sm font-bold hover:bg-foreground hover:text-background transition-none"
          >
            HOME
          </Link>
          <Link
            href="/jobs"
            className="brutal-border border-l-0 px-5 py-2 font-heading text-sm font-bold hover:bg-foreground hover:text-background transition-none"
          >
            BROWSE JOBS
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavbarHeader;
