import Link from "next/link";

type Props = {
  jobId: string;
};

function ApplyAuthPrompt({ jobId }: Props) {
  const callbackUrl = `/jobs/${jobId}`;

  return (
    <div className="brutal-border lg:border-l-0 p-8">
      <h3 className="font-heading text-xl font-bold mb-6 border-b-3 border-foreground pb-4">
        APPLY NOW
      </h3>
      
      <p className="font-mono text-sm text-muted-foreground">
        Create an account or log in to apply. We will use your profile to
        prefill the application form.
      </p>
      
      <div className="mt-6 flex gap-0">
        <Link
          href={`/login?callbackUrl=${callbackUrl}`}
          className="brutal-border px-5 py-2 font-heading text-sm font-bold hover:bg-foreground hover:text-background transition-none"
        >
          LOGIN
        </Link>
        <Link
          href={`/signup?callbackUrl=${callbackUrl}`}
          className="brutal-border border-l-0 px-5 py-2 font-heading text-sm font-bold bg-accent text-accent-foreground hover:bg-foreground hover:text-background transition-none"
        >
          SIGN UP
        </Link>
      </div>
    </div>
  );
}

export default ApplyAuthPrompt;
