import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors transition-shadow disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-[#1919A4] text-white shadow-sm hover:bg-[#17218F]",
        destructive:
          "bg-[#D92D20] text-white shadow-sm hover:bg-[#C41C1B] focus-visible:ring-[#C41C1B]/20 dark:focus-visible:ring-[#C41C1B]/40",
        outline:
          "border border-[#1919A4] bg-white text-[#1919A4] shadow-sm hover:bg-[#1919A4] hover:text-white",
        secondary:
          "bg-[#A5B4FC] text-[#1E40AF] shadow-sm hover:bg-[#93A4EB]",
        ghost: "hover:bg-[#E0E7FF] hover:text-[#1E40AF]",
        link: "text-[#1919A4] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <>
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
      <style jsx>{`
        [data-slot="button"] {
          font-family: "Montserrat", sans-serif;
          border-radius: 0.5rem;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        [data-slot="button"]:hover {
          transform: scale(1.02);
        }
      `}</style>
    </>
  )
}

export { Button, buttonVariants }
