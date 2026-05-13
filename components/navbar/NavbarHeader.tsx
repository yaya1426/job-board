import Link from "next/link";
import NavbarAccount from "./NavbarAccount";
import NavbarLinks from "./NavbarLinks";

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
        <NavbarLinks />
        <NavbarAccount />
      </div>
    </nav>
  );
};

export default NavbarHeader;
