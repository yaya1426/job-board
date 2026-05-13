"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { handleSignup } from "@/app/actions/auth/auth.action";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type Props = {
  callbackUrl?: string;
};

function SignupForm({ callbackUrl = "/" }: Props) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>();
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setErrors(undefined);
    setFormError(null);
    setIsPending(true);

    const result = await handleSignup(formData);
    if (result?.errors) {
      setErrors(result.errors);
      setIsPending(false);
      return;
    }

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsPending(false);

    if (signInResult?.error) {
      setFormError("Failed to sign in after signup. Please try again.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="mt-8 brutal-border p-6 space-y-6">
      <Input
        label="FULL NAME"
        name="name"
        placeholder="e.g. JANE DOE"
        error={errors?.name?.[0]}
      />
      <Input
        label="EMAIL"
        name="email"
        placeholder="e.g. jane@example.com"
        error={errors?.email?.[0]}
      />
      <Input
        label="LINKEDIN"
        name="linkedin"
        placeholder="https://linkedin.com/in/jane"
        error={errors?.linkedin?.[0]}
      />
      <Input
        label="PASSWORD"
        name="password"
        type="password"
        placeholder="********"
        error={errors?.password?.[0]}
      />
      <Input
        label="CONFIRM PASSWORD"
        name="confirmPassword"
        type="password"
        placeholder="********"
        error={errors?.confirmPassword?.[0]}
      />

      {formError && (
        <p className="text-sm text-destructive font-mono">{formError}</p>
      )}

      <Button type="submit" variant="accent" disabled={isPending}>
        {isPending ? "SIGNING UP..." : "SIGN UP"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          LOGIN
        </Link>
      </p>
    </form>
  );
}

export default SignupForm;
