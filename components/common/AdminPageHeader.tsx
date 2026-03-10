"use client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
  subtitle: string;
  actionButtonLink: string;
  actionButtonVariant:
    | "default"
    | "accent"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  actionButtonText: string;
};

function AdminPageHeader({
  title,
  subtitle,
  actionButtonLink,
  actionButtonVariant = "default",
  actionButtonText,
}: Props) {
  const navigate = useRouter();

  const onCreateJob = () => {
    navigate.push(actionButtonLink);
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-heading font-bold">{title}</h1>
        <p className="font-mono text-sm text-muted-foreground mt-1">
          {subtitle}
        </p>
      </div>
      <Button onClick={onCreateJob} variant={actionButtonVariant}>
        {actionButtonText}
      </Button>
    </div>
  );
}

export default AdminPageHeader;
