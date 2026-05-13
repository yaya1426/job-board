import SignupForm from "@/components/auth/SignupForm";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";


type Props = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

async function SignupPage({ searchParams }: Props) {
  const { callbackUrl } = await searchParams;
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/");
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="font-heading text-3xl font-bold mb-2">SIGN UP</h1>
      <p className="font-mono text-sm text-muted-foreground mb-8">
        CREATE YOUR CANDIDATE ACCOUNT
      </p>
      <SignupForm callbackUrl={callbackUrl} />
    </div>
  );
}

export default SignupPage;