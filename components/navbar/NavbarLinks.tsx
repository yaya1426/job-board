"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/",
    label: "HOME",
  },
  {
    href: "/jobs",
    label: "BROWSE JOBS",
  },
];

function NavbarLinks() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-4">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "font-heading text-sm font-bold uppercase border-b-2 border-transparent pb-1 transition-none hover:border-accent hover:text-accent",
              isActive && "border-accent text-accent",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

export default NavbarLinks;
