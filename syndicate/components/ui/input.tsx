import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <>
      <input
        type={type}
        data-slot="input"
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
      <style jsx>{`
        [data-slot="input"] {
          font-family: 'Roboto', sans-serif;
          /* Updated focus border color using gold accent */
          outline: none;
        }
        [data-slot="input"]:focus-visible {
          border-color: #FFD700;
          box-shadow: 0 0 0 3px rgba(255, 217, 0, 0.4);
        }
        /* Adjust placeholder text for better readability on a dark/light background */
        [data-slot="input"]::placeholder {
          color: #888;
        }
      `}</style>
    </>
  )
}

export { Input }
