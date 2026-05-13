"use client";

import { useSession } from "next-auth/react";
import { User } from "@/types/User";

export function useCurrentUser(): User | null {
  const { data: session } = useSession();

  if (!session?.user?.id || !session.user.email || !session.user.name) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  };
}