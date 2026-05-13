import Link from "next/link";

function NotAuthorizedPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <h1 className="font-heading text-4xl font-bold">NOT AUTHORIZED</h1>

      <p className="font-mono text-sm text-muted-foreground mt-4">
        You do not have permission to access this page.
      </p>

      <div className="mt-8">
        <Link
          href="/"
          className="brutal-border px-5 py-2 font-heading text-sm font-bold hover:bg-foreground hover:text-background transition-none"
        >
          GO HOME
        </Link>
      </div>
    </div>
  );
}

export default NotAuthorizedPage;