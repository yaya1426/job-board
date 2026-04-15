import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextAreaProps extends React.ComponentProps<"textarea"> {
  label?: string;
  error?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="font-heading text-xs font-bold uppercase block mb-2">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "w-full brutal-border bg-background px-4 py-3 font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px] focus:shadow-accent min-h-[120px] resize-y",
            error && "border-red-500",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  },
);
TextArea.displayName = "TextArea";

export { TextArea };
