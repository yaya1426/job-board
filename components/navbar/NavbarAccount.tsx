import { getCurrentUser } from "@/lib/current-user";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

async function NavbarAccount() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="flex items-center gap-0 ml-2">
        <Link
          href="/login"
          className="brutal-border px-5 py-2 font-heading text-sm font-bold hover:bg-foreground hover:text-background transition-none"
        >
          LOGIN
        </Link>
        <Link
          href="/signup"
          className="brutal-border border-l-0 px-5 py-2 font-heading text-sm font-bold bg-accent text-accent-foreground hover:bg-foreground hover:text-background transition-none"
        >
          SIGN UP
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0">
      <span className="brutal-border px-5 py-2 font-heading text-sm font-bold">
        {currentUser.name}
      </span>
      <SignOutButton />
    </div>
  );
}

export default NavbarAccount;
