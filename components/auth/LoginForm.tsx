"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


type Props = {
  callbackUrl?: string;
};

function LoginForm({ callbackUrl = "/" }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setIsPending(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="mt-8 brutal-border p-6 space-y-6">
      <Input label="EMAIL" name="email" placeholder="e.g. jane@example.com" />
      <Input
        label="PASSWORD"
        name="password"
        type="password"
        placeholder="********"
      />
      <Button type="submit" variant="accent" disabled={isPending}>
        {isPending ? "LOGGING IN..." : "LOGIN"}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <p className="text-center text-sm text-muted-foreground">
        You don't have an account?{" "}
        <Link href="/signup" className="text-accent hover:underline">
          SIGN UP
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
