"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

function SignOutButton() {
  return (
    <Button
      variant="ghost"
      className="brutal-border px-5 py-2 border-l-0 shadow-none"
      onClick={() => signOut()}
    >
      Sign Out
    </Button>
  );
}

export default SignOutButton;
