import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="font-heading text-xs font-bold uppercase block mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex w-full brutal-border bg-background px-4 py-3 font-mono text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none focus:shadow-[4px_4px_0px_0px] focus:shadow-accent disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
